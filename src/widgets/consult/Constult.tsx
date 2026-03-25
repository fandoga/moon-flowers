// widgets/consult/Constult.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Constult = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <section className="relative py-16 md:py-24 bg-[#F8F9FB] overflow-hidden">
      <motion.div
        className="relative container mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start md:justify-evenly gap-10 md:gap-30 mb-16 md:mb-20"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-[#394426] leading-tight max-w-3xl">
            Проконсультируем и подберём <br className="hidden sm:block" />
            идеальные растения под ваш проект
          </h2>
          <div className="flex flex-col items-start md:items-center gap-2 flex-1">
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#394426] max-w-[318px] text-white font-manrope font-medium text-base text-[12px] sm:text-xl px-8 sm:px-7 py-3.5 sm:py-4.5 rounded-lg hover:bg-[#102902] transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                Заказать обратный звонок
              </motion.button>
              <p className="text-[10px] sm:text-lg text-black mt-4 text-center max-w-[230px] sm:max-w-[500px]">
                Нажимая на кнопку, вы даёте согласие на обработку персональных
                данных
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="hidden sm:block w-full h-px bg-[#394426]/20 mb-16 md:mb-20"
        />

        <motion.div variants={fadeInUp} className="mb-16 md:mb-20">
          <h3 className="text-2xl sm:text-4xl md:text-6xl text-[#394426] font-[600] mb-8 md:mb-10">
            Мы создаём{" "}
            <span className="italic ml-0 sm:ml-10 font-[400] tracking-[-0.02em]">
              зелёную среду
            </span>
            <br />— для жизни, бизнеса и города
          </h3>

          <motion.div
            variants={fadeInUp}
            className="p-2 flex flex-col items-center sm:block p-2 sm:p-10 sm:pb-0 border-b-4 border-[#394426]"
          >
            <h4 className="text-xl md:text-3xl font-[600] text-[#394426] mb-4">
              Частные клиенты (владельцы участков, дач, садов)
            </h4>
            <p className="text-base sm:text-lg md:text-xl text-[#394426] font-manrope">
              Предоставим идеальный посадочный материал для своего проекта и
              уверенность в результате. Наши растения выращены в Казани, а
              значит — готовы к вашим условиям с первого дня.
            </p>
            <Link href={"/catalog"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-15 bg-[#394426] font-[500] text-white text-xs sm:text-xl px-5 mb-4 sm:px-7 py-3 sm:py-4.5 rounded-lg hover:bg-[#102902] transition-colors duration-300 cursor-pointer"
              >
                Подобрать растение
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-2 mt-10 sm:mt-0 sm:p-10 sm:pb-0 flex flex-col items-center sm:block border-b-4 border-[#394426]"
          >
            <h4 className="text-xl md:text-3xl font-[600] text-[#394426] mb-4">
              Бизнес и застройщики (ЖК, ТЦ, общественные пространства)
            </h4>
            <p className="text-base sm:text-lg md:text-xl text-[#394426]">
              Озеленяем жилые комплексы, общественные пространства, территории
              ТЦ и бизнес-парков. Наши акклиматизированные растения — это
              долгосрочное решение для проектов любого масштаба, снижающее риски
              и затраты на замену.
            </p>
            <Link href={"/catalog"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-15 text-xs bg-[#394426] font-[500] text-white text-base sm:text-xl px-5 mb-4 sm:px-7 py-3.5 sm:py-4.5 rounded-lg hover:bg-[#102902] transition-colors duration-300 cursor-pointer"
              >
                Подобрать растение
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Constult;
