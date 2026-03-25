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
                +7 966 240-90-53
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
