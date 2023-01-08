import initStripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customerhandler = async (userid: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    },
  });
  const name = user?.name;
  const email = user?.email;
  //@ts-ignore
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const customer = await stripe.customers.create({
    name: name,
    email: email,
  });

  if (userid && customer.id) {
    await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        stripeId: customer.id,
      },
    });
  }
};

export default customerhandler;
