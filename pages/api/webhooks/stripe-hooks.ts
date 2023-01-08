import initStripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const signingSecret = "whsec_aWZT4Fn41UEWC8ZLU79FY5nHO4MzzrCp";
  const buf = await buffer(req);

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, signingSecret);
  } catch (err: any) {
    console.log("Error", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event.type);

  switch (event.type) {
    case "customer.subscription.created":
      const useraa = prisma.user
        .update({
          where: {
            stripeId: event.data.object.customer,
          },
          data: {
            isSubscribed: "true",
            interval: event.data.object.plan.interval,
          },
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "customer.subscription.deleted":
      const user = prisma.user
        .update({
          where: {
            stripeId: event.data.object.customer,
          },
          data: {
            isSubscribed: "false",
            interval: null,
          },
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    case "customer.subscription.updated":
      const usera = prisma.user
        .update({
          where: {
            stripeId: event.data.object.customer,
          },
          data: {
            isSubscribed: "true",
            interval: event.data.object.plan.interval,
          },
        })
        .catch((err) => {
          console.log(err);
        });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ recived: true });
};

export default handler;
