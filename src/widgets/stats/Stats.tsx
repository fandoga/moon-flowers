// widgets/stats/Stats.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Stats = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="relative h-[700px] overflow-hidden sm:h-[600px] w-[100vw] ml-[-4.1%] ml-[calc(-50vw+50%)] z-10">
      <Image
        src="/stats/background.jpg"
        alt="Ваш сад начинается с доверия"
        fill
        className="object-cover blur-[1px]"
        priority
        quality={85}
      />
      <div className="absolute inset-0 bg-black/35" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="sm:w-[1220px] ml-0 sm:mx-auto mt-0 sm:mt-20 z-10 h-full p-4 sm:p-0 container mx-auto flex flex-col justify-center items-center sm:items-start"
      >
        <motion.h2 variants={fadeInUp} className="pb-10 sm:pb-0 w-full relative text-[25px] sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-[600] text-white text-left leading-tight mb-8 md:mb-12 ">
          Ваш сад начинается <span className="absolute top-10 right-4 sm:top-0 sm:right-0 sm:relative italic font-[300] text-3xl sm:text-[68px] tracking-[-0.02em]">с доверия</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 lg:gap-12 w-full mx-auto sm:mx-0">
          <motion.div variants={fadeInUp} className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 sm:p-10 text-left">
            <h3 className="text-xl md:text-5xl text-white mb-3">c 2016</h3>
            <p className="text-base text-sm md:text-lg text-white/90 font-manrope">
              выращиваем растения<br />и зарабатываем ваше доверие
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 sm:p-10 text-left">
            <h3 className="text-xl md:text-5xl text-white mb-3">100 000+</h3>
            <p className="text-base text-sm md:text-lg text-white/90 font-manrope">
              растений нашли свой<br />дом в вашем саду
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 sm:p-10 text-left">
            <h3 className="text-xl md:text-5xl text-white mb-3">каждый</h3>
            <p className="text-base text-sm md:text-lg text-white/90 font-manrope">
              клиент становится нашим<br />постоянным покупателем
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Stats;