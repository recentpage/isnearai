/* eslint-disable @next/next/no-img-element */
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Header from "../../components/Navbar/Header";
import JobListItem3 from "../../components/partials/JobListItem3";
import Sidebar from "../../components/Sidebar/Sidebar";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function History({ copy, deletedCopy, savedCopy }: any) {
  //get base url
  const [baseurl, setBaseurl] = React.useState("");
  const [Copies, setCopies] = React.useState(copy);
  const [isclicked, setIsclicked] = React.useState("");
  console.log("isclicked", isclicked);
  React.useEffect(() => {
    setBaseurl(window.location.origin);
    //get isclicked from local storage
    const isclicked = localStorage.getItem("isclicked");
    //if isclicked is not present in local storage
    if (isclicked === null) {
      localStorage.setItem("isclicked", "all");
      setIsclicked("all");
    } else {
      setIsclicked(isclicked);
      if (isclicked === "all") {
        setCopies(copy);
      }
      if (isclicked === "saved") {
        setCopies(savedCopy);
      }
      if (isclicked === "deleted") {
        setCopies(deletedCopy);
      }
    }
  }, [copy, deletedCopy, savedCopy]);

  const AllCopyClicked = () => {
    setCopies(copy);
    // save isclicked is saved in local storage
    localStorage.setItem("isclicked", "all");
    setIsclicked("all");
  };

  const SavedCopyClicked = () => {
    setCopies(savedCopy);
    //save isclicked is saved in local storage
    localStorage.setItem("isclicked", "saved");
    setIsclicked("saved");
  };

  const DeletedCopyClicked = () => {
    setCopies(deletedCopy);
    //save isclicked is saved in local storage
    localStorage.setItem("isclicked", "deleted");
    setIsclicked("deleted");
  };

  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = React.useState("");
  //filter based on isSaved

  const filteredJobs = Copies.filter((job: any) => {
    return job.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-5">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                  History ✨
                </h1>
              </div>

              {/* Post a job button */}
              <button className="btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <Link href={`${baseurl}/tools`}>
                  <span className="hidden font-semibold text-lg xs:block ml-2">
                    Create Copy
                  </span>
                </Link>
              </button>
            </div>

            {/* Page content */}
            <div className="flex flex-col space-y-10 sm:flex-row sm:space-x-6 sm:space-y-0 md:flex-col md:space-x-0 md:space-y-10 xl:flex-row xl:space-x-6 xl:space-y-0 mt-9">
              {/* Sidebar */}
              {/* <JobSidebar /> */}

              {/* Content */}
              <div className="w-full">
                {/* Search form */}
                <div className="mb-5">
                  <form className="relative">
                    <label htmlFor="job-search" className="sr-only">
                      Search
                    </label>
                    <input
                      id="job-search"
                      className="form-input w-full pl-9 focus:border-slate-300"
                      type="search"
                      placeholder="Search For a History"
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

                {/* Jobs header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-slate-500 italic">
                    {/* make two tabs like buttons */}
                    <button
                      onClick={() => AllCopyClicked()}
                      className={`btn to-pink-500 text-gray-900 shadow-lg font-bold ${
                        isclicked == "all" ? "bg-slate-300" : "bg-lime-200"
                      }`}
                    >
                      All Copies
                    </button>
                    <button
                      onClick={() => SavedCopyClicked()}
                      className={`btn to-pink-500 text-gray-900 shadow-lg font-bold ${
                        isclicked == "saved" ? "bg-slate-300" : "bg-lime-200"
                      } ml-4`}
                    >
                      Saved Copies
                    </button>
                    <button
                      onClick={() => DeletedCopyClicked()}
                      className={`btn to-pink-500 text-gray-900 shadow-lg font-bold ${
                        isclicked == "deleted" ? "bg-slate-300" : "bg-lime-200"
                      } ml-4`}
                    >
                      Deleted Copies
                    </button>
                  </div>
                  {/* Sort */}
                  <div className="text-sm"></div>
                </div>

                {/* Jobs list */}
                <div className="space-y-2">
                  {filteredJobs.map((fields: any) => {
                    return (
                      <JobListItem3
                        key={fields.id}
                        id={fields.id}
                        text={fields.text}
                        tool={fields["toolgen"].tool.name}
                        copyname={fields["toolgen"].title}
                        spacename={fields["toolgen"].space.name}
                        createdAt={fields.createdAt}
                        isSaved={fields.isSaved}
                        isDeleted={fields.isDeleted}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //@ts-ignore
  const userId = session.user?.id;

  //make join with toolgen table and get toolgen title copygen table has toolgenId also get
  const copy = await prisma.copygen.findMany({
    where: {
      userId: userId,
      isDeleted: "false",
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      isSaved: true,
      toolgen: {
        select: {
          title: true,
          tool: {
            select: {
              name: true,
            },
          },
          space: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  //get isDeleted true
  const deletedCopy = await prisma.copygen.findMany({
    where: {
      userId: userId,
      isDeleted: "true",
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      isDeleted: true,
      toolgen: {
        select: {
          title: true,
          tool: {
            select: {
              name: true,
            },
          },
          space: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  //get isSaved true
  const savedCopy = await prisma.copygen.findMany({
    where: {
      userId: userId,
      isSaved: "true",
      isDeleted: "false",
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      isSaved: true,
      toolgen: {
        select: {
          title: true,
          tool: {
            select: {
              name: true,
            },
          },
          space: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const formetedCopy = copy.map((item: any) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    };
  });

  const formetedCopyDeleted = deletedCopy.map((item: any) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    };
  });

  const formetedCopySaved = savedCopy.map((item: any) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    };
  });

  return {
    props: {
      copy: formetedCopy,
      deletedCopy: formetedCopyDeleted,
      savedCopy: formetedCopySaved,
    },
  };
}
