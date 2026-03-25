// widgets/form-request/FormRequest.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const FormRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      toast.error("Пожалуйста, укажите телефон");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://user-agent.cc/hook/JbSg0wYkBnjdaylUrzmFHiCT0bpco4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
          }),
        },
      );
      if (!response.ok) throw new Error("Ошибка отправки");
      toast.success("Заявка отправлена!");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <section className="py-20 md:py-25 bg-[#F8F9FB]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-16 xl:gap-24">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h2 className="font-manrope text-center sm:text-left font-semibold text-[24px] sm:text-[clamp(32px,5vw,60px)] leading-[1] tracking-normal text-[#394426] pb-5">
              Оставьте заявку — <br className="" />
              и мы подберём <br className="hidden lg:block" />
              идеальные растения <br className="hidden sm:block" />
              для вашего проекта
            </h2>
            <div className="hidden sm:block mt-14 space-y-3 text-[#394426] font-manrope font-medium text-[clamp(18px,2.5vw,25px)] leading-[1] tracking-normal">
              <p>
                Позвоните или напишите нам,
                <br />
                если есть вопросы:
              </p>
              <p className="font-bold text-[clamp(18px,2.5vw,25px)] leading-[1]">
                +7 966 240-90-55
              </p>
              <p className="flex items-center font-bold text-[clamp(18px,2.5vw,25px)] leading-[1]">
                +7 966 240-90-53{" "}
                <svg
                  width="70px"
                  height="70px"
                  viewBox="-10.6 -23.6 83.20 83.20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline"
                  stroke="#000000"
                  stroke-width="0.00032"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                      fill="#BFC8D0"
                    ></path>{" "}
                    <path
                      d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
                      fill="url(#paint0_linear_87_7264)"
                    ></path>{" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                      fill="white"
                    ></path>{" "}
                    <path
                      d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                      fill="white"
                    ></path>{" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id="paint0_linear_87_7264"
                        x1="26.5"
                        y1="7"
                        x2="4"
                        y2="28"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop stop-color="#5BD066"></stop>{" "}
                        <stop offset="1" stop-color="#27B43E"></stop>{" "}
                      </linearGradient>{" "}
                    </defs>{" "}
                  </g>
                </svg>
              </p>
              <p className="text-[clamp(18px,2.5vw,25px)] leading-[1]">
                sadkzn@mail.ru
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full lg:w-[420px] xl:w-[590px] bg-[#394426] text-white rounded-2xl p-6 sm:p-8 md:p-10"
          >
            <motion.form
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <motion.input
                variants={fadeInRight}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ФИО"
                className="w-full rounded-md bg-white text-black placeholder-black p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg"
              />
              <motion.input
                variants={fadeInRight}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон"
                required
                className="w-full bg-white rounded-md text-black placeholder-black p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg"
              />
              <motion.textarea
                variants={fadeInRight}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Ваш вопрос"
                rows={3}
                className="w-full bg-white rounded-md text-black placeholder-black p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg resize-none"
              />
              <motion.button
                variants={fadeInRight}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-[#394426] font-manrope font-medium text-base sm:text-lg py-3.5 rounded-lg transition-colors mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {isSubmitting ? "Отправка..." : "Отправить"}
              </motion.button>
              <motion.p
                variants={fadeInRight}
                className="text-xs sm:text-sm text-white/70 text-center sm:mt-3"
              >
                Нажимая на кнопку, вы даёте согласие на обработку{" "}
                <br className="hidden sm:inline" />
                персональных данных
              </motion.p>
            </motion.form>
          </motion.div>
          <div className="block lg:hidden mt-8 space-y-3 text-[#394426] w-full text-center font-manrope font-medium text-[clamp(18px,4vw,25px)] leading-[1] tracking-normal">
            <p>
              Позвоните или напишите нам,
              <br />
              если есть вопросы:
            </p>
            <p className="font-bold text-[clamp(18px,4vw,25px)] leading-[1]">
              +7 966 240-90-53
            </p>
            <p className="text-[clamp(18px,4vw,25px)] leading-[1]">
              sadkzn@mail.ru
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormRequest;
