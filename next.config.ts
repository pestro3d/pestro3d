import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        has: [{ type: "host", value: "pestro3d.vercel.app" }],
        destination: "https://admin.pestro3d.vercel.app",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        has: [{ type: "host", value: "pestro3d.vercel.app" }],
        destination: "https://admin.pestro3d.vercel.app/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "admin.pestro3d.vercel.app" }],
          destination: "/admin",
        },
      ],
    };
  },
};

export default nextConfig;
