import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< Updated upstream
  /* config options here */
=======
  productionBrowserSourceMaps: true, // ソースマップを有効化
  images: {
    domains: ['ndlsearch.ndl.go.jp'], //国立国会図書館の書影検索APIを有効にする
  },
>>>>>>> Stashed changes
};

export default nextConfig;
