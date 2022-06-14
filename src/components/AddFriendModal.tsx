import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useStore } from "../store/useStore";

const AddFriendModal = ({ onClick }: { onClick: () => void }) => {
  const { auth } = useStore();
  const [username, setUsername] = useState("");

  const queryClient = useQueryClient();

  const addFriendMutation = useMutation(
    () => {
      return axios.post("/friend", {
        userId: auth?.user.id,
        username,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("friends");
        queryClient.invalidateQueries("friendreq");
        onClick();
      },
    }
  );

  return (
    <div
      onClick={() => onClick()}
      className="z-20 bg-primary-dark w-screen h-screen absolute top-0  backdrop-filter backdrop-blur-md bg-opacity-25 flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ translateY: 60, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        exit={{ translateY: -60, opacity: 0 }}
        className="dark:bg-secondary-dark flex bg-primary-light dark:text-white rounded shadow border border-tertiary-light dark:border-tertiary-dark items-center"
      >
        <span className="mx-2 leading-none h-3.5">@</span>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addFriendMutation.mutate();
            }

            if (e.key === "Escape") {
              onClick();
            }
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          spellCheck={false}
          autoFocus
          type="text"
          className="bg-transparent focus:ring-0 outline-none py-2 w-96"
        />
        <svg
          onClick={() => addFriendMutation.mutate()}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 cursor-pointer hover:opacity-80 transition-opacity w-5 mx-2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      </motion.div>
    </div>
  );
};

export default AddFriendModal;
