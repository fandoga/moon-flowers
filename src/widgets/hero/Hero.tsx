// widgets/hero/Hero.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ActionButton from "@/components/ui/action-button";

const Hero = () => {
  return (
    <section className="relative">
      <div className="bg-background relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-[500px] w-full overflow-hidden rounded-xl md:rounded-2xl lg:rounded-[40px]">
            <Image
              loading="eager"
              src="/hero/background.png"
              className="w-full h-full object-cover"
              alt="bg_img"
              width={1600}
              height={500}
            />
          </div>
          <div className="py-4 md:py-10">
            <h1 className="h">
              Свежие цветы <br /> каждый день
            </h1>
            <p className="p">
              Создаем наборы с характером — для любого настроения и повода
            </p>
          </div>
          <ActionButton src="/catalog" text="Выбрать букет" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
