import React from "react";
import Header from "../../components/Navbar/Header";
import Pricing from "../../components/partials/Pricing";
import Welcomeuser from "../../components/partials/Welcomeuser";
import Sidebar from "../../components/Sidebar/Sidebar";
import initStripe from "stripe";
import { useSession } from "next-auth/react";

export default function Dashoard({ sortedPlans }: { sortedPlans: any }) {
  const session = useSession();
  console.log(session);
  console.log(sortedPlans);
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") {
    //redirect to login page
    window.location.href = "/";
  } else if (session.status === "authenticated") {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <Welcomeuser />
              <Pricing plans={sortedPlans} session={session} />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export const getStaticProps = async () => {
  //@ts-ignore
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(
      async (price: {
        product: any;
        id: any;
        unit_amount: any;
        currency: any;
        recurring: { interval: any };
      }) => {
        const product = await stripe.products.retrieve(price.product);
        return {
          id: price.id,
          price: price.unit_amount / 100,
          currency: price.currency,
          interval: price.recurring?.interval,
          name: product.name,
        };
      }
    )
  );
  //sort plans by price in ascending order
  const sortedPlans = plans.sort(
    (a: { price: number }, b: { price: number }) => {
      return a.price - b.price;
    }
  );

  return {
    props: {
      sortedPlans,
    },
  };
};
