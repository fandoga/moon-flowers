"use client";

import React from "react";
import LoyalitiModal from "@/widgets/loyaliti-modal/LoyalitiModal";
import { formatPhone } from "@/lib/utils/formatPhone";

interface RecipientFormProps {
  activeInput: "From" | "To";
  setActiveInput: (value: "From" | "To") => void;
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientPhone: string;
  setRecipientPhone: (value: string) => void;
}

/**
 * Форма отправителя и получателя заказа
 */
const RecipientForm: React.FC<RecipientFormProps> = ({
  activeInput,
  setActiveInput,
  name,
  setName,
  phone,
  setPhone,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
}) => {
  return (
    <div>
      <h3 className="mb-3">Получатель</h3>
      <div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray w-full max-h-12 flex items-center justify-between rounded-lg p-1">
            <button
              onClick={() => setActiveInput("From")}
              type="button"
              className={`cursor-pointer w-1/2 rounded-lg p-2 ${activeInput === "From" && "bg-background"}`}
            >
              От кого
            </button>
            <button
              type="button"
              onClick={() => setActiveInput("To")}
              className={`cursor-pointer w-1/2 rounded-lg p-2 ${activeInput === "To" && "bg-background"}`}
            >
              Кому
            </button>
          </div>
          <input
            value={activeInput === "From" ? name : recipientName}
            onChange={(e) => {
              if (activeInput === "From") {
                setName(e.target.value);
              } else {
                setRecipientName(e.target.value);
              }
            }}
            className="bg-gray rounded-lg p-3 w-full"
            placeholder={"Имя"}
            type="text"
          />
          <input
            value={activeInput === "From" ? phone : recipientPhone}
            onChange={(e) => {
              if (activeInput === "From") {
                setPhone(formatPhone(e.target.value));
              } else {
                setRecipientPhone(formatPhone(e.target.value));
              }
            }}
            className="bg-gray rounded-lg p-3 w-full"
            placeholder={"+7 (000) 000-00-00"}
            type="tel"
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientForm;
