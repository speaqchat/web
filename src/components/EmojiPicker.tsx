import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

const EmojiPicker = ({
  emojiClicked,
  onBlur,
}: {
  emojiClicked: (emoji: string) => void;
  onBlur: () => void;
}) => {
  const emojis = [
    "✌",
    "😂",
    "😝",
    "😁",
    "😱",
    "👉",
    "🙌",
    "🍻",
    "🔥",
    "🌈",
    "☀",
    "🎈",
    "🌹",
    "💄",
    "🎀",
    "⚽",
    "🎾",
    "🏁",
    "😡",
    "👿",
    "🐻",
    "🐶",
    "🐬",
    "🐟",
    "🍀",
    "👀",
    "🚗",
    "🍎",
    "💝",
    "💙",
    "👌",
    "❤",
    "😍",
    "😉",
    "😓",
    "😳",
    "💪",
    "💩",
    "🍸",
    "🔑",
    "💖",
    "🌟",
    "🎉",
    "🌺",
    "🎶",
    "👠",
    "🏈",
    "⚾",
    "🏆",
    "👽",
    "💀",
    "🐵",
    "🐮",
    "🐩",
    "🐎",
    "💣",
    "👃",
    "👂",
    "🍓",
    "💘",
    "💜",
    "👊",
    "💋",
    "😘",
    "😜",
    "😵",
    "🙏",
    "👋",
    "🚽",
    "💃",
    "💎",
    "🚀",
    "🌙",
    "🎁",
    "⛄",
    "🌊",
    "⛵",
    "🏀",
    "🎱",
    "💰",
    "👶",
    "👸",
    "🐰",
    "🐷",
    "🐍",
    "🐫",
    "🔫",
    "👄",
    "🚲",
    "🍉",
    "💛",
    "💚",
  ];

  const divRef = useRef<null | HTMLDivElement>(null);
  useOnClickOutside(divRef, onBlur);

  return (
    <motion.div
      ref={divRef}
      tabIndex={0}
      onBlur={onBlur}
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 10 }}
      transition={{ duration: 0.3 }}
      className="w-80 h-96 focus:outline-none bg-primary-light origin-bottom dark:bg-secondary-dark absolute right-6 bottom-20
    dark:text-primary-light font-bold p-6 z-40 rounded-xl bg-opacity-80
      backdrop-filter backdrop-blur-md overflow-y-scroll overflow-x-hidden shadow"
    >
      <div className="flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transform -translate-y-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1>Emoji</h1>
      </div>
      <div className="w-full px-6 h-px dark:bg-tertiary-dark my-3"></div>
      <div className="grid grid-cols-8 gap-1.5 text-2xl">
        {emojis.map((emoji) => (
          <div
            key={emoji}
            onClick={() => emojiClicked(emoji)}
            className="hover:opacity-80 cursor-pointer transition-opacity"
          >
            {emoji}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;
