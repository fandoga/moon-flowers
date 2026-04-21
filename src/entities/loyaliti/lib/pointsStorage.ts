const LOGO_POINTS_KEY = "logo_points";
const LOGO_POINTS_SIGN_KEY = "logo_points_sign";
const LOGO_POINTS_EVENT = "logo-points-updated";
const SECRET_SALT = "moon_flowers_secret_2026";

const normalizePoints = (value: unknown): number => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.floor(numeric));
};

// Простая подпись данных
const generateSignature = (points: number): string => {
  // Используем простой хеш, не требуем криптостойкость, достаточно чтобы нельзя было просто изменить руками
  let hash = 0;
  const str = `${points}${SECRET_SALT}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return String(hash);
};

const verifyPoints = (points: number, signature: string): boolean => {
  return generateSignature(points) === signature;
};

export const readLogoPoints = (): number => {
  if (typeof window === "undefined") return 0;
  
  const rawPoints = window.localStorage.getItem(LOGO_POINTS_KEY);
  const rawSign = window.localStorage.getItem(LOGO_POINTS_SIGN_KEY);
  
  const points = normalizePoints(rawPoints);

  // Если подписи нет или не совпадает - сбрасываем на 0
  if (!rawSign || !verifyPoints(points, rawSign)) {
    writeLogoPoints(0);
    return 0;
  }

  return points;
};

export const writeLogoPoints = (nextPoints: number): number => {
  const normalized = normalizePoints(nextPoints);
  
  // Ограничение на максимальные 500 баллов
  const clamped = Math.min(normalized, 500);

  if (typeof window === "undefined") return clamped;

  const signature = generateSignature(clamped);

  window.localStorage.setItem(LOGO_POINTS_KEY, String(clamped));
  window.localStorage.setItem(LOGO_POINTS_SIGN_KEY, signature);

  window.dispatchEvent(
    new CustomEvent(LOGO_POINTS_EVENT, { detail: { points: clamped } }),
  );

  return clamped;
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

