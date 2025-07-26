import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  compiler: {
    styledComponents: true
  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/index.html",
      }
    ]
}
};

export default nextConfig;
