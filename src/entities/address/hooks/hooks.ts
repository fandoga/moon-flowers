import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAddressSuggestions } from "../api/api";
import { type SavedAddressForm } from "../types/types";

export const ADDRESS_FORM_STORAGE_KEY = "address_form_data";

const readSavedAddressForm = (): SavedAddressForm | null => {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(ADDRESS_FORM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedAddressForm;
  } catch {
    return null;
  }
};

export const useAddressSuggestions = (query: string) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["address-suggestions", normalizedQuery],
    queryFn: () => getAddressSuggestions({ query: normalizedQuery }),
    enabled: normalizedQuery.length >= 3,
  });
};

export const useSavedAddressForm = () => {
  const [savedAddressForm, setSavedAddressForm] =
    useState<SavedAddressForm | null>(() => readSavedAddressForm());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleExternalUpdate = () => {
      setSavedAddressForm(readSavedAddressForm());
    };

    window.addEventListener("address-form-saved", handleExternalUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === ADDRESS_FORM_STORAGE_KEY) {
        handleExternalUpdate();
      }
    });

    return () => {
      window.removeEventListener("address-form-saved", handleExternalUpdate);
    };
  }, []);

  return savedAddressForm;
};
