"use client";

import React from "react";
import DatePicker from "@/widgets/time-picker/TimePicker";

interface DeliveryFormProps {
  addressQuery: string;
  setAddressQuery: (value: string) => void;
  apartment: string;
  setApartment: (value: string) => void;
  entrance: string;
  setEntrance: (value: string) => void;
  floor: string;
  setFloor: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  suggOpen: boolean;
  setSuggOpen: (value: boolean) => void;
  suggestions: string[];
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  time: string;
  setTime: (value: string) => void;
  deliveryPreferSoon: boolean;
  setDeliveryPreferSoon: (value: boolean) => void;
}

/**
 * Форма доставки, адрес и время
 */
const DeliveryForm: React.FC<DeliveryFormProps> = ({
  addressQuery,
  setAddressQuery,
  apartment,
  setApartment,
  entrance,
  setEntrance,
  floor,
  setFloor,
  comment,
  setComment,
  suggOpen,
  setSuggOpen,
  suggestions,
  date,
  setDate,
  time,
  setTime,
  deliveryPreferSoon,
  setDeliveryPreferSoon,
}) => {
  return (
    <div>
      <h3 className="mb-3">Доставка</h3>
      <div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 relative">
            <input
              onInput={() => setSuggOpen(true)}
              className="text-center outline-none rounded-lg p-3 bg-gray col-span-3 w-full"
              placeholder="Начните вводить адрес"
              type="text"
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
            />
            {suggestions.length > 0 && suggOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-lg bg-white shadow-lg border border-[#E5E5E5] overflow-hidden z-10">
                {suggestions.map((item, index) => {
                  return (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => {
                        setAddressQuery(item);
                        setSuggOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-[#F5F5F5]"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <input
            placeholder="Квартира"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            className="text-center outline-none rounded-lg p-3 bg-gray"
          />
          <input
            placeholder="Подьезд"
            value={entrance}
            onChange={(e) => setEntrance(e.target.value)}
            className=" text-center outline-none rounded-lg p-3 bg-gray"
          />

          <input
            placeholder="Этаж"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="text-center outline-none rounded-lg p-3 bg-gray"
          />
          <DatePicker
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
            preferSoon={deliveryPreferSoon}
            onPreferSoonChange={setDeliveryPreferSoon}
          />
          <textarea
            placeholder="Примечание к заказу"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="col-span-3 text-left outline-none rounded-lg p-3 bg-gray resize-none overflow-hidden transition-[height] duration-300 ease-in-out"
            style={{ height: "48px" }}
            onFocus={(e) => {
              e.target.style.height = "112px";
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.style.height = "48px";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;
