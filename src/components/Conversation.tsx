import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ProfilePicture from "../assets/img/profile_pic.png";
import { useStore } from "../store/useStore";
import { Conversation as ConversationType, Message } from "../types";

const Conversation = ({
  conversation,
  onClick,
  selectedConversation,
  onMiddleClick,
  onContextMenu,
}: {
  conversation: ConversationType;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selectedConversation: ConversationType | null;
  onMiddleClick: () => void;
  onContextMenu: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { auth } = useStore();

  const otherUser =
    conversation.user.id !== auth?.user.id
      ? conversation.user
      : conversation.friend;

  const queryClient = useQueryClient();

  const messages = queryClient.getQueryData(["messages", conversation.id]) as
    | Message[]
    | null;

  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (messages) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.senderId !== auth?.user.id) {
        setLastMessage(lastMessage.content);
      }
    }
  }, [messages]);

  const { data: profilePicture, isLoading: isLoadingPicture } = useQuery(
    ["profilePicture", otherUser.id],
    async () => {
      const response = await fetch(
        `https://speaq-api.herokuapp.com/picture/${otherUser.id}`
      );

      if (response.headers.get("Content-Type")?.includes("application/json"))
        return null;

      const imgBlob = await response.blob();

      return URL.createObjectURL(imgBlob);
    }
  );

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onAuxClick={(e) => e.button === 1 && onMiddleClick()}
      className={
        "cursor-pointer w-full h-14 bg-primary-light  dark:bg-primary-dark rounded transition-shadow shadow hover:bg-opacity-80 hover:shadow-md flex items-center " +
        (selectedConversation === conversation
          ? " border border-tertiary-light dark:border-tertiary-dark"
          : " border border-transparent")
      }
    >
      <div className={isLoadingPicture ? "animate-pulse" : ""}>
        <img
          className="w-10 h-10 m-2 rounded-full object-fill"
          alt=""
          src={profilePicture ? profilePicture : ProfilePicture}
        />
      </div>

      <div className="flex flex-col ml-2 gap-1">
        <h5 className="font-medium leading-none">{otherUser.username}</h5>
        {lastMessage && (
          <p className="opacity-80 text-sm leading-none font-normal w-24 truncate">
            {lastMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversation;
