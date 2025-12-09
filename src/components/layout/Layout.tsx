// D:\projects\fitapp-2025\src\components\layout\Layout.tsx

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Splash from "../features/Splash";
import AdvancedTranslate from "@/components/features/AdvancedTranslate";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [showSplash, setShowSplash] = useState(isHome);

  useEffect(() => {
    if (isHome) {
      const t = setTimeout(() => setShowSplash(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShowSplash(false);
    }
  }, [isHome]);

  if (showSplash) return <Splash />;

  return (
    <div className="app-layout min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Translation widget fixed but non-obstructive */}
      <AdvancedTranslate />

      {/* 
        === REVISI PENUH UNTUK LAYOUT YANG LEBIH RINGKAS ===
        
        1. Padding Vertikal (py):
           - Sebelumnya: pt-10 pb-28 (jarak terlalu besar, 40px & 112px).
           - Sekarang: py-6 sm:py-8 lg:py-10 (jarak responsif & proporsional).
           - Efek: Mengurangi tinggi total halaman secara drastis, mengurangi scroll.
        
        2. Wadah Konten (content-container):
           - Sebelumnya: <div className="content-container"> (tanpa gaya).
           - Sekarang: <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           - Efek: Konten menjadi terfokus di tengah, tidak terlalu lebar di layar besar, dan memiliki jarak yang nyaman dari tepi layar.
      */}
      <main className="main-content flex-1 py-6 sm:py-8 lg:py-10">
        <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;