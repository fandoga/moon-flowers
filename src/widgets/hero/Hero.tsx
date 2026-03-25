// widgets/hero/Hero.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContactsModal } from "../contacts-modal/ContactsModal";

const Hero = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  return (
    <section className="relative">
      
      <div className="bg-[#F8F9FB] py-8 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[43px] font-[600] sm:text-6xl text-center sm:text-left md:text-6xl lg:text-7xl text-[#394426] leading-tight mb-4 md:mb-6">
              Наши — <span className="italic font-[400] sm:text-[80px]">зимуют!</span>
            </h1>
            <p className="text-base text-sm sm:text-lg w-[95%] sm:w-full mx-auto md:text-xl text-center sm:text-left lg:text-2xl text-[#394426] font-[400]">
              Крупномеры, саженцы, посадочный материал — всё из собственного
              питомника в Казани.
              <br className="hidden sm:block" />
              Для вашего сада, участка и профессиональных ландшафтных проектов.
            </p>
          </motion.div>
        </div>
      </div>

      
      <section className="relative bg-[#F8F9FB] w-full h-[544px] sm:h-[530px] lg:h-[540px] overflow-hidden ">
        
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1360 541"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute inset-0 w-full h-full rounded-xl sm:rounded-4xl hidden sm:block"
        >
          <path
            d="M1345 0C1353.28 7.73108e-06 1360 6.71573 1360 15V526C1360 534.284 1353.28 541 1345 541H15C6.71574 541 0 534.284 0 526V128C0 115.85 9.84974 106 22 106H537C549.15 106 559 96.1503 559 84V22C559 9.84974 568.85 0 581 0H1345Z"
            fill="url(#patternDesktop)"
          />
          <defs>
            <pattern
              id="patternDesktop"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <image
                xlinkHref="/hero/background.jpg"
                width="1"
                height="1"
                preserveAspectRatio="none"
              />
            </pattern>
          </defs>
        </svg>

        
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 377 544"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="absolute inset-0 w-full h-full rounded-xl sm:rounded-4xl block sm:hidden"
        >
          <path
            d="M369 0C373.418 0 377 3.58172 377 8V536C377 540.418 373.418 544 369 544H289C284.582 544 281 540.418 281 536V451C281 446.582 277.418 443 273 443H103C98.5817 443 95 446.582 95 451V536C95 540.418 91.4183 544 87 544H8C3.58172 544 1.6107e-08 540.418 0 536V8C4.12337e-06 3.58173 3.58172 0 8 0H369Z"
            fill="url(#patternMobile)"
          />
          <defs>
            <pattern
              id="patternMobile"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <image
                xlinkHref="/hero/background.jpg"
                width="1"
                height="1"
                preserveAspectRatio="none"
              />
            </pattern>
          </defs>
        </svg>

        
        <div className="absolute top-0 left-0 pointer-events-none hidden sm:block">
          <div className="absolute top-0 left-0 h-25 w-140 py-4 pointer-events-auto">
            <div className="flex flex-col sm:flex-row gap-[21px]">
              <Link href="/catalog">
                <motion.button
                  whileHover={{ scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#394426]/90 text-white font-[500] text-base sm:text-lg px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg border border-[#394426] hover:bg-[#102902] transition-all duration-300 cursor-pointer w-full sm:w-auto"
                >
                  Перейти в каталог
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactsOpen(true)}
                className="bg-white/20 text-[#394426] font-[500] text-base sm:text-lg border-2 border-[#394426]/70 px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-300 cursor-pointer w-full sm:w-auto"
              >
                Заказать консультацию
              </motion.button>
            </div>
          </div>
        </div>

        
        <div className="absolute -bottom-3 left-0 right-0 flex justify-center visible sm:invisible pointer-events-auto">
          <div className="p-[8px] w-[186px] h-[125px] bg-[#F8F9FB] rounded-xl">
            <div className="flex flex-col gap-3">
              <Link href="/catalog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#394426] text-[12px] w-full flex-1 text-white font-medium text-base px-4 py-3 rounded-lg border border-[#394426]/40 hover:bg-[#102902] transition-all duration-300"
                >
                  Перейти в каталог
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactsOpen(true)}
                className="bg-white/20 text-[12px] whitespace-nowrap text-[#394426] font-medium text-base border-2 border-[#394426]/70 px-4 py-3 rounded-lg hover:bg-[#102902] hover:text-white hover:border-[#394426] transition-all duration-300"
              >
                Заказать консультацию
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </section>
  );
};

export default Hero;