import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function JobListItem(props: any) {
  const router = useRouter();
  const selectSpace = async (id: any) => {
    try {
      const res = await fetch(`/api/spaces/select/${id}`, {
        method: "GET",
      });

      const data = await res.json();
      console.log(res);
      if (data.selected == "true") {
        toast("Space selected", {
          hideProgressBar: true,
          type: "success",
        });
        router.push("/spaces");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSpace = async (id: any) => {
    if (!confirm("Are you sure you want to delete this space?")) {
      return;
    }
    try {
      const res = await fetch(`/api/spaces/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast(data.error, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      if (data.status === "1") {
        toast("Space deleted", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        router.push("/spaces");
      }
    } catch (error) {
      toast(
        "Error deleting space. Please try again later or contact support.",
        {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        }
      );
    }
  };
  return (
    <div
      className={`shadow-lg rounded-sm border px-5 py-4 ${
        props.type === "Featured"
          ? "bg-amber-50 border-amber-300"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
        {/* Left side */}
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className="w-9 h-9 shrink-0 mt-1">
            <img
              className="w-9 h-9 rounded-full"
              src={props.image}
              width="36"
              height="36"
              alt={props.company}
            />
          </div>
          <div>
            <Link
              className="inline-flex font-semibold text-slate-800"
              href={props.link+"/"+props.id}
            >
              {props.name}
            </Link>
            <div className="text-sm">id : {props.id}</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 pl-10 md:pl-0">
          <div className="text-sm text-slate-500 italic whitespace-nowrap">
            {/* {props.date} */}
          </div>
          <button
            onClick={() => deleteSpace(props.id)}
            className={`${
              props.fav
                ? "text-amber-500"
                : "text-slate-300 hover:text-slate-400"
            }`}
          >
            <span className="sr-only">Bookmark</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="red"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
        {/* Right side */}
        <div className="flex">
          <div className="text-sm text-slate-500 italic whitespace-nowrap">
            {props.selected == "true" ? (
              <button className="btn bg-green-500 text-white">Selected</button>
            ) : (
              <button
                className="btn bg-orange-500 text-white"
                onClick={() => selectSpace(props.id)}
              >
                Select
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListItem;
