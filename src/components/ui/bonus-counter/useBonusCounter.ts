"use client";
import { useState, useEffect } from "react";
import {
  readLogoPoints,
  subscribeLogoPoints,
} from "@/entities/loyaliti/lib/pointsStorage";

/**
 * Хук для работы с бонусными баллами
 * Управляет чтением из localStorage, подпиской на события обновления
 */
export const useBonusCounter = () => {
  const [points, setPoints] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setPoints(readLogoPoints());
    setIsReady(true);

    const unsubscribe = subscribeLogoPoints((nextPoints) => {
      setPoints(nextPoints);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const pointDigits = Math.max(0, points).toString().split("");

  return {
    points,
    isReady,
    pointDigits,
    isMaxed: points >= 500,
  };
};
