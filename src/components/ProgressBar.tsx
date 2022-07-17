import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 8, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <div
        className="h-full bg-brand-blue w-full transition-transform origin-left rounded-full duration-[1500ms]"
        style={{ transform: `scaleX(${progress}%)` }}
      />
    </motion.div>
  );
};

export default ProgressBar;
