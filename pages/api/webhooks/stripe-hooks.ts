import initStripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: any, res: any) => {
  //@ts-ignore
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const signingSecret = "whsec_aWZT4Fn41UEWC8ZLU79FY5nHO4MzzrCp";
  const buf = await buffer(req);

  let event: any;

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, signingSecret);
    // console.log("Event", event);
  } catch (err: any) {
    console.log("Error", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Event", event.type);

  // Handle the checkout.session.completed event
  switch (event.type) {
    case "customer.subscription.created":
      prisma.user.update({
        where: {
          stripeId: event.data.object.customer,
        },
        data: {
          isSubscribed: "true",
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ recived: true });
};

export default handler;
