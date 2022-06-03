import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useStore } from "../store/useStore";
import { Conversation as ConversationType, Friend } from "../types";

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
  const [otherUser, setOtherUser] = useState<null | Friend>(null);

  const fetchOtherUser = async (otherUserId: number) => {
    const res = await axios.get("/user", {
      data: { user_id: otherUserId },
    });

    setOtherUser(res.data);
  };

  useEffect(() => {
    const otherUserId =
      conversation.friend.id === auth?.user?.id
        ? conversation.friend.id
        : conversation.user_id;

    fetchOtherUser(otherUserId);
  }, [auth?.user?.id]);

  return (
    otherUser && (
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
          src={
            "https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg"
          }
        />
        <div className="flex flex-col ml-2">
          <h5 className="font-medium text-sm">{otherUser?.username}</h5>
        </div>
      </div>
    )
  );
};

export default Conversation;
