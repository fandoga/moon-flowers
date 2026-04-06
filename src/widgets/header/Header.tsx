"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronLeft, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/entities/category/hooks/hooks";
import { useFavorites } from "@/entities/favorites/hooks/hooks";
import { useCart, useCartProducts } from "@/entities/cart/hooks/hooks";
import { formatPrice } from "@/lib/utils/formatPrice";
import { SearchInput } from "@/features/search/SearchInput";
import { useCartStore } from "@/entities/cart/store/cartStore";
import { ContactsModal } from "@/widgets/contacts-modal/ContactsModal";

const PHONE = "+79662409053";
const PHONE_DISPLAY = "+7 (966) 240-90-53";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCatalogSubmenu, setShowCatalogSubmenu] = useState(false);
  const { openCart } = useCartStore();

  const { data: categories, isLoading, error } = useCategories(100, 0);
  const { data: favoritesData } = useFavorites(1, 1);
  const favoritesCount = favoritesData?.count || 0;
  const { data: cartData } = useCart();
  const { data: cartItems } = useCartProducts();
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const cartCount = cartData?.total_count || 0;
  const cartTotal =
    cartItems?.reduce((sum: number, item: any) => {
      const price = item.product?.prices?.[0]?.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;

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

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setShowCatalogSubmenu(false);
  };

  return (
    <>
      {/* ── Top info bar (desktop) ── */}
      <div className="hidden md:block w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] bg-gray-100">
        <div className="text-sm max-w-[1440px] sm:px-[40px] mx-auto">
          <div className="container mx-auto py-1.5 flex justify-between items-center text-gray-700">
            {/* ✅ Left nav: added Акции and Партнёрам */}
            <div className="flex items-center space-x-6">
              <Link href="/company" className="hover:text-green-800">
                О компании
              </Link>
              <Link href="/actions" className="hover:text-green-800">
                Акции
              </Link>
              <Link href="/partners" className="hover:text-green-800">
                Партнёрам
              </Link>
              <Link href="/blog" className="hover:text-green-800">
                Блог
              </Link>
              <button
                onClick={() => setIsContactsOpen(true)}
                className="hover:text-green-800 cursor-pointer"
              >
                Контакты
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <svg
                  width="14"
                  height="11"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.8 0H1.19999C0.719075 0 0.301866 0.29867 0.11087 0.726737C0.175104 0.741479 0.237672 0.769379 0.294923 0.811122L6.00001 4.97106L11.7051 0.811122C11.7623 0.769379 11.8249 0.741479 11.8891 0.726737C11.6981 0.29867 11.2809 0 10.8 0ZM12 1.90392L6.29493 6.06386C6.11785 6.19297 5.88216 6.19297 5.70508 6.06386L0 1.90392V8.74997C0 9.4375 0.540001 10 1.19999 10H10.8C11.46 10 12 9.4375 12 8.74997V1.90392Z"
                    fill="#8B8C95"
                  />
                </svg>
                <span>sadkzn@mail.ru</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  width="11"
                  height="15"
                  viewBox="0 0 11 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.17891 14.6629C7.64844 12.7772 11 8.20679 11 5.63959C11 2.52607 8.53646 0 5.5 0C2.46354 0 0 2.52607 0 5.63959C0 8.20679 3.35156 12.7772 4.82109 14.6629C5.17344 15.1124 5.82656 15.1124 6.17891 14.6629ZM5.5 3.75973C5.98623 3.75973 6.45255 3.95779 6.79636 4.31033C7.14018 4.66287 7.33333 5.14102 7.33333 5.63959C7.33333 6.13817 7.14018 6.61632 6.79636 6.96886C6.45255 7.3214 5.98623 7.51946 5.5 7.51946C5.01377 7.51946 4.54745 7.3214 4.20364 6.96886C3.85982 6.61632 3.66667 6.13817 3.66667 5.63959C3.66667 5.14102 3.85982 4.66287 4.20364 4.31033C4.54745 3.95779 5.01377 3.75973 5.5 3.75973Z"
                    fill="#8B8C95"
                  />
                </svg>
                <span>
                  г. Казань, Мамадышский тракт, 58 пос. Залесный, ул. Залесная,
                  58
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main header bar ── */}
      <div className="w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] bg-[#F8F9FB] sm:shadow-xs sm:sticky top-0 z-50">
        <header className="max-w-[1440px] mx-auto sm:px-[40px] overscroll-y-contain">
          <div className="container mx-auto">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-around py-4">
              <Link href="/" className="flex items-center">
                <div className="relative w-32 h-20">
                  <Image
                    src="/logo/logo.png"
                    alt="Клевер"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
              <div className="flex-1 max-w-2xl mx-8">
                <div className="flex w-full">
                  <Link href="/catalog">
                    <div className="mr-5 bg-[#394426] text-white h-full px-10 py-4 rounded-md flex items-center gap-2 hover:bg-[#102902] transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.6665 7.18091H1.5C0.673 7.18091 0 6.50661 0 5.678V1.50291C0 0.674307 0.673 0 1.5 0H5.6665C6.4935 0 7.1665 0.674307 7.1665 1.50291V5.678C7.1665 6.50661 6.494 7.18091 5.6665 7.18091ZM14.5 7.18091H10.333C9.506 7.18091 8.833 6.50661 8.833 5.678V1.50291C8.833 0.674307 9.506 0 10.333 0H14.5C15.327 0 16 0.674307 16 1.50291V5.678C16 6.50661 15.327 7.18091 14.5 7.18091ZM5.6665 16H1.5C0.673 16 0 15.3257 0 14.4971V10.322C0 9.49339 0.673 8.81909 1.5 8.81909H5.6665C6.4935 8.81909 7.1665 9.49339 7.1665 10.322V14.4971C7.1665 15.3257 6.494 16 5.6665 16ZM14.5 16H10.333C9.506 16 8.833 15.3257 8.833 14.4971V10.322C8.833 9.49339 9.506 8.81909 10.333 8.81909H14.5C15.327 8.81909 16 9.49339 16 10.322V14.4971C16 15.3257 15.327 16 14.5 16Z"
                          fill="white"
                        />
                      </svg>
                      <span>Каталог</span>
                    </div>
                  </Link>
                  <div className="relative flex-1">
                    <SearchInput />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  {/* ✅ Clickable phone number */}
                  <a
                    href={`tel:${PHONE}`}
                    className="flex items-center justify-end font-medium w-[215px] flex-wrap hover:text-[#394426] transition-colors"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8586 10.2647L11.4285 10.6909C11.4285 10.6909 10.406 11.704 7.61516 8.93862C4.82434 6.1732 5.84677 5.16008 5.84677 5.16008L6.11766 4.89167C6.78496 4.23045 6.84787 3.16888 6.26567 2.39387L5.07474 0.808548C4.35415 -0.15066 2.96174 -0.277381 2.1358 0.541008L0.653405 2.00991C0.24388 2.41571 -0.0305515 2.94174 0.00272725 3.52528C0.0878673 5.01819 0.765666 8.23029 4.54785 11.978C8.55869 15.9523 12.322 16.1101 13.8609 15.9672C14.3477 15.922 14.771 15.675 15.1122 15.337L16.4538 14.0076C17.3594 13.1102 17.1041 11.5717 15.9454 10.944L14.141 9.96654C13.3802 9.55438 12.4532 9.67545 11.8586 10.2647Z"
                        fill="#1D1D1B"
                      />
                    </svg>
                    <span className="text-lg">{PHONE_DISPLAY}</span>
                    <p className="text-[12.5px] text-gray-500 w-full text-right">
                      ежедневно с 09:00 до 18:00
                    </p>
                  </a>
                </div>
                <Link
                  href="/favorites"
                  className="relative bg-gray-100 p-4 rounded-md hover:bg-gray-200 group"
                >
                  <svg
                    width="22"
                    height="19"
                    viewBox="0 0 22 19"
                    fill="none"
                    className="group-hover:scale-110 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.70234 18.4829L9.59492 18.383L2.0668 11.3136C0.747656 10.0753 0 8.33723 0 6.51665V6.37326C0 3.31434 2.14844 0.689923 5.12187 0.116375C6.81484 -0.213849 8.54648 0.181551 9.92578 1.16353C10.3125 1.44162 10.6734 1.76315 11 2.13248C11.1805 1.92392 11.3738 1.73274 11.5801 1.55459C11.7391 1.41555 11.9023 1.2852 12.0742 1.16353C13.4535 0.181551 15.1852 -0.213849 16.8781 0.11203C19.8516 0.685578 22 3.31434 22 6.37326V6.51665C22 8.33723 21.2523 10.0753 19.9332 11.3136L12.4051 18.383L12.2977 18.4829C11.9453 18.8132 11.4812 19 11 19C10.5188 19 10.0547 18.8175 9.70234 18.4829ZM10.2738 4.43971C10.2566 4.42667 10.2438 4.40929 10.2309 4.39191L9.46602 3.5229L9.46172 3.51856C8.46914 2.39319 6.96953 1.88047 5.50859 2.1629C3.50625 2.54961 2.0625 4.3137 2.0625 6.37326V6.51665C2.0625 7.75499 2.57383 8.94119 3.47188 9.78413L11 16.8535L18.5281 9.78413C19.4262 8.94119 19.9375 7.75499 19.9375 6.51665V6.37326C19.9375 4.31805 18.4937 2.54961 16.4957 2.1629C15.0348 1.88047 13.5309 2.39753 12.5426 3.51856C12.5426 3.51856 12.5426 3.51856 12.5383 3.5229C12.534 3.52725 12.5383 3.5229 12.534 3.52725L11.7691 4.39626C11.7562 4.41364 11.7391 4.42667 11.7262 4.44405C11.5328 4.63958 11.2707 4.74821 11 4.74821C10.7293 4.74821 10.4672 4.63958 10.2738 4.44405V4.43971Z"
                      fill="#1D1D1B"
                      className="group-hover:fill-[#255022] transition-colors duration-200"
                    />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-[#394426] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openCart();
                  }}
                  className="relative flex items-center gap-6 cursor-pointer bg-gray-100 p-4 rounded-md hover:bg-gray-200 group"
                >
                  <svg
                    width="22"
                    height="19"
                    viewBox="0 0 22 19"
                    fill="none"
                    className="group-hover:scale-110 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.793 11.6878H18.965C19.1313 11.688 19.293 11.6355 19.4252 11.5385C19.5575 11.4415 19.653 11.3053 19.6971 11.1509L21.9729 3.1156C22.0038 3.00713 22.0084 2.89325 21.9861 2.78282C21.9638 2.67239 21.9154 2.56841 21.8445 2.47897C21.7737 2.38954 21.6823 2.31706 21.5776 2.26721C21.4729 2.21735 21.3576 2.19145 21.2408 2.19154H3.69818L3.4137 0.602736C3.38219 0.431893 3.28855 0.277431 3.14955 0.167008C3.01056 0.0565852 2.83528 -0.00258716 2.6551 8.68158e-05H0.758601C0.557407 8.68158e-05 0.364454 0.0770483 0.222189 0.214041C0.0799238 0.351033 0 0.536834 0 0.730571C0 0.924307 0.0799238 1.11011 0.222189 1.2471C0.364454 1.38409 0.557407 1.46105 0.758601 1.46105H2.02167L3.64887 10.2269C3.3002 10.236 2.9568 10.3111 2.63829 10.448C2.31978 10.5849 2.03239 10.7809 1.79254 11.0248C1.30812 11.5173 1.04672 12.1749 1.06583 12.853C1.08495 13.531 1.38301 14.174 1.89446 14.6405C2.4059 15.1069 3.08883 15.3587 3.793 15.3403H4.43023C4.23667 15.73 4.14883 16.1606 4.17489 16.5919C4.20096 17.0231 4.34009 17.441 4.57929 17.8065C4.81849 18.172 5.14997 18.4731 5.54277 18.6818C5.93557 18.8905 6.37688 19 6.82551 19C7.27414 19 7.71546 18.8905 8.10826 18.6818C8.50106 18.4731 8.83253 18.172 9.07173 17.8065C9.31094 17.441 9.45006 17.0231 9.47613 16.5919C9.5022 16.1606 9.41435 15.73 9.22079 15.3403H13.1541C12.9606 15.73 12.8727 16.1606 12.8988 16.5919C12.9249 17.0231 13.064 17.441 13.3032 17.8065C13.5424 18.172 13.8739 18.4731 14.2667 18.6818C14.6595 18.8905 15.1008 19 15.5494 19C15.9981 19 16.4394 18.8905 16.8322 18.6818C17.225 18.4731 17.5564 18.172 17.7956 17.8065C18.0348 17.441 18.174 17.0231 18.2 16.5919C18.2261 16.1606 18.1383 15.73 17.9447 15.3403H20.1029C20.3041 15.3403 20.4971 15.2633 20.6393 15.1263C20.7816 14.9893 20.8615 14.8035 20.8615 14.6098C20.8615 14.416 20.7816 14.2302 20.6393 14.0932C20.4971 13.9562 20.3041 13.8793 20.1029 13.8793H3.793C3.49121 13.8793 3.20178 13.7638 2.98839 13.5584C2.77499 13.3529 2.6551 13.0742 2.6551 12.7836C2.6551 12.493 2.77499 12.2143 2.98839 12.0088C3.20178 11.8033 3.49121 11.6878 3.793 11.6878ZM20.2471 3.65251L18.3847 10.2269H5.18504L3.96748 3.65251H20.2471ZM7.96531 16.436C7.96531 16.6527 7.89857 16.8645 7.77354 17.0447C7.64851 17.2249 7.47079 17.3654 7.26287 17.4483C7.05494 17.5312 6.82615 17.5529 6.60542 17.5107C6.38468 17.4684 6.18193 17.364 6.02279 17.2108C5.86365 17.0575 5.75528 16.8623 5.71137 16.6497C5.66747 16.4372 5.69 16.2169 5.77612 16.0167C5.86225 15.8164 6.0081 15.6453 6.19523 15.5249C6.38235 15.4045 6.60235 15.3403 6.82741 15.3403C7.1292 15.3403 7.41863 15.4557 7.63203 15.6612C7.84543 15.8667 7.96531 16.1454 7.96531 16.436ZM16.6892 16.436C16.6892 16.6527 16.6225 16.8645 16.4974 17.0447C16.3724 17.2249 16.1947 17.3654 15.9868 17.4483C15.7789 17.5312 15.5501 17.5529 15.3293 17.5107C15.1086 17.4684 14.9058 17.364 14.7467 17.2108C14.5876 17.0575 14.4792 16.8623 14.4353 16.6497C14.3914 16.4372 14.4139 16.2169 14.5 16.0167C14.5862 15.8164 14.732 15.6453 14.9191 15.5249C15.1063 15.4045 15.3263 15.3403 15.5513 15.3403C15.8531 15.3403 16.1425 15.4557 16.3559 15.6612C16.5693 15.8667 16.6892 16.1454 16.6892 16.436Z"
                      fill="#1D1D1B"
                      className="group-hover:fill-[#255022] transition-colors duration-200"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-[#394426] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openCart();
                  }}
                >
                  <div
                    className={`text-sm font-medium text-black leading-tight ${cartCount > 0 ? "pt-4" : ""}`}
                  >
                    <span>Корзина</span>
                    {cartCount > 0 && (
                      <p className="text-xs text-[#8B8C95]">
                        на сумму {formatPrice(cartTotal)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile top bar */}
            <div className="flex md:hidden items-center justify-between py-2 px-4 relative shadow-sm z-1">
              <Link href="/">
                <div className="relative w-28 h-15">
                  <Image
                    src="/logo/logo.png"
                    alt="КЛЕВЕР"
                    fill
                    className="object-cover mt-1"
                    priority
                  />
                </div>
              </Link>
              <div className="flex items-center gap-3">
                {/* ✅ Phone icon for mobile */}
                <a
                  href={`tel:${PHONE}`}
                  className="bg-[#394426]/10 p-2 rounded-md text-[#394426] hover:bg-[#394426]/20 transition-colors"
                  aria-label="Позвонить"
                >
                  <Phone size={22} />
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-white bg-[#394426] p-2 rounded-md cursor-pointer"
                >
                  <Menu size={26} />
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
              className="fixed inset-0 bg-[#394426] z-60 md:hidden overscroll-y-contain"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className="absolute top-0 right-0 w-full h-full bg-[#394426] text-white flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-0 border-b border-white/20">
                  <div className="relative w-28 h-15">
                    <Image
                      src="/logo/logo.png"
                      alt="КЛЕВЕР"
                      fill
                      className="object-cover mt-1"
                    />
                  </div>
                  <button
                    className="mr-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="relative">
                    <SearchInput onSuggestionClick={handleLinkClick} />
                  </div>
                </div>

                <nav className="flex-1 space-y-4 font-[400] text-md overflow-y-auto px-2.5">
                  <AnimatePresence mode="wait">
                    {!showCatalogSubmenu ? (
                      <motion.div
                        key="main"
                        variants={submenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="border-b border-white/80 mx-2">
                          <Link
                            href="/actions"
                            className="block py-2"
                            onClick={handleLinkClick}
                          >
                            % Акции
                          </Link>
                        </div>
                        <div
                          className="flex items-center justify-between py-2 border-b border-white/80 mx-2 cursor-pointer"
                          onClick={() => setShowCatalogSubmenu(true)}
                        >
                          <span>Каталог</span>
                          <ChevronRight size={20} />
                        </div>
                        <div className="border-b border-white/80 mx-2">
                          <Link
                            href="/company"
                            className="block py-2"
                            onClick={handleLinkClick}
                          >
                            О компании
                          </Link>
                        </div>
                        <div className="border-b border-white/80 mx-2">
                          <Link
                            href="/blog"
                            className="block py-2"
                            onClick={handleLinkClick}
                          >
                            Блог
                          </Link>
                        </div>
                        {/* ✅ Added Partners */}
                        <div className="border-b border-white/80 mx-2">
                          <Link
                            href="/partners"
                            className="block py-2"
                            onClick={handleLinkClick}
                          >
                            Партнёрам
                          </Link>
                        </div>
                        <div className="border-b border-white/80 mx-2">
                          <button
                            onClick={() => setIsContactsOpen(true)}
                            className="block py-2 cursor-pointer w-full text-left"
                          >
                            Контакты
                          </button>
                          <ContactsModal
                            isOpen={isContactsOpen}
                            onClose={() => setIsContactsOpen(false)}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="catalog"
                        variants={submenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div
                          className="flex items-center py-2 mb-4 cursor-pointer"
                          onClick={() => setShowCatalogSubmenu(false)}
                        >
                          <ChevronLeft size={20} className="mr-2" />
                          <span>Назад</span>
                        </div>
                        {isLoading && (
                          <div className="mx-4 py-2 text-sm">Загрузка...</div>
                        )}
                        {error && (
                          <div className="mx-4 py-2 text-sm text-red-300">
                            Ошибка загрузки
                          </div>
                        )}
                        {categories?.result.map((category) => (
                          <div
                            key={category.id}
                            className="border-b border-white/80 mx-2"
                          >
                            <Link
                              href={`/catalog/${category.id}`}
                              className="block py-2 font-[300] text-md"
                              onClick={handleLinkClick}
                            >
                              {category.name}
                            </Link>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </nav>

                <div className="border-t border-white/80 mx-4" />
                <div className="p-4 mx-3.5 text-sm space-y-3">
                  {/* ✅ Clickable phone in mobile menu */}
                  <a href={`tel:${PHONE}`} className="flex items-center gap-2">
                    <Phone size={14} className="flex-shrink-0" />
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <svg
                      width="11"
                      height="15"
                      viewBox="0 0 11 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.17891 14.6629C7.64844 12.7772 11 8.20679 11 5.63959C11 2.52607 8.53646 0 5.5 0C2.46354 0 0 2.52607 0 5.63959C0 8.20679 3.35156 12.7772 4.82109 14.6629C5.17344 15.1124 5.82656 15.1124 6.17891 14.6629ZM5.5 3.75973C5.98623 3.75973 6.45255 3.95779 6.79636 4.31033C7.14018 4.66287 7.33333 5.14102 7.33333 5.63959C7.33333 6.13817 7.14018 6.61632 6.79636 6.96886C6.45255 7.3214 5.98623 7.51946 5.5 7.51946C5.01377 7.51946 4.54745 7.3214 4.20364 6.96886C3.85982 6.61632 3.66667 6.13817 3.66667 5.63959C3.66667 5.14102 3.85982 4.66287 4.20364 4.31033C4.54745 3.95779 5.01377 3.75973 5.5 3.75973Z"
                        fill="#F8F9FB"
                      />
                    </svg>
                    <span>
                      г. Казань, Мамадышский тракт, 58
                      <br />
                      пос. Залесный, ул. Залесная, 58
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.8 0H1.19999C0.719075 0 0.301866 0.29867 0.11087 0.726737C0.175104 0.741479 0.237672 0.769379 0.294923 0.811122L6.00001 4.97106L11.7051 0.811122C11.7623 0.769379 11.8249 0.741479 11.8891 0.726737C11.6981 0.29867 11.2809 0 10.8 0ZM12 1.90392L6.29493 6.06386C6.11785 6.19297 5.88216 6.19297 5.70508 6.06386L0 1.90392V8.74997C0 9.4375 0.540001 10 1.19999 10H10.8C11.46 10 12 9.4375 12 8.74997V1.90392Z"
                        fill="#F8F9FB"
                      />
                    </svg>
                    <span>sadkzn@mail.ru</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile bottom nav bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F8F9FB] border-t border-gray-200 shadow-lg z-40 md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="relative flex flex-col items-center p-2">
            <div className="bg-white p-3 rounded-sm mb-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.1944 6.19444V12.75C13.1944 13.8546 12.299 14.75 11.1944 14.75H4.30556C3.20099 14.75 2.30556 13.8546 2.30556 12.75V6.19444M14.75 7.75L7.75 0.75L0.75 7.75"
                  stroke="#394426"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs font-bold">Главная</span>
          </Link>
          <Link
            href="/catalog"
            className="relative flex flex-col items-center p-2"
          >
            <div className="bg-white p-3 rounded-sm mb-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.25"
                  cy="3.25"
                  r="2.5"
                  stroke="#394426"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="3.25"
                  cy="12.25"
                  r="2.5"
                  stroke="#394426"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.75 9.75H14.75V13.75C14.75 14.3023 14.3023 14.75 13.75 14.75H10.75C10.1977 14.75 9.75 14.3023 9.75 13.75V9.75Z"
                  stroke="#394426"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.75 0.75H5.75V4.75C5.75 5.30228 5.30228 5.75 4.75 5.75H1.75C1.19772 5.75 0.75 5.30228 0.75 4.75V0.75Z"
                  stroke="#394426"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs">Каталог</span>
          </Link>
          <Link
            href="/favorites"
            className="relative flex flex-col items-center p-2"
          >
            <div className="bg-white p-3 rounded-sm mb-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.93828 14.5918L7.85039 14.5129L1.69102 8.93178C0.611719 7.95414 0 6.58202 0 5.14472V5.03152C0 2.61658 1.75781 0.544676 4.19062 0.0918751C5.57578 -0.168828 6.99258 0.14333 8.12109 0.91858C8.4375 1.13812 8.73281 1.39196 9 1.68354C9.14766 1.51888 9.30586 1.36795 9.47461 1.22731C9.60469 1.11754 9.73828 1.01463 9.87891 0.91858C11.0074 0.14333 12.4242 -0.168828 13.8094 0.0884449C16.2422 0.541246 18 2.61658 18 5.03152V5.14472C18 6.58202 17.3883 7.95414 16.309 8.93178L10.1496 14.5129L10.0617 14.5918C9.77344 14.8525 9.39375 15 9 15C8.60625 15 8.22656 14.8559 7.93828 14.5918Z"
                  fill="#394426"
                />
              </svg>
            </div>
            {favoritesCount > 0 && (
              <span className="absolute top-3 right-4.5 bg-[#394426] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
            <span className="text-xs">Избранное</span>
          </Link>
          {/* ✅ Phone button in mobile bottom nav */}
          <a
            href={`tel:${PHONE}`}
            className="relative flex flex-col items-center p-2"
          >
            <div className="bg-white p-3 rounded-sm mb-1">
              <Phone size={24} className="text-[#394426]" />
            </div>
            <span className="text-xs">Звонок</span>
          </a>
          <button
            onClick={openCart}
            className="relative flex flex-col items-center p-2"
          >
            <div className="bg-white p-3 rounded-sm mb-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.10337 9.84238H15.5168C15.6529 9.84249 15.7852 9.79829 15.8934 9.7166C16.0016 9.63492 16.0797 9.52025 16.1158 9.39025L17.9778 2.62366C18.0031 2.53232 18.0068 2.43642 17.9886 2.34343C17.9704 2.25044 17.9308 2.16287 17.8728 2.08756C17.8148 2.01224 17.7401 1.95121 17.6544 1.90923C17.5687 1.86724 17.4744 1.84544 17.3789 1.84551H3.02578L2.79303 0.507567C2.76725 0.3637 2.69063 0.233626 2.57691 0.140639C2.46318 0.0476507 2.31977 -0.00217866 2.17236 7.3108e-05H0.620674C0.456061 7.3108e-05 0.29819 0.0648828 0.181791 0.180245C0.0653922 0.295607 0 0.452071 0 0.615218C0 0.778364 0.0653922 0.934828 0.181791 1.05019C0.29819 1.16555 0.456061 1.23036 0.620674 1.23036H1.6541L2.98544 8.6121C2.70016 8.61977 2.4192 8.68306 2.1586 8.79835C1.898 8.91364 1.66287 9.07867 1.46662 9.28402C1.07028 9.69875 0.856408 10.2525 0.872046 10.8235C0.887685 11.3946 1.13156 11.936 1.55001 12.3288C1.96846 12.7216 2.52722 12.9336 3.10337 12.9181H3.62473C3.46637 13.2463 3.3945 13.6089 3.41582 13.9721C3.43715 14.3353 3.55098 14.6872 3.74669 14.9949C3.9424 15.3027 4.21361 15.5563 4.53499 15.7321C4.85637 15.9078 5.21745 16 5.58451 16C5.95157 16 6.31265 15.9078 6.63403 15.7321C6.95541 15.5563 7.22662 15.3027 7.42233 14.9949C7.61804 14.6872 7.73187 14.3353 7.7532 13.9721C7.77453 13.6089 7.70265 13.2463 7.54429 12.9181H10.7625C10.6041 13.2463 10.5322 13.6089 10.5536 13.9721C10.5749 14.3353 10.6887 14.6872 10.8844 14.9949C11.0801 15.3027 11.3514 15.5563 11.6727 15.7321C11.9941 15.9078 12.3552 16 12.7223 16C13.0893 16 13.4504 15.9078 13.7718 15.7321C14.0932 15.5563 14.3644 15.3027 14.5601 14.9949C14.7558 14.6872 14.8696 14.3353 14.8909 13.9721C14.9123 13.6089 14.8404 13.2463 14.682 12.9181H16.4479C16.6125 12.9181 16.7703 12.8533 16.8867 12.7379C17.0031 12.6226 17.0685 12.4661 17.0685 12.303C17.0685 12.1398 17.0031 11.9834 16.8867 11.868C16.7703 11.7526 16.6125 11.6878 16.4479 11.6878H3.10337C2.85645 11.6878 2.61964 11.5906 2.44504 11.4176C2.27045 11.2445 2.17236 11.0098 2.17236 10.7651C2.17236 10.5204 2.27045 10.2857 2.44504 10.1126C2.61964 9.9396 2.85645 9.84238 3.10337 9.84238Z"
                  fill="#394426"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-3 right-2.5 bg-[#394426] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs">Корзина</span>
          </button>
        </div>
      </div>

      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </>
  );
};

export default Header;
