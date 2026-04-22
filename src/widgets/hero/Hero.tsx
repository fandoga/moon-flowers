// widgets/hero/Hero.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ActionButton from "@/components/ui/action-button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-background relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-[500px] w-full overflow-hidden rounded-xl md:rounded-2xl lg:rounded-[40px]">
            <Image
              priority
              src="/hero/background.png"
              className="w-full h-full object-cover"
              alt="bg_img"
              width={1600}
              height={500}
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center md:gap-20 xl:gap-40">
            <div className="py-4 md:pt-10">
              <h1 className="h min-w-90">
                Свежие цветы <br /> каждый день
              </h1>
            </div>
            <div>
              <p className="p py-4">
                Создаем наборы с характером — <br /> для любого настроения и
                повода
              </p>
              <ActionButton src="/catalog" text="Выбрать букет" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
