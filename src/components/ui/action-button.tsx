import Link from "next/link";
import React from "react";
import { LoaderCircle } from "lucide-react";

interface ActionButtonProps {
  text: string;
  href?: string;
  src?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  showArrow?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  href,
  src,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
  showArrow = true,
}) => {
  const finalHref = href ?? src;
  const isDisabled = disabled || loading;
  const baseClasses = [
    "bg-black text-white border border-black rounded-xl",
    "transition-all group inline-flex items-center justify-between",
    "gap-4 py-2 px-4 whitespace-nowrap",
    "hover:bg-white hover:text-black hover:border-black",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    fullWidth ? "w-full" : "w-fit",
    className,
  ]
    .join(" ")
    .trim();

  const content = (
    <>
      <span>{loading ? "Оформление..." : text}</span>
      {showArrow && (
        <span className="bg-white group-hover:bg-black transition-all flex items-center justify-center rounded-lg w-10 h-10">
          {loading ? (
            <LoaderCircle className="h-5 w-5 animate-spin text-black group-hover:text-white" />
          ) : (
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
          )}
        </span>
      )}
    </>
  );

  if (finalHref) {
    return (
      <Link
        className={baseClasses}
        href={finalHref}
        aria-disabled={isDisabled}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={isDisabled}
    >
      {content}
    </button>
  );
};

export default ActionButton;
