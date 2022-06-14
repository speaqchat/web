import React from "react";
import { motion } from "framer-motion";
import { Friend } from "../types";
import ProfilePicture from "../assets/img/profile_pic.png";
import FriendIcon from "../assets/icon/user-plus.svg";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useStore } from "../store/useStore";

const FriendRequest = ({
  user,
  type,
}: {
  user: Friend;
  type: "incoming" | "outgoing";
}) => {
  const { auth } = useStore();

  const queryClient = useQueryClient();

  const acceptFriendMutation = useMutation(
    () => {
      return axios.put("/acceptfriend", {
        userId: user.id,
        friendId: auth?.user.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("friends");
        queryClient.invalidateQueries("friendreq");
      },
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      className="mx-6 p-4 dark:bg-secondary-dark shadow rounded flex gap-4 items-center"
    >
      <img
        src={user.profilePicture ? user.profilePicture : ProfilePicture}
        alt={`${user.username}'s profile picture`}
        className="w-12 h-12 rounded"
      />
      <div>
        <h1 className="font-bold">{user.username}</h1>
        <p className="text-[10px] uppercase text-tertiary-light dark:text-tertiary-dark">
          {"Joined " +
            new Date(user.createdAt).toLocaleDateString("en-gb", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </div>
      {type === "incoming" ? (
        <div className="ml-auto flex gap-2">
          <img
            onClick={() => acceptFriendMutation.mutate()}
            className="p-1.5 bg-primary-light dark:invert rounded cursor-pointer hover:opacity-80 transition-opacity"
            src={FriendIcon}
            alt="Message user"
          />
        </div>
      ) : null}
    </motion.div>
  );
};

export default FriendRequest;
