import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

export default function Copygen({
  formattedCopy,
  productdescription,
  toolgen,
}: any) {
  const router = useRouter();
  const [doctitle, setDoctitle] = useState("");
  const [productname, setProductname] = useState("");
  const [productcharacteristics, setProductcharacteristics] = useState("");
  const [toneofvoice, setToneofvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");

  //use effect
  useEffect(() => {
    if (toolgen != null && toolgen[0].title != null && toolgen.length > 0) {
      setDoctitle(toolgen[0].title);
    }
    if (productdescription != null && productdescription.length > 0) {
      setProductname(productdescription[0].productname);
      setProductcharacteristics(productdescription[0].productcharacteristics);
      setToneofvoice(productdescription[0].toneofvoice);
    }
  }, [productdescription, toolgen]);

  // handle doc title
  const handletitle = async (event: any) => {
    // save title to db using api
    const proid = router.query.toolgenId;
    if (proid == "blank") {
      toast("Please Genrate Product Description First", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "error",
      });
      return;
    }
    const title = doctitle;
    const updatetitle = await fetch(
      "/api/getcopy/productdescription/updatetitle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proid: proid,
          title: title,
        }),
      }
    );
    const data = await updatetitle.json();
    if (data.status == "success" && data.act == "update") {
      toast("Title Updated", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
      });
    }
  };

  // handle submit
  async function handleSubmit(event: any) {
    setLoading(true);
    event.preventDefault();
    try {
      const proid = router.query.toolgenId;
      const productname = event.target.productname.value;
      const productcharacteristics = event.target.productcharacteristics.value;
      const toneofvoice = event.target.toneofvoice.value;

      const response = await fetch("/api/getcopy/productdescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proid: proid,
          productname: productname,
          productcharacteristics: productcharacteristics,
          toneofvoice: toneofvoice,
        }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      console.log(data.status);
      setLoading(false);
      if (data.status == "success") {
        toast("Your Copy Was Genrated", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        if (data.act == "update") {
          router.push("/copygen/productdescription/" + proid);
        } else {
          router.push("/copygen/productdescription/" + data.proid);
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  //copy item
  const copyItem = (text: any) => {
    toast("Copied Successfully", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
    });
    navigator.clipboard.writeText(text);
  };

  // edit item
  const editItem = (id: any) => {
    //show text area
    // set text display none and text area display block
    const text = document.getElementById("textvalue" + id);
    const textarea = document.getElementById("text" + id);
    if (text != null && textarea != null) {
      text.style.display = "none";
      textarea.style.display = "block";
    }
  };

  // save copy to fav
  const saveCopyToFav = async (id: any, isSaved: any) => {
    const response = await fetch(
      "/api/getcopy/productdescription/savecopytofav",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          isSaved: isSaved,
        }),
      }
    );
    const data = await response.json();
    if (data.status == "success" && data.act == "save") {
      toast("Copy Marked As Fav", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
      });
      router.replace(router.asPath);
    } else if (data.status == "success" && data.act == "unsave") {
      toast("Copy Unmarked As Fav", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
      });
      router.replace(router.asPath);
    }
    return;
  };

  // save copy
  const saveCopy = async (id: any) => {
    // get copy text area value
    if (edit == null || edit == "") {
      toast("Please Edit First", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "error",
      });
      return;
    }
    const copy = edit;
    const proid = router.query.toolgenId;
    if (edit) {
      const response = await fetch("/api/getcopy/productdescription/editcopy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proid: proid,
          id: id,
          copy: copy,
        }),
      });
      const data = await response.json();
      if (data.status == "success" && data.act == "update") {
        toast("Copy Saved", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        router.replace(router.asPath);
        // hide text area and show text
        const text = document.getElementById("textvalue" + id);
        const textarea = document.getElementById("text" + id);
        if (text != null && textarea != null) {
          text.style.display = "block";
          textarea.style.display = "none";
        }
      }
      return;
    }
  };

  // cancel copy
  const cancelCopy = (id: any) => {
    // hide text area and show text
    const text = document.getElementById("textvalue" + id);
    const textarea = document.getElementById("text" + id);
    if (text != null && textarea != null) {
      text.style.display = "block";
      textarea.style.display = "none";
    }
  };

  // delete copy
  const deleteCopy = async (id: any) => {
    //make confirm alert
    const confirm = window.confirm("Are You Sure You Want To Delete This Copy");
    if (!confirm) {
      return;
    }
    const response = await fetch("/api/getcopy/productdescription/deletecopy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await response.json();
    if (data.status == "success" && data.act == "delete") {
      toast("Copy Deleted", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "success",
      });
      // refresh page withouth reloading
      router.replace(router.asPath);
    }
    return;
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
              id="doctitle"
              name="doctitle"
              value={doctitle}
              onChange={(e) => setDoctitle(e.target.value)}
              className="form-input w-full"
              type="text"
              placeholder="Untitled Document"
            />
          </div>
          <div className="flex items-center justify-between ml-4">
            <button
              onClick={handletitle}
              className="font-bold btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ml-auto w-full"
            >
              Save Title for Batter Understanding
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
                        value={productname}
                        onChange={(e) => setProductname(e.target.value)}
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
                        defaultValue={productcharacteristics}
                        className="form-input w-full"
                        rows={4}
                        cols={4}
                        onChange={(e) =>
                          setProductcharacteristics(e.target.value)
                        }
                      ></textarea>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="country"
                      >
                        Tone of voice <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="toneofvoice"
                        name="toneofvoice"
                        className="form-select w-full"
                        value={toneofvoice}
                        onChange={(e) => setToneofvoice(e.target.value)}
                      >
                        <option>Excited</option>
                        <option>Professional</option>
                        <option>Encouraging</option>
                        <option>Informative</option>
                        <option>Funny</option>
                        <option>Dramatic</option>
                        <option>Witty</option>
                        <option>Sarcastic</option>
                        <option>Engaging</option>
                        <option>Relaxed</option>
                        <option>Creative</option>
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
          </div>
        </div>

        {/* Image */}
        <div className="p-2 w-full md:w-1/1 border-r-2 h-[calc(100vh-5.75rem)] sticky top-16 overflow-y-scroll no-scrollbar overscroll-contain">
          <div className="pt-4">
            {/* items */}
            {Array.isArray(formattedCopy) && (
              <div className="pt-2">
                {formattedCopy.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start px-8 mb-4 last:mb-0"
                  >
                    <div className="font-bold text-sm bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white p-3 rounded-lg rounded-tl-none border border-transparent shadow-md mb-1">
                      <div id={`text${item.id}`} style={{ display: "none" }}>
                        <div className="flex items-center justify-between">
                          <textarea
                            id={`textarea${item.id}`}
                            className="form-input w-full"
                            onChange={(e) => setEdit(e.target.value)}
                            rows={16}
                          >
                            {item.text}
                          </textarea>
                        </div>
                        <div className="flex pt-2 items-center justify-between">
                          <div className="w-full">
                            <button
                              onClick={() => saveCopy(item.id)}
                              className="font-bold text-white rounded-xl text-lg btn bg-indigo-500 ml-auto w-full"
                            >
                              Save Copy
                            </button>
                          </div>
                          <div className="w-full pl-2">
                            <button
                              onClick={() => cancelCopy(item.id)}
                              className="font-bold text-white rounded-xl text-lg btn bg-indigo-500 ml-auto w-full"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                      <div id={`textvalue${item.id}`}>{item.text}</div>
                      <div className="flex pt-4 justify-items-end justify-between">
                        {/* add time also */}

                        <div className="flex rounded-sm text-slate-400 justify-center bg-white w-full">
                          {item.numWords} words / {item.numCharacters}{" "}
                          characters , {item.createdAt}
                        </div>
                        <div className="flex pl-4 justify-between w-full">
                          <svg
                            onClick={() => copyItem(item.text)}
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
                            onClick={() => editItem(item.id)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <svg
                            className="w-6 h-6"
                            onClick={() => deleteCopy(item.id)}
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
                          {/* if isSaved true make fill currentColor else*/}
                          <svg
                            className="w-6 h-6"
                            onClick={() => saveCopyToFav(item.id, item.isSaved)}
                            {...(item.isSaved == "true"
                              ? { fill: "currentColor" }
                              : { fill: "none" })}
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const proid = context.query["toolgenId"];
  console.log(proid);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  //if proid == blank return blank props
  if (proid == "blank") {
    return {
      props: {
        session,
        proid,
        data: [],
      },
    };
  }

  if (proid) {
    // get document title data from prisma toolgen table
    const toolgen = await prisma.toolgen.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
        id: proid,
      },
    });

    // get product description data from prisma
    const productdescription = await prisma.productdescription.findMany({
      select: {
        id: true,
        productname: true,
        productcharacteristics: true,
        toneofvoice: true,
      },
      where: {
        toolgenId: proid,
      },
    });
    //get the data from the prisma table copy all copy that have ide proid
    let copy = await prisma.copygen.findMany({
      select: {
        id: true,
        text: true,
        isSaved: true,
        createdAt: true,
      },
      where: {
        toolgenId: proid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    //format the date and time also use the map function to loop through the array

    const formattedCopy = copy.map((item) => {
      const words = item.text?.split(" ");
      const numWords = words?.length;
      const numCharacters = item.text?.length;
      //calculate text words and characters and add it to the object
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
        numWords,
        numCharacters,
      };
    });

    return {
      props: {
        formattedCopy,
        productdescription,
        toolgen,
      },
    };
  }
}
