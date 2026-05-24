import { Suspense } from "react";

import { FullScreenLoader } from "@/widgets/initial-loader.tsx/InitialLoader";
import { Metadata } from "next";
import CatalogPageInner from "@/widgets/catalog-page/CatalogPageInner";

export interface CatalogItemType {
  id: string | number;
  name?: string | "";
  price?: number;
  image?: string | "";
  count?: number;
  categoryId?: number;
}
export const metadata: Metadata = {
  title: "Moon Flowers - Каталог цветов",
  description:
    "Доставка самых разных букетов на любой вкус. Moon Flowers - Москва.",
  openGraph: {
    title: "Moon Flowers - Доставка цветов в Москве",
    description:
      "Доставка самых разных букетов на любой вкус. Moon Flowers - Москва.",
    images: [
      {
        url: "/image.svg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <CatalogPageInner />
    </Suspense>
  );
}
