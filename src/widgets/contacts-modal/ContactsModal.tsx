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
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </button>
                <p className="text-xs text-white/70 text-center mt-3">
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных данных
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
