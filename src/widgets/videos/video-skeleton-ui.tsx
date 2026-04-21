import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";

/** Скелетон под область превью в сетке (внутри кнопки-карточки). */
export function GridVideoSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] rounded-2xl bg-skeleton",
        className,
      )}
      aria-hidden
    />
  );
}

/** Плейсхолдер под слайд в десктоп-модалке: задаёт размеры до загрузки метаданных видео. */
export function ModalDesktopSlideSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Skeleton
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-skeleton",
        className,
      )}
      aria-hidden
    />
  );
}

/** Контейнер слайда десктоп-модалки: без intrinsic — один и тот же силуэт (Tailwind aspect + ширина); с intrinsic — точный aspect под кадр. */
export function ModalDesktopSlideFrame({
  children,
  intrinsic,
  className,
}: {
  children: ReactNode;
  /** После готовности видео — videoWidth/videoHeight. Пока null — фиксированный 9/14, все скелетоны одного размера. */
  intrinsic?: { w: number; h: number } | null;
  className?: string;
}) {
  const hasIntrinsic = !!intrinsic && intrinsic.w > 0 && intrinsic.h > 0;

  return (
    <div
      className={cn(
        "relative mx-auto inline-block overflow-hidden rounded-xl max-h-[min(86vh,92dvh)]",
        hasIntrinsic
          ? "w-auto max-w-[min(52vh,100vw)]"
          : "aspect-[9/14] w-[min(52vh,100vw)] max-w-full",
        className,
      )}
      style={
        hasIntrinsic
          ? { aspectRatio: `${intrinsic!.w} / ${intrinsic!.h}` }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/** Скелетон в тач-модалке до готовности потока (логотип по центру). */
export function ModalTouchVideoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4"
      aria-hidden
    >
      <div className={cn("scale-150 opacity-50", className)}>
        <Logo color="white" alwaysEnabled />
      </div>
    </div>
  );
}
