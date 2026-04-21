// app/page.tsx
import Hero from "@/widgets/hero/Hero";
import PopularProducts from "@/widgets/popular-products/PopularProducts";
import Reviews from "@/widgets/reviews/Reviews";
import Stories from "@/widgets/stories/Stories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moon Flowers - цветы",
  description: "Самые разные букеты на любой вкус. Moon Flowers",
  openGraph: {
    title: "Moon Flowers - цветы",
    description: "Самые разные букеты на любой вкус. Moon Flowers",
    images: [
      {
        url: "/og-home.jpg",
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
        <PopularProducts />
      </div>
      <div id="reviews">
        <Reviews />
      </div>
    </main>
  );
}
