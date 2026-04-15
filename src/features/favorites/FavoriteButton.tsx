"use client";

type FavoriteButtonProps = {
  productId: number;
};

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Favorite product ${productId}`}
      className="h-9 w-9 rounded-full bg-white/90 text-[#394426] shadow-sm"
      onClick={(event) => {
        // Stub: keep click local so card navigation does not trigger.
        event.stopPropagation();
      }}
    >
      ❤
    </button>
  );
}
