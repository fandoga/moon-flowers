import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import InitialLoader from "@/widgets/initial-loader.tsx/InitialLoader";

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
          ${inter.variable} ${sans.variable}
          font-inter antialiased bg-background
          flex flex-col min-h-screen
        `}
      >
        <Providers>
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
