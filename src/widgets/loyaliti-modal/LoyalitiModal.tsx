import { useCreateLoyalityCard } from "@/entities/loyaliti";
import React, { useState } from "react";

const LoyalitiModal = ({ simple }: { simple?: boolean }) => {
  const [isOpen, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");

  const { error } = useCreateLoyalityCard();
  const createCard = useCreateLoyalityCard();

  const handleCreate = () => {
    setInputError("");
    if (phone.length < 6 || name.length <= 0) {
      setInputError("Заполните все поля");
      return;
    }

    createCard.mutate({ phone_number: phone, contragent_name: name });
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`${simple ? "bg-gray" : "group hover:bg-background hover:border-black hover:text-black transition-all border-1 border-black bg-black  text-white"} cursor-pointer h-12  flex justify-between items-center  pl-4 rounded-lg p-1 w-full`}
      >
        {simple ? "Применить баллы" : "Подключить карту лояльности"}
        {!simple && (
          <div className="flex justify-center group-hover:bg-black items-center bg-white w-10 h-10 rounded-lg">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-black group-hover:text-white transition-colors"
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
                onChange={(e) => setName(e.target.value)}
                className="bg-gray  rounded-lg p-3 w-full"
                placeholder="Имя"
                type="text"
              />
              <input
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray rounded-lg p-3 w-full"
                placeholder="+7 (000) 000-00-00"
                type="tel"
              />
              {inputError.length > 0 && (
                <span className="text-sm text-destructive">{inputError}</span>
              )}
              <button
                onClick={() => handleCreate()}
                type="button"
                className="cursor-pointer h-12 bg-black text-white p-2 rounded-lg"
              >
                Получить баллы
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoyalitiModal;
