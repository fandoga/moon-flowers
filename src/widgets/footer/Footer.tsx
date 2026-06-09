"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import FooterIcons from "./FooterIcons";
import ActionButton from "@/components/ui/action-button";

const YANDEX_MAP_SRC =
  "https://yandex.ru/map-widget/v1/?ll=37.634596%2C55.879413&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1Njc5NTg3MhI70KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCf0L7Qu9GP0YDQvdCw0Y8g0YPQu9C40YbQsCwgMjEiCg3ViRZCFYeEX0I%2C&z=14";

const Footer = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  useEffect(() => {
    if (!mapRef.current || shouldLoadMap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadMap(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadMap]);

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
          <div ref={mapRef} className="w-full pb-4">
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
              {shouldLoadMap ? (
                <iframe
                  loading="lazy"
                  src={YANDEX_MAP_SRC}
                  width="560"
                  height="400"
                  frameBorder="1"
                  allowFullScreen
                  className="w-full h-70 md:h-100"
                  style={{ position: "relative" }}
                />
              ) : (
                <div className="w-full h-70 md:h-100 bg-gray/40" />
              )}
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-4 text-center mt-8 border-t border-gray/20 pt-8 pb-4">
            <div className="text-[10px] md:text-xs text-black/50 space-y-1">
              <p>ИП Сучков Владимир Викторович</p>
              <p>ОГРНИП: 325508100667490 | ИНН: 772333368503</p>
              <p>
                Юридический адрес: Московская область, г.о. Домодедово, ДНП
                Ветеран, Южная улица, 14
              </p>
              <p>
                <a
                  href="/oferta"
                  className="underline hover:text-black transition-colors"
                >
                  Публичная оферта
                </a>
              </p>
            </div>
            <ActionButton
              src="https://tablecrm.com/"
              text="Работает на базе TableCRM.com"
            />
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
