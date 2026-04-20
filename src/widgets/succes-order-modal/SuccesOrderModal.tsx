import ActionButton from "@/components/ui/action-button";
import React from "react";

interface SuccesOrderModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccesOrderModal: React.FC<SuccesOrderModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed px-4 md:px-0 inset-0 z-2500 flex items-center justify-center bg-black/80 backdrop-blur-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background flex flex-col items-center rounded-2xl p-6 md:p-12"
          >
            <h2 className="h !text-center">Спасибо за заказ</h2>
            <p className="p mb-6">
              Возвращайтесь к нам почаще и дарите близким радость!
            </p>
            <ActionButton
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              text="Вернутся к покупкам"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SuccesOrderModal;
