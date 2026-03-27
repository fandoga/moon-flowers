import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Manrope, Source_Serif_4 } from "next/font/google";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import CartModal from "@/widgets/cart-modal/CartModal";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
});

const sourceSerif = Source_Serif_4({
  subsets: ["cyrillic", "latin"],
  variable: "--font-source-serif",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: {
    default: "Клевер — питомник растений и деревьев в Казани",
    template: "%s | Клевер — питомник растений Казань",
  },
  description:
    "Крупномеры, саженцы, посадочный материал из собственного питомника в Казани. Доставка, посадка, гарантия качества.",
  keywords: [
    "питомник растений Казань",
    "саженцы Казань",
    "крупномеры",
    "посадка деревьев",
    "купить деревья Казань",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://klever-plants.ru",
    siteName: "Питомник Клевер",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Питомник растений Клевер Казань",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Клевер — питомник растений и деревьев в Казани",
    description:
      "Собственный питомник крупномеров и саженцев в Казани. Доставка и посадка под ключ.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://klever-plants.ru",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "http-equiv": "Content-Security-Policy",
    content: "script-src 'self' ...",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`
          ${manrope.variable} ${sourceSerif.variable}
          font-manrope antialiased text-gray-800 bg-[#F8F9FB]
          flex flex-col min-h-screen
          overflow-x-hidden
        `}
      >
        <Providers>
          <Header />
          <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-[40px]">
            {children}
          </main>
          <Footer />
          <CartModal />
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
