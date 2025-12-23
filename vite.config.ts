import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const SUPABASE_URL = env.VITE_SUPABASE_URL || "";

  return {
    plugins: [
      react(),

      VitePWA({
        filename: "sw.js",
        manifestFilename: "manifest.webmanifest",

        manifest: {
          name: "Fitapp",
          short_name: "Fitapp",
          description: "LGBTQ+ Fitness Inspiration & Muscle Worship Blog",
          theme_color: "#10b981",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: "/",
          icons: [
            {
              src: "/masculine-logo.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "any maskable"
            }
          ]
        },

        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "/index.html",

          runtimeCaching: [
            {
              urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7
                }
              }
            },
            {
              urlPattern: ({ url }) =>
                url.href.startsWith(SUPABASE_URL) &&
                !url.pathname.includes("/auth/") &&
                !url.pathname.includes("/storage/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "supabase-api",
                networkTimeoutSeconds: 10
              }
            }
          ]
        }
      })
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },

    build: {
      outDir: "dist",
      sourcemap: true
    }
  };
});
