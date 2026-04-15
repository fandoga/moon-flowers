// app/page.tsx
import Hero from "@/widgets/hero/Hero";
import PopularProducts from "@/widgets/popular-products/PopularProducts";
import Stories from "@/widgets/stories/Stories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moon Flowers - цветы",
  description:
    "Собственный питомник саженцев, крупномеров, хвойных и лиственных растений в Казани. Доставка, посадка, гарантия приживаемости.",
  openGraph: {
    title: "Питомник растений Клевер Казань — крупномеры и саженцы",
    description:
      "Более 5000 сортов акклиматизированных растений. Доставка по Татарстану и посадка под ключ.",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Клевер — питомник растений Казань",
    images: ["/og-home.jpg"],
  },
};

export default function Home() {
  return (
    <main>
      <div className="overflow-x-hidden">
        <Hero />
      </div>

      <div className="overflow-x-hidden">
        <Stories />
      </div>
      <div className="overflow-x-hidden">
        <PopularProducts />
      </div>
    </main>
  );
}
