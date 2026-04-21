"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMyVideos } from "@/entities/video";
import Videos from "../videos/Videos";

const Reviews = () => {
  const { data } = useMyVideos({ limit: 4 });

  if (!data) return;

  return (
    <div className="bg-background pt-30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-left mb-5 md:mb-12 flex flex-col items-end lg:pr-80"
      >
        <h2 className="h !text-right pb-4">
          <span className="pr-6"> Что говорят</span>
          <br />о наших букетах
        </h2>
        <p className="p !w-fit pb-12">
          Видеоотзывы клиентов с возможностью <br /> посмотреть и выбрать
          понравившийся букет
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="-mx-4 flex sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-2 sm:pb-0"
      >
        <Videos isReviews data={data} />
      </motion.div>
    </div>
  );
};

export default Reviews;
