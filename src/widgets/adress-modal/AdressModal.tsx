import React, { useEffect, useMemo, useState } from "react";
import {
  ADDRESS_FORM_STORAGE_KEY,
  useAddressSuggestions,
  useSavedAddressForm,
} from "@/entities/address";

interface AddressType {
  address: string;
  apartment: string;
  entrance: string;
  floor: string;
}

const AdressModal = () => {
  const [isOpen, setOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const { data } = useAddressSuggestions(addressQuery);
  const [suggOpen, setSuggOpen] = useState(false);
  const savedAddressForm = useSavedAddressForm();
  const [localAddress, setLocalAddress] = useState<AddressType>();

  const suggestions = useMemo(
    () => data?.suggestions ?? [],
    [data?.suggestions],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (!savedAddressForm) return;

    const nextAddress = savedAddressForm.address ?? "";
    const nextApartment = savedAddressForm.apartment ?? "";
    const nextEntrance = savedAddressForm.entrance ?? "";
    const nextFloor = savedAddressForm.floor ?? "";

    queueMicrotask(() => {
      setAddressQuery(nextAddress);
      setApartment(nextApartment);
      setEntrance(nextEntrance);
      setFloor(nextFloor);
    });
  }, [isOpen, savedAddressForm]);

  useEffect(() => {
    if (!window) return;
    const raw = localStorage.getItem(ADDRESS_FORM_STORAGE_KEY);

    if (!raw) return;
    const data: AddressType = JSON.parse(raw);

    setTimeout(() => {
      setLocalAddress(data);
    });
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="cursor-pointer rounded-lg p-3 bg-gray col-span-3 text-left truncate max-w-50 lg:max-w-90 xl:max-w-45 lxl:max-w-60 2xl:max-w-80"
      >
        {localAddress ? localAddress.address : "Выберите адрес доставки"}
      </button>
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="cursor-default px-10 fixed  inset-0 z-50 bg-black/60 flex justify-center items-center"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSuggOpen(false);
            }}
            className="bg-background rounded-2xl max-w-180 max-h-160 lg:max-w-auto lg:max-h-auto py-6 xl:py-14 px-12 xl:px-22"
          >
            <h2 className="h !text-3xl xl:!text-4xl !text-center">
              Куда везти цветы?
            </h2>
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
                className="c text-center outline-none rounded-lg p-3 bg-gray"
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
            </div>
            <button
              onClick={() => {
                const payload = {
                  address: addressQuery,
                  apartment,
                  entrance,
                  floor,
                };

                try {
                  localStorage.setItem(
                    ADDRESS_FORM_STORAGE_KEY,
                    JSON.stringify(payload),
                  );
                  window.dispatchEvent(new Event("address-form-saved"));
                } catch {}
                setOpen(false);
              }}
              className="cursor-pointer hover:bg-white hover:border-black hover:text-black duration-500 transition-all border-1 border-black bg-black text-white w-full rounded-lg mt-2 p-2"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdressModal;
