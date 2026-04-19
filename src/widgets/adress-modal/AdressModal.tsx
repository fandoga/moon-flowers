import React, { useEffect, useMemo, useState } from "react";
import {
  ADDRESS_FORM_STORAGE_KEY,
  useAddressSuggestions,
  useSavedAddressForm,
} from "@/entities/address";

const AdressModal = () => {
  const [isOpen, setOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const { data } = useAddressSuggestions(addressQuery);
  const [suggOpen, setSuggOpen] = useState(false);
  const savedAddressForm = useSavedAddressForm();

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="cursor-pointer rounded-lg p-3 bg-gray col-span-3"
      >
        Выбрать адрес доставки
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
            <div className="w-full overlflow-hidden py-8">
              <div style={{ position: "relative", overflow: "hidden" }}>
                <a
                  href="https://yandex.ru/maps/213/moscow/?utm_medium=mapframe&utm_source=maps"
                  style={{
                    color: "#eee",
                    fontSize: "12px",
                    position: "absolute",
                    top: "0px",
                  }}
                >
                  Москва
                </a>
                <a
                  href="https://yandex.ru/maps/213/moscow/house/bolshaya_pereyaslavskaya_ulitsa_52s1/Z04YcANgT0cEQFtvfXt5dnRnYw==/?from=tableau_yabro&ll=37.640652%2C55.787861&utm_medium=mapframe&utm_source=maps&z=20.77"
                  style={{
                    color: "#eee",
                    fontSize: "12px",
                    position: "absolute",
                    top: "14px",
                  }}
                >
                  Большая Переяславская улица, 52с1 — Яндекс Карты
                </a>
                <iframe
                  src="https://yandex.ru/map-widget/v1/?from=tableau_yabro&ll=37.640652%2C55.787861&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1Njc0MzYwMhJX0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCR0L7Qu9GM0YjQsNGPINCf0LXRgNC10Y_RgdC70LDQstGB0LrQsNGPINGD0LvQuNGG0LAsIDUy0YExIgoNAJAWQhXBJl9C&z=20.77"
                  width="560"
                  height="400"
                  frameBorder="1"
                  className="w-full h-70 md:max-h-80 lg:max-h-100 rounded-4xl"
                  allowFullScreen
                  style={{ position: "relative" }}
                ></iframe>
              </div>
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
              className="cursor-pointer hover:bg-white hover:border-black hover:text-black transition-all border-1 border-black bg-black text-white w-full rounded-lg p-2"
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
