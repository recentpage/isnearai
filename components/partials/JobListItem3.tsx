/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function JobListItem(props: any) {
  const [spacenames, setSpacename] = useState("");
  console.log(spacenames);
  const router = useRouter();

  const marksaveSpace = async (id: any) => {
    try {
      const res = await fetch(`/api/history/savecopytofav`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const data = await res.json();
      if (data.error) {
        toast(data.error, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      if (data.status === "2") {
        toast("Removed marked as saved", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        router.reload();
      }
      if (data.status === "1") {
        toast("Genration marked as saved", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        router.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGenration = async (id: any) => {
    if (
      !confirm(
        "Are you sure you want to delete this genration? if you delete this genration you will be able to recover it.this genration will goto histry there you can recover or delete."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/genration/deletegenset/${id}`, {
        method: "DELETE",
      });
      console.log(res);
      const data = await res.json();
      if (!res.ok) {
        alert("Something went wrong");
        throw new Error("Something went wrong");
      } else if (res.ok) {
        if (data.status === "success") {
          toast("Genration deleted", {
            hideProgressBar: true,
            autoClose: 2000,
            type: "success",
          });
          router.replace(router.asPath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const permeneantlyDeleteGenration = async (id: any) => {
    if (
      !confirm(
        "Are you sure you want to delete this genration? if you delete this genration you will not be able to recover it.this genration will be deleted permeneantly."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/genration/permeneantlydeletegenset/${id}`, {
        method: "DELETE",
      });
      console.log(res);
      const data = await res.json();
      if (!res.ok) {
        alert("Something went wrong");
        throw new Error("Something went wrong");
      } else if (res.ok) {
        if (data.status === "success") {
          toast("Genration permeneantly deleted", {
            hideProgressBar: true,
            autoClose: 2000,
            type: "success",
          });
          router.replace(router.asPath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const restoreGenration = async (id: any) => {
    if (
      !confirm(
        "Are you sure you want to restore this genration? if you restore this genration you will see in your genration list."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/genration/restoregenset/${id}`, {
        method: "PUT",
      });
      console.log(res);
      const data = await res.json();
      if (!res.ok) {
        alert("Something went wrong");
        throw new Error("Something went wrong");
      } else if (res.ok) {
        if (data.status === "success") {
          toast("Genration restored", {
            hideProgressBar: true,
            autoClose: 2000,
            type: "success",
          });
          router.replace(router.asPath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // make a feture for copy genration
  const copyGenration = async (text: any) => {
    //make text to copy
    const textToCopy = text;
    //copy text
    navigator.clipboard.writeText(textToCopy);
    toast("Genration copied", {
      hideProgressBar: true,
      autoClose: 2000,
      type: "success",
    });
  };

  return (
    <div
      className={`shadow-lg rounded-lg border px-5 py-4 ${
        props.type === "Featured"
          ? "bg-amber-50 border-amber-300"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
        {/* Left side */}
        <div className="flex">
          <div className="text-sm text-slate-500 font-bold italic whitespace-wrap">
            <div
              onClick={() => copyGenration(props.text)}
              className="flex items-center space-x-2 whitespace-pre-line"
            >
              {props.text}
            </div>
            <div className="text-sm text-slate-500 bg-orange-600 font-bold italic whitespace-wrap rounded-md px-2">
              {/* show date */}
              <div className="flex justify-center space-x-2 mt-6">
                <span className="text-xs text-white font-bold italic whitespace-wrap">
                  Copy Name : {props.copyname}
                </span>
                <div className="text-xs text-white font-bold italic whitespace-wrap pl-2">
                  Space Name : {props.spacename}
                </div>
                <div className="text-xs text-white font-bold italic whitespace-wrap pl-2">
                  Tool : {props.tool}
                </div>
                <div className="text-xs text-white font-bold italic whitespace-wrap pl-2">
                  Created On : {props.createdAt}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4 pl-10 md:pl-0">
          {props.type && (
            <div
              className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${
                props.type === "Featured"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              {props.type}
            </div>
          )}

          <button
            onClick={() => marksaveSpace(props.id)}
            className={`${
              props.fav
                ? "text-amber-500"
                : "text-slate-300 hover:text-slate-400"
            }`}
          >
            <span className="sr-only">Bookmark</span>
            <svg
              className="w-6 h-6"
              {...(props.isSaved == "true"
                ? { fill: "" }
                : { fill: "currentColor" })}
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
          </button>
          {props.isDeleted == "true" ? (
            <div>
              <button
                onClick={() => restoreGenration(props.id)}
                className={`${
                  props.fav
                    ? "text-amber-500"
                    : "text-slate-300 hover:text-slate-400"
                }`}
              >
                <span className="sr-only">Bookmark</span>
                <div className="text-xs text-gray-800 bg-gray-300 font-bold italic whitespace-wrap rounded-md px-2">
                  Restore
                </div>
              </button>
              <button
                onClick={() => permeneantlyDeleteGenration(props.id)}
                className={`${
                  props.fav
                    ? "text-amber-500"
                    : "text-slate-300 hover:text-slate-400"
                }`}
              >
                <span className="sr-only">Bookmark</span>
                <div className="text-xs text-gray-800 bg-gray-300 font-bold italic whitespace-wrap rounded-md px-2">
                  Delete
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => deleteGenration(props.id)}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default JobListItem;
