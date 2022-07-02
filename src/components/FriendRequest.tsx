import React from "react";
import { Friend } from "../types";
import ProfilePicture from "../assets/img/profile_pic.png";
import FriendIcon from "../assets/icon/user-plus.svg";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

  const { data: profilePicture, isLoading: isLoadingPicture } = useQuery(
    ["profilePicture", user.id],
    async () => {
      const response = await fetch(
        `https://speaq-api.herokuapp.com/picture/${user.id}`
      );

      if (response.headers.get("Content-Type")?.includes("application/json"))
        return null;

      const imgBlob = await response.blob();

      return URL.createObjectURL(imgBlob);
    }
  );

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
    <div className="mx-6 p-4 dark:bg-secondary-dark shadow rounded flex gap-4 items-center">
      <img
        src={profilePicture ? profilePicture : ProfilePicture}
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
    </div>
  );
};

export default FriendRequest;
