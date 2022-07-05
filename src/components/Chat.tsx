import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Socket } from "socket.io-client";
import ProfilePicture from "../assets/img/profile_pic.png";
import { useStore } from "../store/useStore";
import { Conversation, Friend, Message as MessageType } from "../types";
import EmojiPicker from "./EmojiPicker";
import Message from "./Message";

const Chat = ({
  conversation,
  handleProfileClick,
  socket,
}: {
  conversation: Conversation;
  handleProfileClick: (user: Friend) => void;
  socket: Socket | null;
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

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);
  const scrollElement = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const fetchMessages = async (): Promise<MessageType[]> => {
    const res = await axios.get("/messages", {
      params: {
        conversationId: conversation.id,
      },
    });

    return res.data;
  };

  const { data: messages } = useQuery(
    ["messages", conversation.id],
    fetchMessages,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const messageMutation = useMutation(
    (content: string) => {
      if (content.trim().length === 0) throw new Error();
      inputElement.current!.value = "";

      socket?.emit("sendMessage", {
        senderId: auth?.user.id,
        receiverId: otherUser.id,
        text: content,
        conversationId: conversation.id,
      });

      return axios.post("/message", {
        content: content.trim(),
        conversationId: conversation.id,
        senderId: auth?.user?.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["messages", conversation.id]);
      },
    }
  );

  useEffect(() => {
    inputElement.current?.focus();
  }, [inputElement]);

  const scrollToBottom = () => {
    const scrollHeight = scrollElement.current?.scrollHeight;
    const height = scrollElement.current?.clientHeight;
    if (scrollHeight && height && scrollElement.current) {
      const maxScrollTop = scrollHeight - height;
      scrollElement.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex flex-col flex-grow">
        <div className="bg-primary-light dark:bg-primary-dark pr-6 w-full">
          <div className="flex flex-col">
            <div
              onClick={() => handleProfileClick(otherUser)}
              className="h-24 ml-6 flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 relative">
                <div className={isLoadingPicture ? "animate-pulse" : ""}>
                  <img
                    className="object-fill w-full h-full rounded-full"
                    src={profilePicture ? profilePicture : ProfilePicture}
                    alt=""
                  />
                  <span className="absolute right-0 bottom-0 z-10 w-3 h-3 rounded-full bg-green-400"></span>
                </div>
              </div>
              <div>
                <h1 className="font-medium text-xl tracking-tight leading-none">
                  {otherUser.username}
                </h1>
                <p className="text-xs font-medium text-tertiary-light dark:text-tertiary-dark">
                  ONLINE
                </p>
              </div>
            </div>
          </div>
          <div className="h-px ml-6 bg-tertiary-light dark:bg-tertiary-dark"></div>
        </div>
      </div>

      <div
        ref={scrollElement}
        className="m-6 flex flex-col overflow-y-scroll overflow-x-hidden scroll-smooth"
      >
        {messages
          ? messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          : null}
      </div>
      <div
        className="dark:text-secondary-light text-secondary-dark font-medium
      dark:bg-secondary-dark border border-tertiary-light dark:border-tertiary-
        border-opacity-20 transition-[border]
        rounded-lg mt-auto flex items-center gap px-3 py-2.5 m-6 focus-within:border-opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 hover:opacity-80 transition-opacity cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828
            2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0
            108.486 8.486L20.5 13"
          />
        </svg>
        <div className="w-px h-full mx-3 bg-tertiary-dark"></div>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputElement.current?.value)
              messageMutation.mutate(inputElement.current?.value);
          }}
          ref={inputElement}
          spellCheck="false"
          className="outline-none bg-transparent flex-grow leading-none tracking-tight "
          type="text"
        />
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="h-5 w-5 hover:opacity-80 transition-opacity cursor-pointer ml-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.828 14.828a4 4 0 01-5.656
              0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {emojiPickerOpen ? (
          <EmojiPicker
            onBlur={() => setEmojiPickerOpen(false)}
            emojiClicked={(emoji) => (inputElement.current!!.value += emoji)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
