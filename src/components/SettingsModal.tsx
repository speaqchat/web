import { motion } from "framer-motion";
import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Toggle from "react-toggle";
import "../assets/style.css";
import { useStore } from "../store/useStore";

const SettingsModal = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const { settings, toggleTheme, logout: storeLogout } = useStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    storeLogout();
    queryClient.clear();
    navigate("/login");
  };

  return (
    <div
      onClick={onClick}
      className="z-20 bg-primary-dark w-screen h-screen absolute top-0  backdrop-filter backdrop-blur-md bg-opacity-25 flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ translateY: 60, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        exit={{ translateY: -60, opacity: 0 }}
        className="dark:bg-secondary-dark bg-primary-light dark:text-white gap-2 flex flex-col px-6 py-6 rounded shadow"
      >
        <h1 className="font-bold text-lg">Settings</h1>
        <div className="bg-tertiary-dark w-96 h-px"></div>
        <div className="flex w-full justify-between mt-4">
          <p className="">Dark mode</p>
          <Toggle
            icons={false}
            checked={settings.darkMode}
            onChange={toggleTheme}
            className=""
          />
        </div>
        <div className="flex w-full justify-between mt-2">
          <p className="">Logout</p>
          <button
            onClick={() => logout()}
            className="bg-red-800 text-white rounded-md px-2 py-1"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
