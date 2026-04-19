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
            <div className="flex flex-col items-center">
              <p className="p py-2 ">
                г. Москва, ул. Большая <br /> Переяславская 52/1
              </p>
              <p className="p py-2 ">8 (897) 326-88-88</p>
              <p className="p py-2 ">flowers@shop.com</p>
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
                href="https://yandex.ru/maps/213/moscow/house/bolshaya_pereyaslavskaya_ulitsa_52s1/Z04YcANgT0cEQFtvfXt5dnRnYw==/?from=tableau_yabro&ll=37.640652%2C55.787861&utm_medium=mapframe&utm_source=maps&z=20.77"
                style={{
                  color: "#eee",
                  fontSize: "12px",
                  position: "absolute",
                  top: "14px",
                }}
              >
                Большая Переяславская улица, 52с1 — Яндекс Карты
              </a>
              <iframe
                src="https://yandex.ru/map-widget/v1/?from=tableau_yabro&ll=37.640652%2C55.787861&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1Njc0MzYwMhJX0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCR0L7Qu9GM0YjQsNGPINCf0LXRgNC10Y_RgdC70LDQstGB0LrQsNGPINGD0LvQuNGG0LAsIDUy0YExIgoNAJAWQhXBJl9C&z=20.77"
                width="560"
                height="400"
                frameBorder="1"
                className="w-full h-120"
                allowFullScreen
                style={{ position: "relative" }}
              ></iframe>
            </div>
          </div>
          <ActionButton
            src="https://tablecrm.com/"
            text="Работать на базе TableCRM.com"
          />
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
