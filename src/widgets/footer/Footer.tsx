"use client";

import React from "react";
import { motion } from "framer-motion";
import FooterIcons from "./FooterIcons";
import ActionButton from "@/components/ui/action-button";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div>
      <motion.footer
        id="contacts"
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="max-w-[1640px] mx-auto px-14 pt-15 md:pt-30 pb-5 flex flex-col items-center bg-background">
          <div className="flex flex-col gap-2 w-full md:gap-16 md:flex-row items-center pb-8">
            <div>
              <h2 className="h md:pb-6 !text-center md:!text-left">
                Работаем ежедневно <br /> 09:00 — 21:00
              </h2>
              <p className="p pb-10 md:pb-0 !text-center md:!text-left">
                Свяжитесь с нами любым удобным способом — <br /> поможем найти
                идеальные цветы
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="p py-2 ">г. Москва, ул. Полярная 21</p>
              <a
                href="tel:+79035972797"
                className="p py-2 hover:underline cursor-pointer"
              >
                8 (903) 597-27-97
              </a>
              <a
                href="mailto:flowers@shop.com"
                className="p py-2 hover:underline cursor-pointer"
              >
                moonflowers.msk@yandex.ru
              </a>
              <FooterIcons />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center pb-4">
          <div className="w-full pb-4">
            <div style={{ position: "relative", overflow: "hidden" }}>
              <a
                href="https://yandex.ru/maps/213/moscow/?utm_medium=mapframe&utm_source=maps"
                style={{
                  color: "#eee",
                  fontSize: "12px",
                  position: "absolute",
                  top: "0px",
                }}
              >
                Москва
              </a>
              <a
                href="https://yandex.ru/maps/213/moscow/house/polyarnaya_ulitsa_21/Z04YcARkT0UDQFtvfXR2eHhhZA==/?ll=37.634596%2C55.879413&utm_medium=mapframe&utm_source=maps&z=21"
                style={{
                  color: "#eee",
                  fontSize: "12px",
                  position: "absolute",
                  top: "14px",
                }}
              >
                Полярная улица, 21 — Яндекс Карты
              </a>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.634596%2C55.879413&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1Njc5NTg3MhI70KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCf0L7Qu9GP0YDQvdCw0Y8g0YPQu9C40YbQsCwgMjEiCg3ViRZCFYeEX0I%2C&z=21"
                width="560"
                height="400"
                frameBorder="1"
                allowFullScreen
                className="w-full h-70 md:h-100"
                style={{ position: "relative" }}
              ></iframe>
            </div>
          </div>
          <ActionButton
            src="https://tablecrm.com/"
            text="Работает на базе TableCRM.com"
          />
        </div>
      </motion.footer>
      <div className="w-full bg-gray py-4">
        <div className="max-w-[1640px] px-14 mx-auto">
          <p className="text-muted-foreground">ИП Сучков Владимир Викторович</p>
          <p className="text-muted-foreground">
            (ОГРНИП: 325508100667490, ИНН: 772333368503)
          </p>
          <p className="text-muted-foreground">
            Юридический адрес: Московская область, городской округ Домодедово,
            ДНП Ветеран, Южная улица, 14
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
