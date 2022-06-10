import React from "react";
import { useStore } from "../store/useStore";
import { Message as MessageType } from "../types";
import { motion } from "framer-motion";
import ProfilePicture from "../assets/img/profile_pic.png";

const Message = ({ message }: { message: MessageType }) => {
  const { auth } = useStore();

  return message.sender.username !== auth?.user?.username ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-b-md group max-w-xl"
    >
      <div className="flex gap-2">
        <img
          className="w-10 h-10 rounded-full"
          src={
            message.sender.profilePicture
              ? message.sender.profilePicture
              : ProfilePicture
          }
          alt={`${message.sender.username}'s profile picture`}
        />
        <div className="px-4 py-3 bg-[#e9e9e9] dark:bg-secondary-dark rounded-r-2xl rounded-b-2xl">
          <h4 className="font-bold leading-none">{message.sender.username}</h4>
          <hr className="opacity-10 my-2" />
          <p className="select-text cursor-text leading-none mt-1 dark:text-[#d1d1d1] text-[#5e5e5e]">
            {message.content}
          </p>
        </div>
      </div>
      <p className="text-xs uppercase text-tertiary-dark mt-1 ml-14 scale-0 group-hover:scale-100 transition-transform origin-top-left">
        {new Date(message.createdAt).toLocaleDateString("en-gb", {
          year: "2-digit",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ml-auto rounded-b-md group max-w-xl mr-4"
    >
      <div className="flex flex-row-reverse gap-2">
        <img
          className="w-10 h-10 rounded-full"
          src={
            message.sender.profilePicture
              ? message.sender.profilePicture
              : ProfilePicture
          }
          alt={`${message.sender.username}'s profile picture`}
        />
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
        {new Date(message.createdAt).toLocaleDateString("en-gb", {
          year: "2-digit",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    </motion.div>
  );
};

export default Message;
