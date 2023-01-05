import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CustomEditor } from "../../../components/editor/CustomEditor";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function Toolcopy() {
  const router = useRouter();
  const { toolcopy } = router.query;
  const [copys, setCopy] = React.useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const [data, setData] = React.useState<any>(null);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/tools/${toolcopy}`);
      const json = await res.json();
      setData(json);
    };
    if (toolcopy != undefined) {
      fetchData();
    }
  }, [toolcopy]);

  const copyItem = (text: any) => {
    toast("Copied Successfully", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
    });
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();
    try {
      // dont use form dATA
      const productname = event.target.productname.value;
      const productcharacteristics = event.target.productcharacteristics.value;

      const response = await fetch("/api/getcopy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productname: productname,
          productcharacteristics: productcharacteristics,
        }),
      });
      const data = await response.json();
      const results = data.text.split("\n");
      for (let i = 0; i < results.length; i++) {
        const words = results[i].split(" ");
        if (words.length < 3) {
          results.splice(i, 1);
          i--;
        }
      }
      console.log(data);
      console.log(results);
      setCopy(results);
      setLoading(false);
      toast("Your Copy Was Genrated", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (outputRef.current && copys) {
      outputRef.current.innerHTML = copys;
    }
  }, [copys]);

  if (!data) {
    return <div>Loading...</div>;
  } else {
    console.log(data);
  }
  const addtoeditor = async (event: any) => {
    alert("ll");
  };
  return (
    <main className="bg-white">
      <div className="flex-1 border-b-2">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link className="block" href="/">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient
                  x1="28.538%"
                  y1="20.229%"
                  x2="100%"
                  y2="108.156%"
                  id="logo-a"
                >
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="88.638%"
                  y1="29.267%"
                  x2="22.42%"
                  y2="100%"
                  id="logo-b"
                >
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path
                d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                fill="#4F46E5"
              />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
          </Link>
          <div className="w-96 rounded-xl ml-auto">
            <input
              id="company-name"
              className="form-input w-full"
              type="text"
              placeholder="Untitled Document"
            />
          </div>
          <div className="flex items-center justify-between ml-4">
            <button className="font-bold btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ml-auto w-full">
              Save This Response For Feature
            </button>
          </div>
        </div>
      </div>
      <div className="relative flex">
        {/* Content */}
        <div className="w-full md:w-1/2 border-r-2 h-[calc(100vh-5.75rem)] sticky top-16 overflow-y-scroll no-scrollbar overscroll-contain">
          <div className="min-h-screen h-full flex flex-col after:flex-1">
            <div className="px-4 py-8">
              <div className="max-w-sm mx-auto">
                {/* htmlForm */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2 mb-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="productname"
                      >
                        Product/Service Name
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="productname"
                        name="productname"
                        className="form-input w-full"
                        type="text"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="productcharacteristics"
                      >
                        Product/Service Characteristics
                        <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="productcharacteristics"
                        name="productcharacteristics"
                        className="form-input w-full"
                        rows={4}
                        cols={4}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="country"
                      >
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        className="form-select w-full"
                      >
                        <option>USA</option>
                        <option>Italy</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      id="textgenrator"
                      accessKey="j"
                      className="font-bold rounded-xl text-xl btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white ml-auto w-full"
                    >
                      {loading ? "Loading..." : "Generate Copy"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* items */}
            {Array.isArray(copys) && (
              <div>
                {copys.map((text, index) => (
                  <div
                    key={index}
                    className="flex items-start px-8 mb-4 last:mb-0"
                  >
                    <div className="font-bold text-sm bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white p-3 rounded-lg rounded-tl-none border border-transparent shadow-md mb-1">
                      <div id="flexi">{text}</div>
                      <div className="flex pl-96 pt-4 justify-items-end justify-between">
                        <svg
                          onClick={() => copyItem(text)}
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <svg
                          className="w-6 h-6"
                          onClick={addtoeditor}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="p-2 w-full md:w-1/2 border-r-2 h-[calc(100vh-5.75rem)] sticky top-16 overflow-y-scroll no-scrollbar overscroll-contain">
          <CustomEditor />
        </div>
      </div>
    </main>
  );
}

export default Toolcopy;
