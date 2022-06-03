import axios from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import MessageUserIcon from "../assets/icon/message-circle.svg";
import RemoveFriendIcon from "../assets/icon/user-minus.svg";
import { Friend as FriendType } from "../types";

const Friend = ({ user }: { user: FriendType }) => {
  const queryClient = useQueryClient();

  const removeFriendMutation = useMutation(() => {
    return axios.delete("/friend", {
      data: {
        id: 7,
      },
    });
  });

  return (
    <div className="mx-6 p-4 dark:bg-secondary-dark shadow rounded flex gap-4 items-center">
      <img
        src={
          user.profilePicture
            ? user.profilePicture
            : "https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg"
        }
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
      <div className="ml-auto flex gap-2">
        <img
          className="p-1.5 bg-primary-dark invert dark:invert-0 rounded cursor-pointer hover:opacity-80 transition-opacity"
          src={MessageUserIcon}
          alt="Message user"
        />
        <img
          onClick={() =>
            removeFriendMutation.mutateAsync().then(() => {
              queryClient.refetchQueries({ queryKey: "friends" });
            })
          }
          className="p-1.5 bg-primary-dark invert dark:invert-0 rounded cursor-pointer hover:opacity-80 transition-opacity"
          src={RemoveFriendIcon}
          alt="Remove friend"
        />
      </div>
    </div>
  );
};

export default Friend;
