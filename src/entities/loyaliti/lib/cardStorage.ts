import type { LoyalityCard } from "@/entities/loyaliti";

const LOYALITY_CARD_KEY = "loyality_card_data";
const LOYALITY_CARD_EVENT = "loyality-card-updated";

const parseCard = (raw: string | null): LoyalityCard | null => {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoyalityCard;
  } catch {
    return null;
  }
};

export const readStoredLoyalityCard = (): LoyalityCard | null => {
  if (typeof window === "undefined") return null;
  return parseCard(window.localStorage.getItem(LOYALITY_CARD_KEY));
};

export const writeStoredLoyalityCard = (card: LoyalityCard | null) => {
  if (typeof window === "undefined") return;

  if (card) {
    window.localStorage.setItem(LOYALITY_CARD_KEY, JSON.stringify(card));
  } else {
    window.localStorage.removeItem(LOYALITY_CARD_KEY);
  }

  window.dispatchEvent(
    new CustomEvent(LOYALITY_CARD_EVENT, {
      detail: { card },
    }),
  );
};

export const subscribeLoyalityCard = (
  onChange: (card: LoyalityCard | null) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const onCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<{ card?: LoyalityCard | null }>;
    if ("card" in (custom.detail ?? {})) {
      onChange(custom.detail?.card ?? null);
      return;
    }

    onChange(readStoredLoyalityCard());
  };

  const onStorageEvent = (event: StorageEvent) => {
    if (event.key !== LOYALITY_CARD_KEY) return;
    onChange(parseCard(event.newValue));
  };

  window.addEventListener(LOYALITY_CARD_EVENT, onCustomEvent as EventListener);
  window.addEventListener("storage", onStorageEvent);

  return () => {
    window.removeEventListener(
      LOYALITY_CARD_EVENT,
      onCustomEvent as EventListener,
    );
    window.removeEventListener("storage", onStorageEvent);
  };
};

