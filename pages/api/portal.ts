import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import initStripe from "stripe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //get session from req
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  console.log("session", session);

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
  });

  const { planId } = req.query;

  const lineItems: any = [{ price: planId, quantity: 1 }];

  const portalSession = await stripe.billingPortal.sessions.create({
    // @ts-ignore
    customer: session.user?.stripeId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  res.send({ url: portalSession.url });
};

export default handler;
