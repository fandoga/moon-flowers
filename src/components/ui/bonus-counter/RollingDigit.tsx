"use client";
import { AnimatePresence, motion } from "framer-motion";

const RollingDigit = ({ digit }: { digit: string }) => {
  return (
    <div className="relative h-6 w-3.5 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "-110%" }}
          animate={{
            y: "0%",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            y: ["0%", "0%", "110%"],
            transition: {
              duration: 0.25,
              times: [0, 0.78, 1],
              ease: "easeInOut",
            },
          }}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RollingDigit;