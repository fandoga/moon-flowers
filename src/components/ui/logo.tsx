"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  readLogoPoints,
  writeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";
import { useBonusCounter } from "./bonus-counter/useBonusCounter";
import { PETAL_PATH } from "./logo-mark";

const POINTS_PER_TICK = 1;
const TICK_MS = 200;

const BURST_OFFSETS = [
  { x: -40, y: -30 },
  { x: 0, y: -50 },
  { x: 40, y: -30 },
];

interface LogoProps {
  alwaysEnabled?: boolean;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({
  alwaysEnabled = false,
  color = "black",
}) => {
  const [isHover, setHover] = useState(false);
  const [isTouchDevice] = useState(
    (typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
      false,
  );
  const { isMaxed } = useBonusCounter();

  const [burst, setBurst] = useState(false);
  const prevMaxed = React.useRef(false);

  useEffect(() => {
    if (isMaxed && !prevMaxed.current) {
      setTimeout(() => setBurst(true));
      setTimeout(() => setBurst(false), 2300);
    }
    prevMaxed.current = isMaxed;
  }, [isMaxed]);

  useEffect(() => {
    if (!isHover || typeof window === "undefined") return;

    if (isTouchDevice) {
      setTimeout(() => setHover(false), 200);
    }

    const timer = window.setInterval(() => {
      writeLogoPoints(readLogoPoints() + POINTS_PER_TICK);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [isHover, isTouchDevice]);

  const isActive = burst || isHover || alwaysEnabled;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center relative"
    >
      {[0, 1, 2].map((index) => {
        const activeAnimation = {
          x: index === 0 ? [-3, -7, -3] : index === 2 ? [3, 7, 3] : [0, 0, 0],
          rotate: index === 1 ? [0, -360] : [0, 360],
          scale: 1,
        };

        return (
          <motion.div
            key={index}
            initial={false}
            animate={
              burst
                ? {
                    x: [0, BURST_OFFSETS[index].x, 0],
                    y: [0, BURST_OFFSETS[index].y, 0],
                    rotate: [0, 720],
                    scale: [1, 1.4, 1],
                  }
                : isActive
                  ? activeAnimation
                  : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={
              burst
                ? { duration: 2, ease: "easeInOut", delay: index * 0.15 }
                : isActive
                  ? {
                      x: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                      rotate: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }
                  : { duration: 0.35, ease: "easeOut" }
            }
            className="origin-center"
          >
            <svg
              width="29"
              height="25"
              viewBox="0 0 29 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={PETAL_PATH} fill={burst ? "#FFD700" : color} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Logo;
