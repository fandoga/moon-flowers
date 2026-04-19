"use client";

import Logo from "@/components/ui/logo";
import React, { useEffect, useState } from "react";

const InitialLoader = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (sessionStorage.getItem("splash")) {
      setTimeout(() => setShow(false));
      return;
    }
    const done = () => {
      sessionStorage.setItem("splash", "1");
      setShow(false);
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(() => done()));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!show) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <Logo />
      </div>
      {children}
    </>
  );
};

export default InitialLoader;
