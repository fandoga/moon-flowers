"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactsModal } from "@/widgets/contacts-modal/ContactsModal";
import Logo from "@/components/ui/logo";
import AdressModal from "../adress-modal/AdressModal";
import LoyalitiModal from "../loyaliti-modal/LoyalitiModal";
import { LocalCart } from "@/app/order/page";
import { formatPrice } from "@/lib/utils/formatPrice";

const LOGO_POINTS_KEY = "logo_points";
const LOGO_POINTS_EVENT = "logo-points-updated";
const CART_LOCAL_KEY = "cart_local";
const CART_EVENT_NAME = "cart-local-updated";

const RollingDigit = ({ digit }: { digit: string }) => {
  return (
    <div className="relative h-6 w-3.5 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "-110%" }}
          animate={{
            y: "0%",
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            y: ["0%", "0%", "110%"],
            transition: {
              duration: 0.25,
              times: [0, 0.78, 1],
              ease: "easeInOut",
            },
          }}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

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
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [logoPoints, setLogoPoints] = useState(0);
  const [isPointsReady, setIsPointsReady] = useState(false);
  const [cart, setCart] = useState<LocalCart>(() => readCart());

  useEffect(() => {
    const syncCart = () => setCart(readCart());

    syncCart();
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const readPoints = () => {
      const raw = localStorage.getItem(LOGO_POINTS_KEY);
      setLogoPoints(raw ? Number(raw) || 0 : 0);
      setIsPointsReady(true);
    };

    const initTimer = window.setTimeout(readPoints, 0);

    const onPointsUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ points?: number }>;
      if (typeof custom.detail?.points === "number") {
        setLogoPoints(custom.detail.points);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === LOGO_POINTS_KEY) {
        setLogoPoints(event.newValue ? Number(event.newValue) || 0 : 0);
      }
    };

    window.addEventListener(LOGO_POINTS_EVENT, onPointsUpdate as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener(
        LOGO_POINTS_EVENT,
        onPointsUpdate as EventListener,
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const submenuVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  const pointDigits = Math.max(0, logoPoints).toString().split("");

  return (
    <>
      {/* ── Main header bar ── */}
      <div className="bg-transparent top-0 z-50">
        <header className="px-0 lg:px-12 max-w-[1740px] mx-auto overscroll-y-contain">
          <div className=" container mx-auto">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center py-8 justify-between">
              <Link href="/" className="flex items-center scale-115 ">
                <Logo />
              </Link>
              <div className="flex items-center cursor-pointer">
                <LoyalitiModal simple />
                <div className="min-w-14 px-2 text-center font-semibold h-12 bg-gray rounded-lg overflow-hidden">
                  <div className="relative h-full flex items-center justify-center gap-[1px]">
                    {!isPointsReady
                      ? "0"
                      : pointDigits.map((digit, index) => (
                          <RollingDigit key={index} digit={digit} />
                        ))}
                  </div>
                </div>
              </div>
              <AdressModal />
              <div className="flex items-center justify-end">
                <div className="flex w-auto 2xl:w-150 gap-7">
                  <Link className="bg-gray rounded-lg p-3" href="/catalog">
                    Каталог
                  </Link>
                  {/* <Link href="/about-us">О нас</Link>
                <Link href="/blog">Блог</Link>
                <Link href="/contants">Контакты</Link>
                <Link href="/work">Сотрудничество</Link> */}
                </div>
                <div className="flex min-w-30 gap-2 items-center justify-end">
                  {total > 0 && <p>{formatPrice(total)}</p>}
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
                </div>
              </div>
            </div>

            {/* Mobile top bar */}
            <div className="flex md:hidden items-center justify-between px-4 py-3 relative z-1">
              <Link href={"/"} className="min-w-20">
                <Logo />
              </Link>
              <Link
                className="bg-gray px-6 py-2 rounded-lg"
                href={"https://max"}
              >
                Написать в Max
              </Link>
              <div className="min-w-20 flex justify-between items-center">
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
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-white cursor-pointer"
                >
                  <Menu color="black" size={32} />
                </button>
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
              className="fixed inset-0 bg-background z-60 md:hidden overscroll-y-contain"
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
                        <Link
                          href="/catalog"
                          className=" text-right text-4xl font-semibold text-black"
                          onClick={handleLinkClick}
                        >
                          Каталог
                        </Link>
                      </div>
                      <div className="mx-2 py-2">
                        <Link
                          href="/actions"
                          className="text-right text-4xl font-semibold text-black"
                          onClick={handleLinkClick}
                        >
                          О нас
                        </Link>
                      </div>
                      <div className="mx-2 py-2">
                        <Link
                          href="/actions"
                          className="text-right text-4xl font-semibold text-black"
                          onClick={handleLinkClick}
                        >
                          Блог
                        </Link>
                      </div>
                      <div className="mx-2 py-2">
                        <Link
                          href="/actions"
                          className=" text-right text-4xl font-semibold text-black"
                          onClick={handleLinkClick}
                        >
                          Контакты
                        </Link>
                      </div>
                      <div className="mx-2 py-2">
                        <Link
                          href="/actions"
                          className=" text-right text-4xl font-semibold text-black"
                          onClick={handleLinkClick}
                        >
                          Сотрудничество
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

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </>
  );
};

export default Header;
