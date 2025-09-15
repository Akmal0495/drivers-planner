import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🔥 отключает ESLint при билде
  },
};

export default nextConfig;