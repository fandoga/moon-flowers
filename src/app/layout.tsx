import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import InitialLoader from "@/widgets/initial-loader.tsx/InitialLoader";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const sans = localFont({
  src: [
    {
      path: "../../public/fonts/bezier-sans-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moon-flowers.ru"),
  title: {
    default: "Moon Flowers - Доставка цветов в Москве",
    template: "%s | Moon Flowers - Доставка цветов в Москве",
  },
  description:
    "Доставка самых разных букетов на любой вкус. Moon Flowers - Москва.",
  keywords: [
    "купить букет",
    "букеты Москва",
    "заказать цветы",
    "заказать цветы Москва",
    "Купить цветы",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://moon-flowers.ru",
    siteName: "Moon Flowers",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Доставка буктов MoonFlowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Flowers - Доставка цветов в Москве",
    description:
      "Доставка самых разных букетов на любой вкус. Moon Flowers - Москва.",
    images: ["/logo.svg"],
  },
  alternates: {
    canonical: "https://moon-flowers.ru",
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
          ${inter.variable} ${sans.variable}
          font-inter antialiased bg-background
          flex flex-col min-h-screen
        `}
      >
        <Providers>
          <SpeedInsights />
          <InitialLoader>
            <Header />
            <main className="flex-1 w-full max-w-[1640px] mx-auto px-4 sm:px-[40px]">
              {children}
            </main>
            <Footer />
          </InitialLoader>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
