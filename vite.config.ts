import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    // Konfigurasi Sitemap
    Sitemap({
      hostname: "https://fit-app-eight.vercel.app", // Ganti dengan domain produksi Anda
      readable: true,
      changefreq: "daily",
      priority: 1.0,
      // Karena ini aplikasi React SPA, kita mendefinisikan rute statis utama
      dynamicRoutes: [
        "/",
        "/signin",
        "/articles",
        // Catatan: Untuk slug artikel dinamis dari database, 
        // bot akan menemukannya via internal linking dari halaman utama.
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    // 1. AKTIFKAN SOURCEMAP
    // Menghilangkan peringatan "Missing source maps" di Lighthouse
    sourcemap: true, 
    cssCodeSplit: true,
    cssMinify: true,
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Membagi library besar menjadi file terpisah (Code Splitting)
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('date-fns')) return 'vendor-date';
            return 'vendor-libs';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});