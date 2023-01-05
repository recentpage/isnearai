import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import { useRouter } from "next/router";

const Createspacemodal = ({ isOpen, onRequestClose }: any) => {
  const [name, setName] = useState("");

  const router = useRouter();

  const session = useSession();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      height: "190px",
    },
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch("api/spaces/createspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      });
      const data = await response.json();
      console.log(data);
      router.reload();
      return ;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-input"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Createspacemodal;
