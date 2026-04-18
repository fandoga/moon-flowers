const LOGO_POINTS_KEY = "logo_points";
const LOGO_POINTS_EVENT = "logo-points-updated";

const normalizePoints = (value: unknown): number => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.floor(numeric));
};

export const readLogoPoints = (): number => {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(LOGO_POINTS_KEY);
  return normalizePoints(raw);
};

export const writeLogoPoints = (nextPoints: number): number => {
  const normalized = normalizePoints(nextPoints);
  if (typeof window === "undefined") return normalized;

  window.localStorage.setItem(LOGO_POINTS_KEY, String(normalized));
  window.dispatchEvent(
    new CustomEvent(LOGO_POINTS_EVENT, { detail: { points: normalized } }),
  );

  return normalized;
};

export const subscribeLogoPoints = (
  onChange: (points: number) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<{ points?: unknown }>;
    if (custom.detail && custom.detail.points !== undefined) {
      onChange(normalizePoints(custom.detail.points));
      return;
    }
    onChange(readLogoPoints());
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key !== LOGO_POINTS_KEY) return;
    onChange(normalizePoints(event.newValue));
  };

  window.addEventListener(LOGO_POINTS_EVENT, handleCustomEvent as EventListener);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(
      LOGO_POINTS_EVENT,
      handleCustomEvent as EventListener,
    );
    window.removeEventListener("storage", handleStorageEvent);
  };
};

