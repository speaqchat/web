import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import ProfilePicture from "../assets/img/profile_pic.png";
import { useStore } from "../store/useStore";
import { Message as MessageType } from "../types";

const Message = ({ message }: { message: MessageType }) => {
  const { auth } = useStore();

  const { data: profilePicture, isLoading: isLoadingPicture } = useQuery(
    ["profilePicture", message.sender.id],
    async () => {
      const response = await fetch(
        `https://speaq-api.herokuapp.com/picture/${message.sender.id}`
      );

      if (response.headers.get("Content-Type")?.includes("application/json"))
        return null;

      const imgBlob = await response.blob();

      return URL.createObjectURL(imgBlob);
    }
  );

  return message.senderId !== auth?.user.id ? (
    <motion.div className="rounded-b-md group max-w-xl">
      <div className="flex gap-2">
        <div
          className={
            isLoadingPicture ? "animate-pulse flex-shrink-0" : " flex-shrink-0"
          }
        >
          <img
            className="w-10 h-10 rounded-full"
            src={profilePicture ? profilePicture : ProfilePicture}
            alt={`${message.sender.username}'s profile picture`}
          />
        </div>

        <div className="px-4 py-3 bg-[#e9e9e9] dark:bg-secondary-dark rounded-r-2xl rounded-b-2xl">
          <h4 className="font-bold leading-none">{message.sender.username}</h4>
          <hr className="opacity-10 my-2" />
          <p className="select-text cursor-text leading-none mt-1 dark:text-[#d1d1d1] text-[#5e5e5e]">
            {message.content}
          </p>
        </div>
      </div>
      <p className="text-xs uppercase text-tertiary-dark mt-1 ml-14 scale-0 group-hover:scale-100 transition-transform origin-top-left">
        {new Date(message.createdAt).getDay() !== new Date().getDay()
          ? new Date(message.createdAt).toLocaleDateString("en-gb", {
              year: "2-digit",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : new Date(message.createdAt).toLocaleTimeString("en-gb", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
      </p>
    </motion.div>
  ) : (
    <motion.div
      className="ml-auto rounded-b-md group max-w-xl mr-4"
    >
      <div className="flex flex-row-reverse gap-2">
        <div
          className={
            isLoadingPicture ? "animate-pulse flex-shrink-0" : " flex-shrink-0"
          }
        >
          <img
            className="w-10 h-10 rounded-full"
            src={profilePicture ? profilePicture : ProfilePicture}
            alt={`${message.sender.username}'s profile picture`}
          />
        </div>
        <div className="px-4 py-3 bg-[#e9e9e9] dark:bg-secondary-dark rounded-l-2xl rounded-b-2xl">
          <h4 className="font-bold leading-none text-right">
            {message.sender.username}
          </h4>
          <hr className="dark:opacity-10 my-2" />
          <p className="select-text cursor-text leading-none mt-1 dark:text-[#d1d1d1] text-[#5e5e5e]">
            {message.content}
          </p>
        </div>
      </div>
      <p className="text-xs uppercase text-tertiary-dark mt-1 mr-12 scale-0 float-right group-hover:scale-100 transition-transform origin-top-right">
        {new Date(message.createdAt).getDay() !== new Date().getDay()
          ? new Date(message.createdAt).toLocaleDateString("en-gb", {
              year: "2-digit",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : new Date(message.createdAt).toLocaleTimeString("en-gb", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
      </p>
    </motion.div>
  );
};

export default Message;
