import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function Pricing({
  plans,
  session,
}: {
  plans: any;
  session: any;
}) {
  const [annual, setAnnual] = useState(true);
  const [plan1, setPlan1] = useState("");
  const [priceid1, setPriceid1] = useState("");
  const [intervalok1, setIntervalok1] = useState("");
  const [plan2, setPlan2] = useState("");
  const [priceid2, setPriceid2] = useState("");
  const [intervalok2, setIntervalok2] = useState("");
  const [plan3, setPlan3] = useState("");
  const [priceid3, setPriceid3] = useState("");
  const [intervalok3, setIntervalok3] = useState("");
  const [isSubscribed, setIsSubscribed] = useState("false");

  const prprocessSubscription = async (planId: any) => {
    const res = await fetch(`/api/subscription/${planId}`, {
      method: "GET",
    });
    const data = await res.json();
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLISHABLE_KEY as string,
      {
        apiVersion: "2022-11-15",
      }
    );
    await stripe?.redirectToCheckout({
      sessionId: data.sessionId,
    });
  };

  useEffect(() => {
    if (session) {
      if (session.data?.user?.isSubscribed === "true") {
        setIsSubscribed("true");
      }
    }
    if (annual === true) {
      plans.map((plan: any) => {
        if (plan.id === "price_1MOeBVSFU8Udq9IAUs1A2yH8") {
          setPlan1(plan.price);
          setPriceid1(plan.id);
          setIntervalok1(plan.interval);
        }
        if (plan.id === "price_1MOe8KSFU8Udq9IApZeNCVWm") {
          setPlan2(plan.price);
          setPriceid2(plan.id);
          setIntervalok2(plan.interval);
        }
        if (plan.id === "price_1MOeAmSFU8Udq9IA5WfO3kfK") {
          setPlan3(plan.price);
          setPriceid3(plan.id);
          setIntervalok3(plan.interval);
        }
      });
    } else {
      plans.map((plan: any) => {
        if (plan.id === "price_1MOeBVSFU8Udq9IAUs1A2yH8") {
          setPlan1(plan.price);
          setPriceid1(plan.id);
          setIntervalok1(plan.interval);
        }
        if (plan.id === "price_1MOQpzSFU8Udq9IASvt0uLa0") {
          setPlan2(plan.price);
          setPriceid2(plan.id);
          setIntervalok2(plan.interval);
        }
        if (plan.id === "price_1MOe8zSFU8Udq9IAVdqZQurw") {
          setPlan3(plan.price);
          setPriceid3(plan.id);
          setIntervalok3(plan.interval);
        }
      });
    }
  }, [annual, plans, session]);

  return (
    <div className="grow">
      {/* Panel body */}
      <div>
        {/* Plans */}
        <section>
          <div className="mb-12">
            <h2 className="text-2xl text-slate-800 font-bold mb-4">
              Upgrade Package
            </h2>
          </div>

          {/* Pricing */}
          <div>
            {/* Toggle switch */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-sm text-slate-500 font-medium">Monthly</div>
              <div className="form-switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="sr-only"
                  checked={annual}
                  onChange={() => setAnnual(!annual)}
                />
                <label className="bg-slate-400" htmlFor="toggle">
                  <span
                    className="bg-white shadow-sm"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Pay annually</span>
                </label>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                Annually <span className="text-emerald-500">(-20%)</span>
              </div>
            </div>
            {/* Pricing tabs */}
            <div className="grid grid-cols-12 gap-6">
              {/* Tab 1 */}
              <div className="relative col-span-full xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500"
                  aria-hidden="true"
                ></div>
                <div className="px-5 pt-5 pb-6 border-b border-slate-200">
                  <header className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-tr from-emerald-500 to-emerald-300 mr-3">
                      <svg
                        className="w-6 h-6 fill-current text-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">
                      Basic
                    </h3>
                  </header>
                  <div className="text-sm mb-2">
                    Ideal for individuals that need a custom solution with
                    custom tools.
                  </div>
                  {/* Price */}
                  <div className="text-slate-800 font-bold mb-4">
                    <span className="text-2xl">$</span>
                    <span className="text-3xl">{plan1}</span>
                    <span className="text-slate-500 font-medium text-sm">
                      /{intervalok1}
                    </span>
                  </div>
                  {/* CTA */}
                  <button
                    id="upgrade1"
                    onClick={() => {
                      prprocessSubscription(priceid1);
                    }}
                    className="btn font-bold bg-indigo-500 hover:bg-indigo-600 text-white w-full"
                  >
                    {isSubscribed == "true"
                      ? "Manage Subscription"
                      : "Select Plan"}
                  </button>
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="text-xs text-slate-800 font-semibold uppercase mb-4">
                    What&apos;s included
                  </div>
                  {/* List */}
                  <ul>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">20000 words per month</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Lorem ipsum dolor sit amet</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Tab 2 */}
              <div className="relative col-span-full xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-sky-500"
                  aria-hidden="true"
                ></div>
                <div className="px-5 pt-5 pb-6 border-b border-slate-200">
                  <header className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-tr from-sky-500 to-sky-300 mr-3">
                      <svg
                        className="w-6 h-6 fill-current text-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">
                      Standard
                    </h3>
                  </header>
                  <div className="text-sm mb-2">
                    Ideal for individuals that need a custom solution with
                    custom tools.
                  </div>
                  {/* Price */}
                  <div className="text-slate-800 font-bold mb-4">
                    <span className="text-2xl">$</span>
                    <span className="text-3xl">{plan2}</span>
                    <span className="text-slate-500 font-medium text-sm">
                      /{intervalok2}
                    </span>
                  </div>
                  {/* CTA */}
                  <button
                    id="upgrade2"
                    onClick={() => {
                      prprocessSubscription(priceid2);
                    }}
                    className="btn font-bold bg-indigo-500 hover:bg-indigo-600 text-white w-full"
                  >
                    <span>
                      {isSubscribed == "true"
                        ? "Manage Subscription"
                        : "Select Plan"}
                    </span>
                  </button>
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="text-xs text-slate-800 font-semibold uppercase mb-4">
                    What&apos;s included
                  </div>
                  {/* List */}
                  <ul>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">50000 words per month</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Lorem ipsum dolor sit amet</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Lorem ipsum dolor sit amet</div>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Tab 3 */}
              <div className="relative col-span-full xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500"
                  aria-hidden="true"
                ></div>
                <div className="px-5 pt-5 pb-6 border-b border-slate-200">
                  <header className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-tr from-indigo-500 to-indigo-300 mr-3">
                      <svg
                        className="w-6 h-6 fill-current text-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                      </svg>
                    </div>
                    <h3 className="text-lg text-slate-800 font-semibold">
                      Plus
                    </h3>
                  </header>
                  <div className="text-sm mb-2">
                    Ideal for individuals that need a custom solution with
                    custom tools.
                  </div>
                  {/* Price */}
                  <div className="text-slate-800 font-bold mb-4">
                    <span className="text-2xl">$</span>
                    <span className="text-3xl">{plan3}</span>
                    <span className="text-slate-500 font-medium text-sm">
                      /{intervalok3}
                    </span>
                  </div>
                  {/* CTA */}
                  <button
                    id="upgrade3"
                    onClick={() => prprocessSubscription(priceid3)}
                    className="btn font-bold bg-indigo-500 hover:bg-indigo-600 text-white w-full"
                  >
                    <span>
                      {isSubscribed == "true"
                        ? "Manage Subscription"
                        : "Select Plan"}
                    </span>
                  </button>
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="text-xs text-slate-800 font-semibold uppercase mb-4">
                    What&apos;s included
                  </div>
                  {/* List */}
                  <ul>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">120000 words per month</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Lorem ipsum dolor sit amet</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Lorem ipsum dolor sit amet</div>
                    </li>
                    <li className="flex items-center py-1">
                      <svg
                        className="w-3 h-3 shrink-0 fill-current text-emerald-500 mr-2"
                        viewBox="0 0 12 12"
                      >
                        <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                      </svg>
                      <div className="text-sm">Quis nostrud exercitation</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Sales */}
        <section>
          <div className="px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-sm text-center xl:text-left xl:flex xl:flex-wrap xl:justify-between xl:items-center">
            <div className="text-slate-800 font-semibold mb-2 xl:mb-0">
              Looking for different configurations?
            </div>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              Contact Sales
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
