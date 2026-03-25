"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsModal = ({ isOpen, onClose }: ContactsModalProps) => {
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
      isOpen = false;
    } catch (error) {
      toast.error("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-[#F8F9FB] rounded-xl mr-4 w-[90%] sm:w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl pt-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X size={28} />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#394426] mb-2">Адрес</h3>
                <p className="text-gray-700 leading-relaxed">
                  г. Казань, Мамадышский тракт, 58
                  <br />
                  пос. Залесный, ул. Залесная, 58
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#394426] mb-2">
                  Телефоны
                </h3>
                <p className="text-gray-700">
                  +7 (966) 240-90-53
                  <svg
                    width="40px"
                    height="40px"
                    viewBox="0 -10 40 60"
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
                  <br />
                  +7 (966) 240-90-55
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#394426] mb-2">Email</h3>
                <p className="text-gray-700">sadkzn@mail.ru</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#394426] mb-2">
                  Режим работы
                </h3>
                <p className="text-gray-700">ежедневно с 09:00 до 18:00</p>
              </div>
            </div>

            <div className="h-64 md:h-[420px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=49.106414%2C55.796127&z=12&l=map&pt=49.106414,55.796127,pm2blm"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div className="bg-[#394426] text-white rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
              Оставьте заявку — подберём растения для вашего проекта
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ФИО"
                  className="w-full rounded-md bg-white text-black placeholder-gray-400 p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Телефон *"
                  required
                  className="w-full rounded-md bg-white text-black placeholder-gray-400 p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ваш вопрос или пожелания"
                  rows={3}
                  className="w-full rounded-md bg-white text-black placeholder-gray-400 p-3 border-b border-white/30 pb-3 focus:outline-none focus:border-white/60 text-base sm:text-lg"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-[#394426] hover:text-white hover:bg-[#102902] font-medium py-3.5 rounded-lg transition-colors mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isSubmitting ? "Отправка..." : "Отправить заявку"}
                </button>
                <p className="text-xs text-white/70 text-center mt-3">
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных
                  данных
                </p>
              </form>

              <div className="hidden mb-5 lg:flex flex-col justify-center space-y-4 text-base">
                <p className="font-medium">Есть вопросы?</p>
                <div>
                  <p className="font-bold text-lg">+7 966 240-90-53</p>
                  <p className="text-white/80">пн–вс с 09:00 до 18:00</p>
                </div>
                <p>sadkzn@mail.ru</p>
              </div>

              <div className="lg:hidden space-y-4 text-sm mt-6">
                <p className="font-medium">Позвоните или напишите:</p>
                <p className="font-bold">+7 966 240-90-53</p>
                <p>sadkzn@mail.ru</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
