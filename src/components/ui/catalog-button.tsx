import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

const CatalogButton = ({ className }: { className?: string }) => {
  return (
    <Link href="/catalog">
      <div
        className={cn(
          "bg-[#394426] text-white h-full px-10 py-4 rounded-md flex items-center gap-2 hover:bg-[#102902] transition-colors",
          className,
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.6665 7.18091H1.5C0.673 7.18091 0 6.50661 0 5.678V1.50291C0 0.674307 0.673 0 1.5 0H5.6665C6.4935 0 7.1665 0.674307 7.1665 1.50291V5.678C7.1665 6.50661 6.494 7.18091 5.6665 7.18091ZM14.5 7.18091H10.333C9.506 7.18091 8.833 6.50661 8.833 5.678V1.50291C8.833 0.674307 9.506 0 10.333 0H14.5C15.327 0 16 0.674307 16 1.50291V5.678C16 6.50661 15.327 7.18091 14.5 7.18091ZM5.6665 16H1.5C0.673 16 0 15.3257 0 14.4971V10.322C0 9.49339 0.673 8.81909 1.5 8.81909H5.6665C6.4935 8.81909 7.1665 9.49339 7.1665 10.322V14.4971C7.1665 15.3257 6.494 16 5.6665 16ZM14.5 16H10.333C9.506 16 8.833 15.3257 8.833 14.4971V10.322C8.833 9.49339 9.506 8.81909 10.333 8.81909H14.5C15.327 8.81909 16 9.49339 16 10.322V14.4971C16 15.3257 15.327 16 14.5 16Z"
            fill="white"
          />
        </svg>
        <span>Каталог</span>
      </div>
    </Link>
  );
};

export default CatalogButton;
