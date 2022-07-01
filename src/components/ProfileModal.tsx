import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import ProfilePicture from "../assets/img/profile_pic.png";
import { Friend } from "../types";

const UserModal = ({
  user,
  onClick,
}: {
  user: Friend;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { data: profilePicture, isLoading: isLoadingPicture } = useQuery(
    ["profilePicture", user.id],
    async () => {
      const response = await fetch(`http://localhost:4000/picture/${user.id}`);

      if (response.headers.get("Content-Type")?.includes("application/json"))
        return null;

      const imgBlob = await response.blob();

      return URL.createObjectURL(imgBlob);
    }
  );

  return (
    <div
      onClick={onClick}
      className="z-20 w-screen h-screen absolute top-0 bg-primary-dark backdrop-filter backdrop-blur-md bg-opacity-25 flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ translateY: 60, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        exit={{ translateY: -60, opacity: 0 }}
        className="dark:bg-secondary-dark bg-primary-light dark:text-white gap-2 flex flex-col px-6 py-6 rounded shadow"
      >
        <h1 className="font-bold">Profile</h1>
        <div className="bg-tertiary-dark w-96 h-px"></div>
        <div className="flex items-center gap-4 mt-2">
          <div className={isLoadingPicture ? "animate-pulse" : ""}>
            <img
              className="object-fill rounded-full h-16 w-16"
              src={profilePicture ? profilePicture : ProfilePicture}
              alt=""
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="leading-none font-bold">{user.username}</h2>
            <p className="leading-none text-xs text-tertiary-dark">
              {"Joined " +
                new Date(user.createdAt).toLocaleDateString("en-gb", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;
