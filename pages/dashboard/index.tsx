import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar/Header";
import Pricing from "../../components/partials/Pricing";
import Welcomeuser from "../../components/partials/Welcomeuser";
import Sidebar from "../../components/Sidebar/Sidebar";
import initStripe from "stripe";
import { useSession } from "next-auth/react";

export default function Dashoard({ sortedPlans }: { sortedPlans: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plancreadits, setPlancreadits] = React.useState(0);
  const [bonuscreadits, setBonuscreadits] = React.useState(0);
  const [totalcreadits, setTotalcreadits] = React.useState(0);
  const [usedcreadits, setUsedcreadits] = React.useState(0);

  const session = useSession();

  useEffect(() => {
    //@ts-ignore
    // if (session.data?.user?.credits && session.data?.user?.bonuscredits) {
    //@ts-ignore
    setPlancreadits(session.data?.user?.credits);
    //@ts-ignore
    setBonuscreadits(session.data?.user?.bonuscredits);
    setTotalcreadits(
      //@ts-ignore
      session.data?.user?.credits + session.data?.user?.bonuscredits
    );
    //@ts-ignore
    setUsedcreadits(session.data?.user?.usedcredits);
    // }
  }, [session]);
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") {
    //redirect to login page
    window.location.href = "/";
  } else if (session.status === "authenticated") {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <Welcomeuser />
              <>
                <div className="py-4">
                  <div className="bg-white shadow-md rounded-lg border">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg leading-6 font-bold text-blue-900 pb-2">
                        Used creadits : {usedcreadits}
                      </h4>
                      <div className="bg-blue-500 rounded-lg">
                        <div
                          className="h-6 progress bg-orange-400 rounded-lg"
                          style={{
                            width: `${(usedcreadits / totalcreadits) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <div className="bg-gray-100 shadow-md rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg leading-6 font-bold text-blue-900">
                        Plan creadits : {plancreadits}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <div className="bg-gray-100 shadow-md rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg leading-6 font-bold text-blue-900">
                        Bonus creadits : {bonuscreadits}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <div className="bg-gray-100 shadow-md rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-lg leading-6 font-bold text-blue-900">
                        Total creadits : {totalcreadits}
                      </h4>
                    </div>
                  </div>
                </div>
              </>
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
