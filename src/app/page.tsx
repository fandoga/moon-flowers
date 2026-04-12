// app/page.tsx
import Hero from "@/widgets/hero/Hero";
import Advantages from "@/widgets/advantages/Advantages";
import FormRequest from "@/widgets/form-request/FormRequest";
import Stats from "@/widgets/stats/Stats";
import Consult from "@/widgets/consult/Constult";
import type { Metadata } from "next";
import SearchResults from "@/widgets/search-results/SearchResults";
import PopularProducts from "@/widgets/popular-products/PopularProducts";

export const metadata: Metadata = {
  title: "Клевер — питомник растений и крупномеров в Казани",
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
    <main className="bg-[#F8F9FB]">
      <div className="overflow-x-hidden">
        <Hero />
      </div>

      <div className="overflow-x-hidden">
        <Advantages />
      </div>

      <div className="relative">
        <div className="absolute w-full h-full pointer-events-none inset-0 z-1">
          <svg
            className="hidden sm:block w-screen h-full opacity-8 ml-[calc(-50vw+50%)]"
            viewBox="0 0 1440 3659"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1439 55.6787C1439 55.6787 374.355 1491.18 -43.2022 2179.18C-297.148 2597.6 1661.53 1543.68 1316.98 1802.68C-9.01651 2799.45 476.369 3610.68 476.369 3610.68"
              stroke="#394426"
              strokeWidth="185"
              fill="none"
            />
          </svg>
          <svg
            className="block sm:hidden w-screen h-full opacity-11 ml-[calc(-50vw+50%)]"
            viewBox="0 0 402 3657"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M434.493 3.51172C434.493 3.51172 312.086 1736.51 21.8052 1956.01C-177.608 2106.8 1143.46 2725.01 292.101 2491.51C-402.549 2300.99 437.991 3629.51 437.991 3629.51"
              stroke="#394426"
              strokeWidth="100"
            />
          </svg>
        </div>

        <div className="overflow-x-hidden">
          <PopularProducts />
        </div>

        <div className="overflow-x-hidden">
          <Consult />
        </div>

        <Stats />
      </div>

      <div className="overflow-x-hidden">
        <FormRequest />
      </div>
    </main>
  );
}
