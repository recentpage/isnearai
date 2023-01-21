import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import checkSpace from "../../checkings/checkSpace";
import getSug from "../../checkings/getSlug";
import getCredits from "../../checkings/getCreadits";

const prisma = new PrismaClient();

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  //@ts-ignore
  const userId = session.user?.id;
  const toolId = "cld5het9t0000v6gszf769g5i";
  const { proid, productname, shortdescription } = req.body;

  //get space id from pages/api/checkspace.ts import
  const spaceId = await checkSpace(userId);

  //get slug from pages/api/getslug.ts import
  const slug = await getSug(req, res, toolId);
  //remove this last /blank from slug and
  const makenewsug = slug?.split("/");
  const newSlug = makenewsug?.slice(0, makenewsug.length - 1).join("/");

  const configuration = new Configuration({
    organization: "org-irggoJlk0XzpTp72XHXOrFjM",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const api = new OpenAIApi(configuration);
  // write a prompt for openai to generate amazon product description based on the product name and short description
  const prompt = `Generate a amazon product description for a product with the following attributes: product name = '${productname}', product description = '${shortdescription}'. Make sure to include details about the product's features and benefits. genrate 3 variations of the product description.`;
  // console.log(prompt);

  try {
    //check if the user has enough credits to generate the product description if not return error
    const checkCredits = await getCredits(
      userId,
      "amazon-product-descriptions"
    );
    if (!checkCredits) {
      res
        .status(401)
        .json({ error: "Not enough credits Please Upgrade Your Plan" });
      return;
    } else {
      const response = await api.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1200,
        temperature: 0,
      });

      if (response.status === 200) {
        let text = response.data.choices[0].text;
        //get openai id
        let openaiId: string = response.data.id;
        let openaiModel: string = response.data.model;
        //get completion_tokens used
        let completionTokens = response.data.usage?.completion_tokens;
        let promptTokens = response.data.usage?.prompt_tokens;
        let openaiTokens = response.data.usage?.total_tokens;
        let openaichoices = JSON.stringify(response.data.choices);
        console.log(text);
        //create a new openai gen
        const openaiGen = await prisma.openaigen.create({
          data: {
            openaiid: openaiId,
            model: openaiModel,
            prompt: prompt,
            completion_tokens: completionTokens,
            prompt_tokens: promptTokens,
            total_tokens: openaiTokens,
            choices: openaichoices,
            toolId: toolId,
            userId: userId,
          },
        });
        let openaiGenId = openaiGen.id;
        // split the text into 3 variations by \n
        const variations = text?.split("Variation");
        console.log(variations);
        // use for and map to get the variations
        let variationsArray: any = [];
        let newVariationsArray: any = [];
        if (variations) {
          variationsArray = variations.map((element: any) => {
            if (element.split(" ").length > 3) {
              newVariationsArray.push(element);
            }
          });
        }
        let status = "";
        let act = "";
        let proidnew = "";

        if (proid === "blank") {
          const toolgen: any = await prisma.toolgen.create({
            data: {
              title: "Untitled",
              toolId: toolId,
              spaceId: spaceId,
              userId: userId,
            },
          });
          if (toolgen.id && productname && shortdescription) {
            // upadte the slug
            const updateSlug = await prisma.toolgen.update({
              where: {
                id: toolgen.id,
              },
              data: {
                //@ts-ignore
                slug: newSlug + "/" + toolgen.id,
              },
            });
            const addProductdescription =
              await prisma.amazonproductdescription.create({
                data: {
                  productname: productname,
                  shortdescription: shortdescription,
                  toolgenId: toolgen.id,
                  userId: userId,
                },
              });
          }

          if (toolgen.id) {
            if (newVariationsArray.length > 0) {
              // update toolgen id in openai gen
              const updateOpenaiGen = await prisma.openaigen.update({
                where: {
                  id: openaiGenId,
                },
                data: {
                  toolgenId: toolgen.id,
                },
              });
              newVariationsArray.map(async (e: any) => {
                //calculate char count for each variation and word count for each variation
                const charCount: number = e.length;
                const wordCount: number = e.split(" ").length;
                const variationcount: number = newVariationsArray.length;
                const copys = await prisma.copygen.create({
                  data: {
                    text: e,
                    toolgenId: toolgen.id,
                    openaigenId: openaiGenId,
                    userId: userId,
                  },
                });
                const addCharCount = await prisma.creadit.create({
                  data: {
                    amount: wordCount,
                    charCount: charCount,
                    wordCount: wordCount,
                    toolgenId: toolgen.id,
                    toolId: toolId,
                    userId: userId,
                    openaigenId: openaiGenId,
                  },
                });
              });
            }
          }
          status = "success";
          act = "create";
          proidnew = toolgen.id.toString();
        } else {
          const addProductdescription =
            await prisma.amazonproductdescription.update({
              where: {
                toolgenId: proid,
              },
              data: {
                productname: productname,
                shortdescription: shortdescription,
              },
            });
          console.log(newVariationsArray);
          if (newVariationsArray.length > 0) {
            // update toolgen id in openai gen
            const updateOpenaiGen1 = await prisma.openaigen.update({
              where: {
                id: openaiGenId,
              },
              data: {
                toolgenId: proid,
              },
            });
            newVariationsArray.map(async (e: any) => {
              //calculate char count for each variation and word count for each variation
              const charCount: number = e.length;
              const wordCount: number = e.split(" ").length;
              const variationcount: number = newVariationsArray.length;
              const copys = await prisma.copygen.create({
                data: {
                  text: e,
                  toolgenId: proid,
                  openaigenId: openaiGenId,
                  userId: userId,
                },
              });
              const addCharCount = await prisma.creadit.create({
                data: {
                  amount: wordCount,
                  charCount: charCount,
                  wordCount: wordCount,
                  toolgenId: proid,
                  toolId: toolId,
                  userId: userId,
                  openaigenId: openaiGenId,
                },
              });
            });
          }
          status = "success";
          act = "update";
        }
        res
          .status(200)
          .json({ status, act, proid: proidnew, response: response.data });
      }
    }
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default openai;
