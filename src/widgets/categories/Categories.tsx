import React, { useEffect, useRef, useState } from "react";
import { useCategories } from "@/entities/category";

const DRAG_THRESHOLD_PX = 8;

interface CategoriesProps {
  setter: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const Categories: React.FC<CategoriesProps> = ({ setter }) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const query = useCategories();

  const categories = query.data?.result;

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const dragActiveRef = useRef(false);
  const draggedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const removeDocListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      removeDocListenersRef.current?.();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;

    removeDocListenersRef.current?.();
    suppressClickRef.current = false;
    draggedRef.current = false;
    dragActiveRef.current = false;
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = el.scrollLeft;
    setIsGrabbing(true);

    const onMove = (ev: PointerEvent) => {
      if (!scrollRef.current) return;
      const dx = ev.clientX - dragStartXRef.current;
      if (!dragActiveRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        dragActiveRef.current = true;
        draggedRef.current = true;
      }
      scrollRef.current.scrollLeft = scrollStartRef.current - dx;
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse" || ev.button !== 0) return;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      removeDocListenersRef.current = null;
      setIsGrabbing(false);
      if (draggedRef.current) {
        suppressClickRef.current = true;
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    removeDocListenersRef.current = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  };

  const onChipClick = (e: React.MouseEvent, next: number | undefined) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      return;
    }
    setter(next);
  };

  return (
    <div
      ref={scrollRef}
      onPointerDown={onPointerDown}
      className={`flex w-full min-w-0 self-stretch touch-pan-x select-none items-center gap-2 overflow-x-auto py-2 md:py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isGrabbing ? "cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <div
        onClick={(e) => onChipClick(e, undefined)}
        className={`w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl ${
          isGrabbing ? "cursor-grabbing" : "cursor-pointer"
        }`}
      >
        Все
      </div>
      {categories &&
        categories.map((item) => (
          <div
            onClick={(e) => onChipClick(e, item.id)}
            className={`w-40 md:w-60 h-15 shrink-0 pt-4.5 text-center p-2 bg-gray rounded-xl ${
              isGrabbing ? "cursor-grabbing" : "cursor-pointer"
            }`}
            key={item.id}
          >
            {item.name}
          </div>
        ))}
    </div>
  );
};

export default Categories;
