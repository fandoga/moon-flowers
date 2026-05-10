"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const YANDEX_METRIKA_ID = 109129866;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export default function YandexMetrikaPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    window.ym?.(YANDEX_METRIKA_ID, "hit", window.location.href);
  }, [pathname, searchParams]);

  return null;
}
