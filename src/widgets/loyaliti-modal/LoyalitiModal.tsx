import { useLoyalityCardData } from "@/entities/loyaliti/hooks/useLoyalityCard";
import { formatPhone, getCleanPhone } from "@/lib/utils/formatPhone";
import { Check, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

interface LoyalitiModalProps {
  simple?: boolean;
  name?: string;
  phone?: string;
}

const LoyalitiModal: React.FC<LoyalitiModalProps> = ({
  simple,
  name,
  phone,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [modalPhone, setPhone] = useState("");
  const [modalName, setName] = useState("");
  const [inputError, setInputError] = useState("");
  const { currentCard, createOrGetCard, error, isLoading } =
    useLoyalityCardData();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHydrated(true);
    });
  }, [phone, name]);

  useEffect(() => {
    setTimeout(() => {
      setPhone(phone || "");
      setName(name || "");
      setInputError("");
    });
  }, [isOpen, name, phone]);

  const handleClick = async () => {
    const cleanPhone = getCleanPhone(modalPhone);

    if (cleanPhone.length !== 11 || modalName.length === 0) {
      setInputError("Заполните все поля корректно");
      return;
    }

    try {
      await createOrGetCard({
        phone_number: cleanPhone,
        contragent_name: modalName,
      });
      setOpen(false);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Не удалось создать карту лояльности";
      setInputError(message);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          if (currentCard) return;
          setOpen(true);
        }}
        className={`${currentCard && "!text-muted-foreground !cursor-default !bg-gray !border-none"} ${simple ? "bg-gray py-1" : "group hover:bg-background col-span-2 hover:border-black hover:text-black transition-all border-1 border-black bg-black text-white py-8"} cursor-pointer h-12 duration-400 flex justify-between items-center pl-4 pr-1 rounded-lg w-full`}
      >
        {" "}
        {hydrated && currentCard
          ? simple
            ? "Карта подключена"
            : "Карта лояльности включена"
          : simple
            ? "Применить баллы"
            : "Подключить карту лояльности"}
        {!simple && (
          <div
            className={`flex justify-center items-center ${currentCard ? "!text-muted-foreground !bg-gray" : "group-hover:bg-black group-hover:text-white"} duration-400 text-black bg-white w-14 h-14 rounded-lg`}
          >
            {currentCard ? (
              <Check size={24} />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.75 6.75H6.75M6.75 6.75H0.75M6.75 6.75V0.75M6.75 6.75V12.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="cursor-default fixed px-4 md:px-0 inset-0 z-50 bg-black/80 backdrop-blur-lg flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl py-4 px-12 md:py-14 md:px-22"
          >
            <h2 className="h !text-3xl md:!text-4xl !text-center">
              Заполните анкету
            </h2>
            <p className="p !text-center">
              Оформите карту лояльности и получайте баллы для скидки.
            </p>
            <div className="pt-8 flex flex-col gap-4">
              <input
                value={modalName}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray  rounded-lg p-3 w-full"
                placeholder="Имя"
                type="text"
              />
              <input
                value={modalPhone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="bg-gray rounded-lg p-3 w-full"
                placeholder="+7 (000) 000-00-00"
                type="tel"
              />
              {inputError.length > 0 && (
                <span className="text-sm text-destructive">{inputError}</span>
              )}
              {error && (
                <span className="text-sm text-destructive">
                  {error.message}
                </span>
              )}
              <button
                onClick={() => handleClick()}
                type="button"
                className="cursor-pointer h-12 bg-black flex items-center justify-center gap-2 text-white p-2 rounded-lg"
              >
                Получить баллы
                {isLoading && <Loader />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoyalitiModal;
