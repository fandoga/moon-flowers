import { X } from "lucide-react";
import Image from "next/image";
import React, { SetStateAction } from "react";

interface ProductImgModalProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  src: string;
}

const ProductImgModal: React.FC<ProductImgModalProps> = ({
  open,
  setOpen,
  src,
}) => {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="absolute z-1000 px-12 md:px-0 inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center"
        >
          <div className="cursor-pointer absolute top-10 right-10">
            <X color="white" />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl overflow-hidden"
          >
            <Image
              width={400}
              height={500}
              className="w-full h-full object-cover"
              src={src}
              alt="img"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImgModal;
