'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  paths: { url: string; name: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav className="text-sm font-manrope mb-4 md:mb-6">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;

        return (
          <span key={index} className="inline-flex items-center">
            {index > 0 && <span className="px-2 text-gray-400">/</span>}
            {isLast ? (
              <span className="text-[#394426] font-medium cursor-default">
                {path.name}
              </span>
            ) : (
              <Link
                href={path.url}
                className="text-gray-500 hover:text-[#394426] transition-colors duration-200"
              >
                {path.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;