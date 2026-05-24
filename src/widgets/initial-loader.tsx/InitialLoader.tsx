"use client";

import { LogoMark } from "@/components/ui/logo-mark";
import React, { useEffect, useState } from "react";

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <LogoMark animated className="scale-150" />
    </div>
  );
};

const InitialLoader = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (sessionStorage.getItem("splash")) {
      const hideTimeout = window.setTimeout(() => setShow(false));
      return () => window.clearTimeout(hideTimeout);
    }

    let isMounted = true;
    let loadTimeout: number | undefined;
    const minSplash = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 700);
    });
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }

      const done = () => resolve();
      window.addEventListener("load", done, { once: true });
      loadTimeout = window.setTimeout(done, 3000);
    });

    Promise.all([minSplash, pageLoaded]).then(() => {
      if (!isMounted) return;
      sessionStorage.setItem("splash", "1");
      setShow(false);
    });

    return () => {
      isMounted = false;
      if (loadTimeout) {
        window.clearTimeout(loadTimeout);
      }
    };
  }, []);

  return (
    <>
      {children}
      {show ? <FullScreenLoader /> : null}
    </>
  );
};

export default InitialLoader;
