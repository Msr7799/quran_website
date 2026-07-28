import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero URLs include a file-based version query to invalidate stale images.
    // Omitting `search` allows that changing query only inside this directory.
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
      {
        pathname: "/images/heroes/**",
      },
    ],
  },
};

export default nextConfig;
