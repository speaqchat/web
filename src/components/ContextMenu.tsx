import React, { useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { motion } from "framer-motion";
import { Conversation } from "../types";
import { usePinnedStore } from "../store/useStore";

const ContextMenu = ({
  position,
  handleBlur,
  conversation,
}: {
  position: { x: number; y: number };
  handleBlur: () => void;
  conversation: Conversation | null;
}) => {
  const {
    addPinnedConversation,
    pinnedConversations,
    removePinnedConversation,
  } = usePinnedStore();

  // check if conversation is in pinnedConversations
  const isPinned = !!pinnedConversations?.find(
    (pinnedConversation) => pinnedConversation.id === conversation?.id
  );

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(contextMenuRef, handleBlur);

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      ref={contextMenuRef}
      onBlur={() => handleBlur}
      className={`w-64 z-40 origin-top bg-secondary-dark border border-tertiary-dark rounded absolute`}
      style={{ left: position.x, top: position.y }}
    >
      <div
        onClick={() => {
          if (!isPinned) {
            addPinnedConversation(conversation);
            handleBlur();

            return;
          }
          removePinnedConversation(conversation);

          handleBlur();
        }}
        className="p-2 text-sm gap-2 items-center flex cursor-pointer hover:opacity-80 transition-opacity text-white bg-primary-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="feather feather-map-pin"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <div className="h-6 w-px bg-tertiary-dark bg-opacity-50" />
        <p className="text-sm">{isPinned ? "Unpin" : "Pin"}</p>
      </div>
    </motion.div>
  );
};

export default ContextMenu;
