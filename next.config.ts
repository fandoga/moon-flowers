import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "interesnoitochka.ru",
        port: "",
        pathname: "/api/v1/**",
      },
    ],
    qualities: [25, 50, 75, 80, 85, 90],
  },
};

export default nextConfig;
