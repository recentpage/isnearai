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
  //get subscription by id
  const subscription = await stripe.subscriptions.retrieve(
    event.data.object.id
  );

  //get plan start date
  const planStartDate = subscription.current_period_start;
  //get plan end date
  const planEndDate = subscription.current_period_end;

  let creditsToAdd = 0;
  if (subscription.plan.id === "price_1MOeBVSFU8Udq9IAUs1A2yH8") {
    if (subscription.plan.interval === "month") {
      creditsToAdd = 1000;
    } else if (subscription.plan.interval === "year") {
      creditsToAdd = 1000 * 12;
    }
  } else if (
    subscription.plan.id === "price_1MOe7iSFU8Udq9IANcmJWCG9" ||
    subscription.plan.id === "price_1MOe8KSFU8Udq9IApZeNCVWm"
  ) {
    if (subscription.plan.interval === "month") {
      creditsToAdd = 20000;
    } else if (subscription.plan.interval === "year") {
      creditsToAdd = 20000 * 12;
    }
  } else if (
    subscription.plan.id === "price_1MOe8zSFU8Udq9IAVdqZQurw" ||
    subscription.plan.id === "price_1MOeAmSFU8Udq9IA5WfO3kfK"
  ) {
    if (subscription.plan.interval === "month") {
      creditsToAdd = 50000;
    } else if (subscription.plan.interval === "year") {
      creditsToAdd = 50000 * 12;
    }
  }

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
            credits: creditsToAdd,
            planstartdate: planStartDate as string,
            planenddate: planEndDate as string,
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
            credits: null,
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
            credits: creditsToAdd,
            planstartdate: planStartDate as string,
            planenddate: planEndDate as string,
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
