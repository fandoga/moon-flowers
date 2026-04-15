import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  src: string;
  text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ src, text }) => {
  return (
    <Link
      className="bg-black hover:bg-white hover:text-black hover:border-black border-1 border-white transition-all group text-white rounded-xl py-2 px-4 mx-1 gap-4 inline-flex w-fit items-center justify-end whitespace-nowrap"
      href={src}
    >
      {text}
      <div className="bg-white group-hover:bg-black transition-all flex items-center justify-center rounded-lg w-10 h-10">
        <svg
          width="12"
          height="12"
          viewBox="0 0 9 9"
          fill="none"
          className="text-black group-hover:text-white transition-colors"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.59967 0.999814L1 7.59948M7.59967 0.999814L7.59967 6.65667M7.59967 0.999814L1.94281 0.999814"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};

export default ActionButton;
