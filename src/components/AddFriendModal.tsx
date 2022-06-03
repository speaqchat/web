import { motion } from "framer-motion";
import React, { MouseEventHandler } from "react";

const AddFriendModal = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLDivElement>;
}) => {
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
      ></motion.div>
    </div>
  );
};

export default AddFriendModal;
