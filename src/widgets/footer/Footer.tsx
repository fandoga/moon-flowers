"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

  const navLinks = [
    { href: "/catalog", label: "Каталог" },
    { href: "/blog", label: "Блог" },
    { href: "/actions", label: "Акции" },
    { href: "/partners", label: "Партнёрам" },
    { href: "/company", label: "О компании" },
  ];

  return (
    <div className="w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] bg-[#394426]">
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="bg-[#394426] text-white"
      >
        {/* ── Desktop ── */}
        <div className="hidden md:block max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Колонка 1: Логотип + слоган */}
              <div className="lg:col-span-4">
                <div className="relative w-40 h-25 mb-4">
                  <Image
                    src="/logo/logo.png"
                    alt="Клевер"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-base font-semibold leading-snug">
                  Питомник растений и деревьев
                </p>
                <p className="text-base text-white/80">в Казани</p>
              </div>

              {/* Колонка 2: Навигация (горизонтальные группы или 2 колонки) */}
              <div className="lg:col-span-4">
                <p className="font-bold text-white/60 text-sm uppercase tracking-wider mb-3">
                  Навигация
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hover:underline text-white/90 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => setIsContactsOpen(true)}
                    className="text-left hover:underline text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    Контакты
                  </button>
                </div>
              </div>

              {/* Колонка 3: Контакты */}
              <div className="lg:col-span-4">
                <p className="font-bold text-white/60 text-sm uppercase tracking-wider mb-3">
                  Контакты
                </p>
                <div className="space-y-2">
                  <p>
                    г. Казань, Мамадышский тракт, 58
                    <br />
                    пос. Залесный, ул. Залесная, 58
                  </p>
                  <a
                    href="tel:+78432409055"
                    className="font-medium block hover:underline"
                  >
                    +7 843 240-90-55
                  </a>
                  <a
                    href="tel:+79662409055"
                    className="font-medium block hover:underline"
                  >
                    +7 966 240-90-55
                  </a>
                  <p className="break-all">sadkzn@mail.ru</p>
                </div>
              </div>
            </div>

            {/* Нижняя линия с копирайтом */}
            <div className="border-t border-white/20 mt-10 pt-6 text-sm text-white/50 text-center">
              © {new Date().getFullYear()} Питомник Клевер — Казань
            </div>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden bg-[#394426] text-white mb-20 sm:mb-0">
          <div className="px-5 py-8">
            {/* Logo + tagline */}
            <div className="mb-6">
              <h1 className="text-3xl font-semibold">Клевер</h1>
              <motion.p
                variants={fadeInUp}
                className="text-base mt-1 text-white/80"
              >
                Питомник растений и деревьев в Казани
              </motion.p>
            </div>

            {/* ✅ Navigation links on mobile footer */}
            <motion.div variants={fadeInUp} className="mb-8">
              <h3 className="font-bold text-xl mb-3">Навигация</h3>
              <ul className="text-base space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:underline text-white/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setIsContactsOpen(true)}
                    className="hover:underline text-white/90 cursor-pointer"
                  >
                    Контакты
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Contacts */}
            <motion.div variants={fadeInUp} className="space-y-2 text-base">
              <p>
                г. Казань, Мамадышский тракт, 58
                <br />
                пос. Залесный, ул. Залесная, 58
              </p>
              <a href="tel:+78432409055" className="font-medium block">
                +7 843 240-90-55
              </a>
              <a href="tel:+79662409055" className="font-medium block">
                +7 966 240-90-55
              </a>
              <p>sadkzn@mail.ru</p>
            </motion.div>
          </div>
        </div>
      </motion.footer>

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </div>
  );
};

export default Footer;
