import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { EffectCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useOnline } from "rooks";
import { io } from "socket.io-client";
import LoaderIcon from "./assets/icon/loader.svg";
import CloseIcon from "./assets/icon/x.svg";
import AddFriendModal from "./components/AddFriendModal";
import Chat from "./components/Chat";
import Conversation from "./components/Conversation";
import Friends from "./components/Friends";
import UserModal from "./components/ProfileModal";
import SettingsModal from "./components/SettingsModal";
import SideBar from "./components/SideBar";
import SocketContext from "./socket-context";
import { useStore } from "./store/useStore";
import { Conversation as ConversationType } from "./types";

const socket = io("http://localhost:8900/", { autoConnect: false });

export const App = () => {
  const { auth, settings } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth]);

  const isOnline = useOnline();

  const [toastOpen, setToastOpen] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

  const [selectedPage, setSelectedPage] = useState<"Home" | "Friends">("Home");
  const [selectedConversation, setSelectedConversation] =
    useState<null | ConversationType>(null);

  useEffect(() => {
    if (isOnline !== null) setToastOpen(!isOnline);
  }, [isOnline]);

  const fetchConversations = async (): Promise<ConversationType[]> => {
    const response = await axios.get("/conversations", {
      params: { userId: auth?.user.id },
    });
    return response.data;
  };

  const { data: conversations } = useQuery<ConversationType[], Error>(
    "conversations",
    fetchConversations
  );

  useEffect(() => {
    if (auth) {
      socket.connect();
      socket.emit("addUser", auth.user.id);
    }
  }, []);

  useEffect(() => {
    if (conversations) setSelectedConversation(conversations[0]);
  }, [conversations]);

  return (
    <SocketContext.Provider value={socket}>
      <div className={settings.darkMode ? "dark" : ""}>
        <div
          className="flex w-screen h-screen bg-primary-light text-primary-dark
        dark:bg-primary-dark dark:text-white overflow-hidden"
        >
          <SideBar
            selectedPage={selectedPage}
            onClick={(page: "Home" | "Friends") => setSelectedPage(page)}
            profileOnClick={() => setUserModalVisible(true)}
            settingsOnClick={() => setSettingsModalVisible(true)}
          />
          <div className="">
            <AnimatePresence>
              {toastOpen ? (
                <motion.div
                  className="bg-red-800 text-sm font-bold text-primary-light z-10 origin-right px-4 py-2 justify-between absolute top-8 right-6 items-center shadow-md rounded-b-md rounded-l-md flex gap-2"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                >
                  <img
                    className="h-5 w-5 animate-spin-cool"
                    src={LoaderIcon}
                    alt=""
                  />
                  <p className="mr-2 uppercase leading-none h-2.5">
                    No connection
                  </p>
                  <img
                    onClick={() => setToastOpen(false)}
                    className="hover:opacity-80 cursor-pointer"
                    src={CloseIcon}
                    alt=""
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {selectedPage === "Home" ? (
              <div className="flex flex-grow">
                <div
                  className="bg-secondary-light dark:bg-secondary-dark px-6 border-tertiary-light
              dark:border-tertiary-dark border-r h-screen flex flex-col"
                >
                  <div className="flex flex-col w-56">
                    <div className="h-24 flex items-center">
                      <h1 className="font-medium text-2xl">Messages</h1>
                    </div>
                  </div>

                  <div className="h-px w-full bg-tertiary-light dark:bg-tertiary-dark flex-shrink-0"></div>

                  <div className="mt-6 h-full flex-grow overflow-visible">
                    <div
                      className="flex items-center justify-between text-tertiary-light
                  dark:text-tertiary-dark ml-px"
                    >
                      <h4 className="text-xs tracking-tighter leading-none transform translate-y-0.5">
                        ALL MESSAGES
                        {conversations && (
                          <span className="text-brand-blue ml-2">
                            ({conversations?.length})
                          </span>
                        )}
                      </h4>

                      <div
                        className="relative group"
                        onClick={() => setAddFriendModalVisible(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-tertiary-light dark:text-tertiary-dark cursor-pointer
                        hover:opacity-80 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-6 pb-12 mx-px">
                      {conversations
                        ? conversations.map((conversation) => (
                            <Conversation
                              selectedConversation={selectedConversation}
                              key={conversation.id}
                              onClick={() =>
                                setSelectedConversation(conversation)
                              }
                              conversation={conversation}
                            />
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {selectedConversation && selectedPage === "Home" ? (
            <SocketContext.Consumer>
              {(socket) => (
                <Chat
                  socket={socket}
                  handleProfileClick={() => setUserModalVisible(true)}
                  conversation={selectedConversation}
                />
              )}
            </SocketContext.Consumer>
          ) : null}
          {selectedPage === "Friends" && <Friends />}
        </div>

        <AnimatePresence>
          {selectedConversation?.friend && userModalVisible ? (
            <UserModal
              onClick={(e) => {
                e.stopPropagation();
                setUserModalVisible(false);
              }}
              user={
                selectedConversation.user.id !== auth?.user.id
                  ? selectedConversation.user
                  : selectedConversation.friend
              }
            />
          ) : null}
          {settingsModalVisible ? (
            <SettingsModal
              onClick={() => {
                setSettingsModalVisible(false);
              }}
            />
          ) : null}
          {addFriendModalVisible ? (
            <AddFriendModal
              onClick={() => {
                setAddFriendModalVisible(false);
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </SocketContext.Provider>
  );
};
