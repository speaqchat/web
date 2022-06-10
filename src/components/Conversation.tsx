import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useStore } from "../store/useStore";
import { Conversation as ConversationType, Friend } from "../types";
import ProfilePicture from "../assets/img/profile_pic.png";

const Conversation = ({
  conversation,
  onClick,
  selectedConversation,
}: {
  conversation: ConversationType;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selectedConversation: ConversationType | null;
}) => {
  const { auth } = useStore();

  const otherUser =
    conversation.user.id !== auth?.user.id
      ? conversation.user
      : conversation.friend;

  return (
    <div
      onClick={onClick}
      className={
        "cursor-pointer w-full h-14 bg-primary-light  dark:bg-primary-dark rounded transition-shadow shadow hover:bg-opacity-80 hover:shadow-md flex items-center " +
        (selectedConversation === conversation
          ? " border border-tertiary-light dark:border-tertiary-dark"
          : " border border-transparent")
      }
    >
      <img
        className="w-10 h-10 m-2 rounded-full object-fill"
        alt=""
        src={ProfilePicture}
      />
      <div className="flex flex-col ml-2">
        <h5 className="font-medium text-sm">{otherUser.username}</h5>
      </div>
    </div>
  );
};

export default Conversation;
