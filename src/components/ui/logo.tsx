import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useAddLoyalityTransactionAccrual,
  useLoyalityCardData,
} from "@/entities/loyaliti";
import {
  readLogoPoints,
  writeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";

const POINTS_PER_TICK = 1;
const TICK_MS = 400; // 2.5 points per second

const PETAL_PATH =
  "M14.5 2.5C15.5077 2.5 16.4742 2.88312 17.1868 3.56507C17.8993 4.24702 18.2997 5.17194 18.2997 6.13636L18.2978 6.18636L18.3263 6.17C19.1267 5.72559 20.07 5.57837 20.9765 5.75636L21.2017 5.80727C21.6815 5.93143 22.1309 6.14514 22.5241 6.43611C22.9173 6.72708 23.2465 7.08957 23.4928 7.50273C23.9939 8.33725 24.1299 9.32756 23.8709 10.2576C23.612 11.1877 22.9793 11.982 22.1107 12.4673L22.0461 12.5L22.1136 12.5355C22.9508 13.004 23.5698 13.7605 23.8443 14.6507C24.1188 15.541 24.0281 16.4979 23.5907 17.3264L23.4947 17.4955C23.2483 17.9092 22.9187 18.2722 22.525 18.5635C22.1313 18.8547 21.6813 19.0686 21.2008 19.1926C20.7204 19.3167 20.219 19.3485 19.7257 19.2863C19.2323 19.224 18.7567 19.069 18.3263 18.83L18.2978 18.8118L18.2997 18.8636C18.2997 19.7966 17.925 20.6938 17.2531 21.3698C16.5813 22.0458 15.6636 22.4488 14.69 22.4955L14.5 22.5C13.4923 22.5 12.5258 22.1169 11.8132 21.4349C11.1007 20.753 10.7003 19.8281 10.7003 18.8636L10.7013 18.8127L10.6737 18.83C9.8734 19.2747 8.93013 19.4223 8.02348 19.2445L7.7993 19.1936C7.31932 19.0696 6.86971 18.8559 6.47633 18.565C6.08295 18.274 5.75358 17.9114 5.50716 17.4982C5.00619 16.664 4.87016 15.674 5.12871 14.7442C5.38726 13.8144 6.01943 13.0201 6.88738 12.5345L6.95388 12.5L6.88643 12.4655C6.04918 11.9969 5.43021 11.2404 5.15573 10.3502C4.88125 9.45992 4.97194 8.503 5.40932 7.67455L5.50431 7.50455C5.75075 7.09044 6.08044 6.72715 6.47436 6.43563C6.86828 6.14411 7.31863 5.93013 7.79942 5.80606C8.2802 5.68199 8.7819 5.65027 9.27556 5.71273C9.76923 5.7752 10.2451 5.93061 10.6756 6.17L10.7003 6.18636V6.13636C10.7003 5.20342 11.075 4.30616 11.7469 3.63017C12.4187 2.95419 13.3364 2.55119 14.31 2.50455L14.5 2.5ZM14.5 9.77273C13.7442 9.77273 13.0194 10.0601 12.4849 10.5715C11.9505 11.083 11.6503 11.7767 11.6503 12.5C11.6503 13.2233 11.9505 13.917 12.4849 14.4285C13.0194 14.9399 13.7442 15.2273 14.5 15.2273C15.2558 15.2273 15.9806 14.9399 16.5151 14.4285C17.0495 13.917 17.3497 13.2233 17.3497 12.5C17.3497 11.7767 17.0495 11.083 16.5151 10.5715C15.9806 10.0601 15.2558 9.77273 14.5 9.77273Z";

interface LogoProps {
  alwaysEnabled?: boolean;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({
  alwaysEnabled = false,
  color = "black",
}) => {
  const [isHover, setHover] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(
    (typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
      false,
  );
  const { currentCard } = useLoyalityCardData();
  const updateBalance = useAddLoyalityTransactionAccrual();

  useEffect(() => {
    if (!isHover || typeof window === "undefined") return;

    if (isTouchDevice) {
      setTimeout(() => {
        setHover(false);
      }, 200);
    }

    const timer = window.setInterval(() => {
      const currentPoints = readLogoPoints();
      writeLogoPoints(currentPoints + POINTS_PER_TICK);
    }, TICK_MS);

    return () => {
      clearInterval(timer);
    };
  }, [isHover, isTouchDevice, updateBalance, currentCard]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={
            isHover || alwaysEnabled
              ? {
                  x:
                    index === 0
                      ? [-3, -7, -3]
                      : index === 2
                        ? [3, 7, 3]
                        : [0, 0, 0],
                  rotate: index === 1 ? [0, -360] : [0, 360],
                }
              : { x: 0, rotate: 0 }
          }
          transition={
            isHover || alwaysEnabled
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
            <path d={PETAL_PATH} fill={color} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Logo;
