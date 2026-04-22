import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import InitialLoader from "@/widgets/initial-loader.tsx/InitialLoader";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const sans = localFont({
  src: [
    {
      path: "../../public/fonts/BezierSans_Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Moon Flowers - цветы",
    template: "%s | Moon Flowers - цветы",
  },
  description: "Самые разные букеты на любой вкус. Moon Flowers.",
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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Магазин букетов MoonFlowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Flowers - цветы.",
    description: "Самые разные букеты на любой вкус. Moon Flowers.",
    images: ["/og-image.jpg"],
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
          ${inter.variable} ${sans.variable}
          font-inter antialiased bg-background
          flex flex-col min-h-screen
        `}
      >
        <Providers>
          <SpeedInsights/>
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
