"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategoryTree } from "@/entities/category/hooks/hooks";
import { ContactsModal } from "../contacts-modal/ContactsModal";

const Footer = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const { data: treeData, isLoading, error } = useCategoryTree({ limit: 6 });
  const categories = treeData?.result || [];

  return (
    <div className="w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] bg-[#394426]">
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="bg-[#394426] text-white "
      >
        <div className="hidden md:block max-w-[1440px] m-auto sm:px-[40px]">
          <div className="container mx-auto pt-12 pb-8">
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-between items-start mb-10"
            >
              <div className="max-w-xs">
                <div className="relative w-40 h-25 mb-4">
                  <Image
                    src="/logo/logo.png"
                    alt="Клевер"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-base leading-relaxed">
                  питомник растений и деревьев
                  <br />в Казани
                </p>
                
                <div className="flex space-x-6 mt-4 text-sm">
                  <Link href="/catalog" className="hover:underline">
                    Каталог
                  </Link>
                  <Link href="/blog" className="hover:underline">
                    Блог
                  </Link>
                  <Link href="/partners" className="hover:underline">
                    Партнёрам
                  </Link>
                  <Link href="/actions" className="hover:underline">
                    Акции
                  </Link>
                </div>
              </div>
              <div className="text-base space-y-2 text-right">
                <p>
                  г. Казань, Мамадышский тракт, 56
                  <br />
                  пос. Залесный, ул. Залесная, 58
                </p>
                <p className="font-medium text-lg">+7 843 240-90-53</p>
                <p className="font-medium text-lg">+7 966 240-90-53</p>
                <p className="text-lg">sadkzn@mail.ru</p>
              </div>
            </motion.div>

            
            {!isLoading && !error && categories.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6 mt-10"
              >
                {categories.map((cat) => (
                  <div key={cat.key} className="inline ">
                    <Link
                      href={`/catalog/${cat.key}`}
                      className="font-bold text-base inline mb-3 hover:underline"
                    >
                      {cat.name}
                    </Link>
                    {cat.children && cat.children.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {cat.children.map((child) => (
                          <li key={child.key}>
                            <Link
                              href={`/catalog/${child.key}`}
                              className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        
        <div className="md:hidden bg-[#394426] text-white mb-25 sm:mb-0">
          <div className="px-5 py-8">
            <h1 className="text-3xl font-semibold mb-4">Клевер</h1>
            <motion.p variants={fadeInUp} className="text-base mb-6">
              питомник растений и деревьев <br className="hidden sm:block" />в
              Казани
            </motion.p>

            <motion.div variants={fadeInUp}>
              <h3 className="font-bold text-2xl mb-3">Каталог</h3>
              <ul className="text-base space-y-2 mb-8">
                {categories.map((cat) => (
                  <li key={cat.key}>
                    <Link
                      href={`/catalog/${cat.key}`}
                      className="hover:underline"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-3 text-base">
              <p>
                г. Казань, Мамадышский тракт, 56
                <br />
                пос. Залесный, ул. Залесная, 58
              </p>
              <p className="font-medium">+7 843 240-90-53</p>
              <p className="font-medium">+7 966 240-90-53</p>
              <p>sadkzn@mail.ru</p>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
