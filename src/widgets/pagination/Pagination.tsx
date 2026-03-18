// widgets/pagination/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  return (
    <div className="flex justify-center items-center mt-8 md:mt-12 space-x-2 md:space-x-3">
      <button className="text-[#394426] w-[50px] h-[50px] text-2xl border-gray-300 border md:text-3xl font-bold hover:text-gray-600 cursor-pointer rounded-sm">
        <svg width="40" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.501 5.62616C17.501 5.79192 17.4351 5.95089 17.3179 6.0681C17.2007 6.18532 17.0417 6.25116 16.876 6.25116L2.13473 6.25116L6.06848 10.1837C6.18583 10.301 6.25177 10.4602 6.25177 10.6262C6.25177 10.7921 6.18583 10.9513 6.06848 11.0687C5.95112 11.186 5.79195 11.252 5.62598 11.252C5.46001 11.252 5.30083 11.186 5.18348 11.0687L0.183475 6.06866C0.125273 6.01061 0.0790939 5.94164 0.0475864 5.86571C0.0160789 5.78977 -0.000141144 5.70837 -0.000141144 5.62616C-0.000141144 5.54395 0.0160789 5.46255 0.0475864 5.38662C0.0790939 5.31069 0.125273 5.24172 0.183475 5.18366L5.18348 0.183664C5.30083 0.0663052 5.46001 0.000374794 5.62598 0.000374794C5.79195 0.000374794 5.95112 0.0663052 6.06848 0.183664C6.18583 0.301023 6.25177 0.460195 6.25177 0.626163C6.25177 0.792133 6.18583 0.951305 6.06848 1.06866L2.13473 5.00116L16.876 5.00116C17.0417 5.00116 17.2007 5.06701 17.3179 5.18422C17.4351 5.30143 17.501 5.4604 17.501 5.62616Z" fill="#394426"/>
</svg>

      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={`px-3 py-1 md:px-4 md:py-2 w-[50px] h-[50px] rounded-sm text-base md:text-lg font-manrope ${
            currentPage === index + 1 ? 'bg-[#394426] text-white' : 'text-[#394426] hover:bg-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button className="text-[#394426] text-2xl w-[50px] h-[50px] border-gray-300 border md:text-3xl font-bold hover:text-gray-600 cursor-pointer rounded-sm">
        <svg width="49" height="14" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.62579C0 5.46003 0.065848 5.30106 0.183058 5.18385C0.300268 5.06664 0.45924 5.00079 0.625 5.00079H15.3663L11.4325 1.06829C11.3151 0.950931 11.2492 0.791759 11.2492 0.625789C11.2492 0.45982 11.3151 0.300648 11.4325 0.183289C11.5499 0.0659311 11.709 3.91038e-09 11.875 0C12.041 -3.91038e-09 12.2001 0.0659311 12.3175 0.183289L17.3175 5.18329C17.3757 5.24135 17.4219 5.31032 17.4534 5.38625C17.4849 5.46218 17.5011 5.54358 17.5011 5.62579C17.5011 5.708 17.4849 5.7894 17.4534 5.86533C17.4219 5.94126 17.3757 6.01023 17.3175 6.06829L12.3175 11.0683C12.2001 11.1856 12.041 11.2516 11.875 11.2516C11.709 11.2516 11.5499 11.1856 11.4325 11.0683C11.3151 10.9509 11.2492 10.7918 11.2492 10.6258C11.2492 10.4598 11.3151 10.3006 11.4325 10.1833L15.3663 6.25079H0.625C0.45924 6.25079 0.300268 6.18494 0.183058 6.06773C0.065848 5.95052 0 5.79155 0 5.62579Z" fill="#394426"/>
</svg>

      </button>
    </div>
  );
};

export default Pagination;