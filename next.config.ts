import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  outputFileTracingIncludes: {
    "/api/analyze": ["./src/scripts/**/*", "./node_modules/pdfjs-dist/standard_fonts/**/*"],
  },
};

export default nextConfig;
