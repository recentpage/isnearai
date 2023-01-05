import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { PrismaClient } from "@prisma/client";

export default function Tools({ alltools }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  //get base url
  useEffect(() => {
    const url = window.location.href;
    const urlArray = url.split("/");
    setBaseUrl(urlArray[0] + "//" + urlArray[2]);
  }, []);
  const tools = alltools;
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated") {
    router.push("/");
    return;
  }

  const filteredTools = tools.filter((space: any) => {
    return space.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <main>
          {/* Search area */}
          <div className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-16 bg-indigo-500 overflow-hidden">
            {/* Glow */}
            <div className="absolute pointer-events-none" aria-hidden="true">
              <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient
                    cx="50%"
                    cy="50%"
                    fx="50%"
                    fy="50%"
                    r="50%"
                    id="ill-a"
                  >
                    <stop stopColor="#FFF" offset="0%" />
                    <stop stopColor="#FFF" stopOpacity="0" offset="100%" />
                  </radialGradient>
                </defs>
                <circle
                  style={{ mixBlendMode: "overlay" }}
                  cx="588"
                  cy="650"
                  r="256"
                  transform="translate(-332 -394)"
                  fill="url(#ill-a)"
                  fillRule="evenodd"
                  opacity=".48"
                />
              </svg>
            </div>
            {/* Illustration */}
            <div className="absolute pointer-events-none" aria-hidden="true">
              <svg
                width="1280"
                height="361"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <linearGradient
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                    id="ill2-b"
                  >
                    <stop stopColor="#A5B4FC" offset="0%" />
                    <stop stopColor="#818CF8" offset="100%" />
                  </linearGradient>
                  <linearGradient
                    x1="50%"
                    y1="24.537%"
                    x2="50%"
                    y2="100%"
                    id="ill2-c"
                  >
                    <stop stopColor="#4338CA" offset="0%" />
                    <stop stopColor="#6366F1" stopOpacity="0" offset="100%" />
                  </linearGradient>
                  <path id="ill2-a" d="m64 0 64 128-64-20-64 20z" />
                  <path id="ill2-e" d="m40 0 40 80-40-12.5L0 80z" />
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g transform="rotate(51 -92.764 293.763)">
                    <mask id="ill2-d" fill="#fff">
                      <use xlinkHref="#ill2-a" />
                    </mask>
                    <use fill="url(#ill2-b)" xlinkHref="#ill2-a" />
                    <path
                      fill="url(#ill2-c)"
                      mask="url(#ill2-d)"
                      d="M64-24h80v152H64z"
                    />
                  </g>
                  <g transform="rotate(-51 618.151 -940.113)">
                    <mask id="ill2-f" fill="#fff">
                      <use xlinkHref="#ill2-e" />
                    </mask>
                    <use fill="url(#ill2-b)" xlinkHref="#ill2-e" />
                    <path
                      fill="url(#ill2-c)"
                      mask="url(#ill2-f)"
                      d="M40.333-15.147h50v95h-50z"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className="relative w-full max-w-2xl mx-auto text-center">
              <div className="mb-5">
                <h1 className="text-2xl md:text-3xl text-white font-bold">
                  👋 Find Tool and Genrate Your Next Big Thing?
                </h1>
              </div>
              <form className="relative">
                <label htmlFor="action-search" className="sr-only">
                  Search
                </label>
                <input
                  id="action-search"
                  className="form-input pl-9 py-3 focus:border-slate-300 w-full"
                  type="Find Tool"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button
                  className="absolute inset-0 right-auto group"
                  type="submit"
                  aria-label="Search"
                >
                  <svg
                    className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Sections */}
            <div className="space-y-8">
              {/* Popular Topics */}
              <div>
                <div className="mb-5">
                  <h2 className="text-xl text-slate-800 font-bold">
                    Popular Tools
                  </h2>
                </div>
                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 lg:sidebar-expanded:grid-cols-2 xl:sidebar-expanded:grid-cols-2 gap-6">
                  {/* Item */}
                  {filteredTools.map((tool: any) => (
                    <div
                      id={`toolset${tool.id}`}
                      key={`toolset${tool.id}`}
                      className="bg-orange-100 rounded-sm text-center p-5"
                    >
                      <div className="flex flex-col h-full">
                        <div className="grow mb-2">
                          {/* Icon */}
                          <div className="inline-flex w-12 h-12 rounded-full bg-indigo-400">
                            <svg
                              className="w-12 h-12"
                              viewBox="0 0 48 48"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <linearGradient
                                  x1="50%"
                                  y1="0%"
                                  x2="50%"
                                  y2="100%"
                                  id="icon1-a"
                                >
                                  <stop stopColor="#FFF" offset="0%" />
                                  <stop stopColor="#A5B4FC" offset="100%" />
                                </linearGradient>
                              </defs>
                              <g fillRule="nonzero" fill="none">
                                <path
                                  d="M19.236 21.995h-3.333c-.46 0-.833.352-.833.786v9.428c0 .434.373.786.833.786h4.167V22.78c0-.434-.374-.786-.834-.786Z"
                                  fill="#4F46E5"
                                  opacity=".88"
                                />
                                <path
                                  d="M34.234 20.073a2.393 2.393 0 0 0-.735-.116h-5v-2.609c0-3.325-2.157-4.297-3.298-4.347a.828.828 0 0 0-.611.24.888.888 0 0 0-.257.63v4.032L21 22.077v10.924h10.19c1.1.005 2.073-.744 2.392-1.842l2.308-7.826a2.711 2.711 0 0 0-.181-1.988 2.528 2.528 0 0 0-1.475-1.272Z"
                                  fill="url(#icon1-a)"
                                  transform="translate(-.93 -.005)"
                                />
                              </g>
                            </svg>
                          </div>
                          {/* Content */}
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {tool.name}
                          </h3>
                          <div className="text-sm">
                            <p className="text-slate-600">{tool.description}</p>
                          </div>
                        </div>
                        {/* Link */}
                        <div>
                          <a
                            className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                            href={baseUrl + "/" + tool.slug}
                          >
                            Explore -&gt;
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const prisma = new PrismaClient();
  try {
    const alltools = await prisma.tools.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
    return {
      props: {
        alltools,
      },
    };
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
