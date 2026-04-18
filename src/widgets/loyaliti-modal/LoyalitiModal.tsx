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
        className={`${currentCard && "!text-muted-foreground !bg-gray !border-none"} ${simple ? "bg-gray" : "group hover:bg-background hover:border-black hover:text-black transition-all border-1 border-black bg-black  text-white"} cursor-pointer h-12  flex justify-between items-center  pl-4 rounded-lg p-1 w-full`}
      >
        {" "}
        {hydrated && currentCard
          ? simple
            ? "Баллы применены"
            : "Карта лояльности включена"
          : simple
            ? "Применить баллы"
            : "Подключить карту лояльности"}
        {!simple && (
          <div
            className={`flex justify-center ${currentCard ? "!text-muted-foreground !bg-gray" : "group-hover:bg-black group-hover:text-white"} items-center text-black bg-white w-10 h-10 rounded-lg`}
          >
            {currentCard ? (
              <Check />
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
          className="cursor-default fixed inset-0 z-50 bg-black/60 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl py-14 px-22"
          >
            <h2 className="h !text-center">Заполните анкету</h2>
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
