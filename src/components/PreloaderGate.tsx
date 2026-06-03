"use client";

import { useEffect, useState } from "react";
import { Preloader } from "@/components/Preloader";

export function PreloaderGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("aimiko-preloader-shown");

    if (!alreadyShown) {
      sessionStorage.setItem("aimiko-preloader-shown", "true");
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return <Preloader />;
}
