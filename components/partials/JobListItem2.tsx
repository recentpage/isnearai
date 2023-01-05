import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function JobListItem(props: any) {
  const [spacenames, setSpacename] = useState("");
  console.log(spacenames);
  const router = useRouter();
  const savespacename = async (id: any) => {
    const spacenameinput: any = document.getElementById(`spacenameinput${id}`);
    const spacename: any = document.getElementById(`spacename${id}`);
    const spacenameinp: any = document.getElementById(`spacenameinp${id}`);
    try {
      const res = await fetch(`/api/spaces/editspacename/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: spacenameinp.value,
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
      if (data.status === "1") {
        toast("Space updated", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        spacenameinput.style.display = "none";
        spacename.style.display = "block";

        router.replace(router.asPath);
      }
    } catch (error) {
      toast(
        "Error updating space. Please try again later or contact support.",
        {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        }
      );
    }
  };

  const marksaveSpace = async (id: any) => {
    try {
      const res = await fetch(`/api/spaces/makesaved/${id}`, {
        method: "PUT",
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
        router.replace(router.asPath);
      }
      if (data.status === "1") {
        toast("Genration marked as saved", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
        });
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editSpacename = async (id: any) => {
    const spacename: any = document.getElementById(`spacename${id}`);
    const spacenameinput: any = document.getElementById(`spacenameinput${id}`);
    spacename.style.display = "none";
    spacenameinput.style.display = "block";
  };

  const cencelbtn = async (id: any) => {
    const spacename: any = document.getElementById(`spacename${id}`);
    const spacenameinput: any = document.getElementById(`spacenameinput${id}`);
    spacename.style.display = "block";
    spacenameinput.style.display = "none";
  };

  const deleteGenration = async (id: any) => {
    if (
      !confirm(
        "Are you sure you want to delete this genration? if you delete this genration you will not be able to recover it.all of your this genration data will be deleted."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/spaces/deletecopytool/${id}`, {
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
          <div
            id={`spacenameinput${props.id}`}
            className="flex "
            style={{ display: "none" }}
          >
            <input
              type="text"
              id={`spacenameinp${props.id}`}
              name={`spacenameinp${props.id}`}
              className="form-input w-full"
              onChange={(e) => setSpacename(e.target.value)}
              defaultValue={props.name}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                className="btn btn-sm btn-primary"
                name={`savebtn${props.id}`}
                id={`savebtn${props.id}`}
                onClick={() => savespacename(props.id)}
              >
                save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                name={`cancelbtn${props.id}`}
                id={`cancelbtn${props.id}`}
                onClick={() => cencelbtn(props.id)}
              >
                cancel
              </button>
            </div>
          </div>
          <div id={`spacename${props.id}`}>
            <Link
              className="inline-flex font-semibold text-slate-800"
              href={props.baseurl + "/" + props.slug}
            >
              {props.name}
            </Link>
            <div className="text-sm">id : {props.id}</div>
          </div>
        </div>
        <div className="flex">
          <div className="text-sm text-slate-500 italic whitespace-nowrap">
            {props.toolname}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4 pl-10 md:pl-0">
          <div className="text-sm text-slate-500 italic whitespace-nowrap">
            {/* {props.date} */}
          </div>
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
          {/* add edit svg width button */}
          <button
            onClick={() => editSpacename(props.id)}
            className={`${
              props.fav
                ? "text-amber-500"
                : "text-slate-300 hover:text-slate-400"
            }`}
          >
            <span className="sr-only">Edit</span>
            <svg
              className="w-5 h-5 fill-current"
              width="12"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

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
        </div>
      </div>
    </div>
  );
}

export default JobListItem;
