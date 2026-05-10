import { Suspense } from "react";
import Hero from "@/widgets/hero/Hero";
import PopularProducts from "@/widgets/popular-products/PopularProducts";
import Reviews from "@/widgets/reviews/Reviews";
import Stories from "@/widgets/stories/Stories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moon Flowers - Доставка цветов в Москве",
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

export default function Home() {
  return (
    <main>
      <div className="overflow-x-hidden">
        <Hero />
      </div>
      <div id="stories">
        <Stories />
      </div>
      <div id="recommendations">
        <Suspense fallback={null}>
          <PopularProducts />
        </Suspense>
      </div>
      <div id="reviews">
        <Reviews />
      </div>
    </main>
  );
}
