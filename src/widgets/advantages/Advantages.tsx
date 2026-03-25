// widgets/advantages/Advantages.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Advantages = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="pt-15 pb-5 sm:pt-30 sm:pb-20 bg-[#F8F9FB]">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-5 md:mb-12"
        >
          <span className="italic font-[400] text-[28px] sm:text-[clamp(32px,8vw,70px)] leading-[1.64] tracking-[-0.02em] text-[#394426]">
            Специальные{' '}
          </span>
          <span className="font-manrope font-semibold text-[24px] sm:text-[clamp(28px,7vw,61.61px)] leading-[1.64] text-[#394426]">
            предложения
          </span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-40"
        >
          <motion.div variants={itemVariants} className="text-left">
            <h3 className="font-manrope font-normal text-[18px] sm:text-[clamp(20px,5vw,36px)] leading-none text-[#394426] mb-3 md:mb-4">
              Гарантия<br className="hidden sm:block" /> приживаемости
            </h3>
            <p className="font-manrope font-normal text-[10px] sm:text-[clamp(14px,3vw,20px)] leading-[1.2] text-[#394426]">
              Наши растения морозоустойчивы <br className="hidden sm:block" />
              и прекрасно приживаются
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-left">
            <h3 className="font-manrope font-normal text-[18px] sm:text-[clamp(20px,5vw,36px)] leading-none text-[#394426] mb-3 md:mb-4">
              Дарите<br className="hidden sm:block" /> целые сады
            </h3>
            <p className="font-manrope font-normal text-[10px] sm:text-[clamp(14px,3vw,20px)] leading-[1.2] text-[#394426]">
              Оформите подарочный сертификат<br className="hidden sm:block" />
              любого номинала со скидкой 20%
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-left">
            <h3 className="font-manrope font-normal text-[18px] sm:text-[clamp(20px,5vw,36px)] leading-none text-[#394426] mb-3 md:mb-4">
              Притенение<br className="hidden sm:block" /> хвойных растений
            </h3>
            <p className="font-manrope font-normal text-[10px] sm:text-[clamp(14px,3vw,20px)] leading-[1.2] text-[#394426]">
              Приедем к вам на локацию и укроем<br className="hidden sm:block" />
              растения на зиму
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Advantages;