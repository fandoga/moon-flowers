"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Store, X } from "lucide-react";
import Logo from "@/components/ui/logo";
import AdressModal from "../adress-modal/AdressModal";
import LoyalitiModal from "../loyaliti-modal/LoyalitiModal";
import { LocalCart } from "@/entities/order/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatPrice";

import { useBonusCounter } from "@/components/ui/bonus-counter/useBonusCounter";
const CART_LOCAL_KEY = "cart_local";
const CART_EVENT_NAME = "cart-local-updated";

import RollingDigit from "@/components/ui/bonus-counter/RollingDigit";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const readCart = (): LocalCart => {
  try {
    if (typeof window === "undefined") return { items: {} };
    const raw = window.localStorage.getItem(CART_LOCAL_KEY);
    if (!raw) return { items: {} };
    const parsed = JSON.parse(raw) as Partial<LocalCart>;
    return { items: parsed.items ?? {} };
  } catch {
    return { items: {} };
  }
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isReady: isPointsReady, pointDigits } = useBonusCounter();
  const router = useRouter();
  const pathname = usePathname();
  // Инициализируем всегда пустой корзиной на сервере и первом клиентском рендере
  const [cart, setCart] = useState<LocalCart>({ items: {} });

  useEffect(() => {
    //  Только после монтирования читаем реальную корзину из localStorage
    setTimeout(() => {
      setCart(readCart());
    });

    const syncCart = () => setCart(readCart());
    window.addEventListener(CART_EVENT_NAME, syncCart);
    window.addEventListener("storage", (e) => {
      if (e.key === CART_LOCAL_KEY) syncCart();
    });

    return () => {
      window.removeEventListener(CART_EVENT_NAME, syncCart);
    };
  }, []);

  const cartItems = Object.values(cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * item.quantity,
    0,
  );

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "tween" as const, duration: 0.3 } },
    exit: { x: "100%", transition: { type: "tween" as const, duration: 0.3 } },
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const submenuVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  const handleToggleClick = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.replace("/");
    }
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {/* ── Main header bar ── */}
      <div className="relative bg-transparent top-0">
        <header className="px-0 lg:px-12 max-w-[1740px] mx-auto overscroll-y-contain">
          <div className=" container mx-auto px-4 lg:px-0">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center py-8 justify-between">
              <Link href="/" className="flex items-center scale-115 ">
                <Logo />
              </Link>
              <div className="flex items-center cursor-pointer relative bg-gray rounded-lg overflow-hidden h-12">
                {/* Прогресс бар */}
                <motion.div
                  className="absolute inset-0 bg-red-200 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: Math.min(
                      (parseInt(pointDigits.join("")) || 0) / 500,
                      1,
                    ),
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    opacity: 0.6,
                    transformOrigin: "left",
                  }}
                />

                {/* Контент поверх прогресс бара */}
                <div className="relative flex items-center z-1000 h-full">
                  <div>
                    <LoyalitiModal simple />
                  </div>
                  <div className="text-center rounded-lg font-semibold flex px-3 h-12 items-center justify-center gap-[1px]">
                    {!isPointsReady
                      ? "0"
                      : pointDigits.map((digit, index) => (
                          <RollingDigit key={index} digit={digit} />
                        ))}
                  </div>
                </div>
              </div>
              <AdressModal />
              <div className="flex items-center justify-end gap-4">
                <div className="hidden xl:flex w-auto 2xl:w-140 gap-4 xl:gap-10 flex justify-between">
                  <p
                    className="cursor-pointer"
                    onClick={() => scrollToSection("stories")}
                  >
                    Сторис
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={() => scrollToSection("recommendations")}
                  >
                    Рекомендации
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={() => scrollToSection("reviews")}
                  >
                    Отзывы
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={() => scrollToSection("contacts")}
                  >
                    Контакты
                  </p>
                  <Link href={"/catalog"}>Каталог</Link>
                </div>
                <div className="flex z-100 min-w-30 gap-6 items-center justify-end">
                  {total > 0 && (
                    <Link href={"/order"} className="bg-gray rounded-lg p-2">
                      <p>{formatPrice(total)}</p>
                    </Link>
                  )}
                  <Link href={"/order"}>
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.25432 1.33333C7.62765 0.546667 8.43298 0 9.36365 0H14.697C15.6276 0 16.4316 0.546667 16.8063 1.33333C17.717 1.34133 18.4276 1.38267 19.0623 1.63067C19.82 1.92703 20.4789 2.43068 20.9636 3.084C21.453 3.74267 21.6836 4.58667 21.9983 5.748L22.9876 9.37733L23.361 10.4987L23.393 10.5387C24.5943 12.0773 24.0223 14.3653 22.8783 18.94C22.1503 21.8507 21.7876 23.3053 20.7023 24.1533C19.617 25 18.117 25 15.117 25H8.94365C5.94365 25 4.44365 25 3.35832 24.1533C2.27298 23.3053 1.90898 21.8507 1.18232 18.94C0.0383171 14.3653 -0.533683 12.0773 0.66765 10.5387L0.69965 10.4987L1.07298 9.37733L2.06232 5.748C2.37832 4.58667 2.60898 3.74133 3.09698 3.08267C3.58195 2.42984 4.24084 1.92666 4.99832 1.63067C5.63298 1.38267 6.34232 1.34 7.25432 1.33333ZM7.25698 3.33733C6.37432 3.34667 6.01965 3.38 5.72632 3.49467C5.31827 3.65424 4.9634 3.92548 4.70232 4.27733C4.46765 4.59333 4.32898 5.03467 3.94232 6.45733L3.18232 9.24267C4.54232 9 6.40098 9 8.94232 9H15.117C17.6596 9 19.517 9 20.877 9.24L20.1183 6.45467C19.7316 5.032 19.593 4.59067 19.3583 4.27467C19.0972 3.92281 18.7424 3.65157 18.3343 3.492C18.041 3.37733 17.6863 3.344 16.8036 3.33467C16.6143 3.73313 16.3159 4.06976 15.9431 4.30552C15.5702 4.54128 15.1381 4.6665 14.697 4.66667H9.36365C8.92264 4.66662 8.49068 4.54159 8.11782 4.30608C7.74497 4.07057 7.44649 3.73555 7.25698 3.33733Z"
                        fill="black"
                      />
                    </svg>
                  </Link>
                  <div
                    onClick={() => handleToggleClick()}
                    className="block xl:hidden text-white cursor-pointer pt-1"
                  >
                    <Menu color="black" size={30} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile top bar */}
            <div className="flex md:hidden md:relative top-0 z-1000 w-full items-center justify-between md:px-4 py-3 relative">
              <Link href={"/"} className="min-w-20 scale-90 md:scale-100">
                <Logo />
              </Link>
              <Link
                className="bg-gray px-2 md:px-6 py-2 rounded-lg"
                href={"https://max"}
              >
                Написать в Max
              </Link>
              <div className="min-w-20 flex scale-90 scale-100 justify-between items-center gap-2">
                <div className="min-w-20 px-2 text-center font-semibold h-8 bg-gray rounded-lg overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0 bg-green-400 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: Math.min(
                        (parseInt(pointDigits.join("")) || 0) / 500,
                        1,
                      ),
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      opacity: 0.5,
                      transformOrigin: "left",
                    }}
                  />
                  <div className="relative h-full flex items-center justify-center z-10 text-sm">
                    {!isPointsReady
                      ? "0"
                      : pointDigits.map((digit, index) => (
                          <RollingDigit key={index} digit={digit} />
                        ))}
                  </div>
                </div>
                <Link href={"/order"}>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.25432 1.33333C7.62765 0.546667 8.43298 0 9.36365 0H14.697C15.6276 0 16.4316 0.546667 16.8063 1.33333C17.717 1.34133 18.4276 1.38267 19.0623 1.63067C19.82 1.92703 20.4789 2.43068 20.9636 3.084C21.453 3.74267 21.6836 4.58667 21.9983 5.748L22.9876 9.37733L23.361 10.4987L23.393 10.5387C24.5943 12.0773 24.0223 14.3653 22.8783 18.94C22.1503 21.8507 21.7876 23.3053 20.7023 24.1533C19.617 25 18.117 25 15.117 25H8.94365C5.94365 25 4.44365 25 3.35832 24.1533C2.27298 23.3053 1.90898 21.8507 1.18232 18.94C0.0383171 14.3653 -0.533683 12.0773 0.66765 10.5387L0.69965 10.4987L1.07298 9.37733L2.06232 5.748C2.37832 4.58667 2.60898 3.74133 3.09698 3.08267C3.58195 2.42984 4.24084 1.92666 4.99832 1.63067C5.63298 1.38267 6.34232 1.34 7.25432 1.33333ZM7.25698 3.33733C6.37432 3.34667 6.01965 3.38 5.72632 3.49467C5.31827 3.65424 4.9634 3.92548 4.70232 4.27733C4.46765 4.59333 4.32898 5.03467 3.94232 6.45733L3.18232 9.24267C4.54232 9 6.40098 9 8.94232 9H15.117C17.6596 9 19.517 9 20.877 9.24L20.1183 6.45467C19.7316 5.032 19.593 4.59067 19.3583 4.27467C19.0972 3.92281 18.7424 3.65157 18.3343 3.492C18.041 3.37733 17.6863 3.344 16.8036 3.33467C16.6143 3.73313 16.3159 4.06976 15.9431 4.30552C15.5702 4.54128 15.1381 4.6665 14.697 4.66667H9.36365C8.92264 4.66662 8.49068 4.54159 8.11782 4.30608C7.74497 4.07057 7.44649 3.73555 7.25698 3.33733Z"
                      fill="black"
                    />
                  </svg>
                </Link>
                <div
                  onClick={() => handleToggleClick()}
                  className="text-white cursor-pointer pt-1"
                >
                  <Menu color="black" size={30} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile slide-out menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-1200 bg-background z-60 xl:hidden overscroll-y-contain"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className="absolute top-0 right-0 w-full h-full bg-background text-white flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
                  <button
                    className="mr-3 w-full flex justify-end"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X color="black" size={28} />
                  </button>
                </div>

                <nav className="flex-1 space-y-4 overflow-y-auto px-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="main"
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="mx-2 py-2">
                        <p
                          className="text-4xl font-semibold text-black cursor-pointer"
                          onClick={() => scrollToSection("stories")}
                        >
                          Сторис
                        </p>
                      </div>
                      <div className="mx-2 py-2">
                        <p
                          className="text-4xl font-semibold text-black cursor-pointer"
                          onClick={() => scrollToSection("recommendations")}
                        >
                          Рекомендации
                        </p>
                      </div>
                      <div className="mx-2 py-2">
                        <p
                          className="text-4xl font-semibold text-black cursor-pointer"
                          onClick={() => scrollToSection("reviews")}
                        >
                          Отзывы
                        </p>
                      </div>
                      <div className="mx-2 py-2">
                        <p
                          className="text-4xl font-semibold text-black cursor-pointer"
                          onClick={() => scrollToSection("contacts")}
                        >
                          Контакты
                        </p>
                      </div>
                      <div className="mx-2 py-2">
                        <Link
                          href={"/catalog"}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-4xl font-semibold text-black cursor-pointer"
                        >
                          Каталог
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Header;
