import React from "react";
import { useQuery } from "react-query";
import ProfilePicture from "../assets/img/profile_pic.png";
import { useStore } from "../store/useStore";
import { Conversation as ConversationType } from "../types";

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

      <div className="flex flex-col ml-2">
        <h5 className="font-medium text-sm">{otherUser.username}</h5>
      </div>
    </div>
  );
};

export default Conversation;
