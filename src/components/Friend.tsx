import axios from "axios";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MessageUserIcon from "../assets/icon/message-circle.svg";
import RemoveFriendIcon from "../assets/icon/user-minus.svg";
import ProfilePicture from "../assets/img/profile_pic.png";
import { useStore } from "../store/useStore";
import { Friend as FriendType } from "../types";

const Friend = ({
  user,
  onAddConversation,
}: {
  user: FriendType;
  onAddConversation: () => void;
}) => {
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

  const { auth } = useStore();

  const queryClient = useQueryClient();

  const removeFriendMutation = useMutation(() => {
    return axios.delete("/friend", {
      data: {
        id: 7,
      },
    });
  });

  const addConversationMutation = useMutation(() => {
    onAddConversation();
    return axios.post("/conversation", {
      userId: auth?.user.id,
      friendId: user.id,
    });
  });

  return (
    <div className="mx-6 p-4 dark:bg-secondary-dark shadow rounded flex gap-4 items-center">
      <div className={isLoadingPicture ? "animate-pulse" : ""}>
        <img
          src={profilePicture ? profilePicture : ProfilePicture}
          alt={`${user.username}'s profile picture`}
          className="w-12 h-12 rounded"
        />
      </div>
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
          onClick={() =>
            addConversationMutation
              .mutateAsync()
              .then(() =>
                queryClient.refetchQueries({ queryKey: "conversations" })
              )
          }
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
