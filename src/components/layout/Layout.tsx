import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Splash from "../features/Splash";
import AdvancedTranslate from "@/components/features/AdvancedTranslate";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  // State untuk mengontrol tampilan Splash Screen
  const [showSplash, setShowSplash] = useState(isHome);

  useEffect(() => {
    if (isHome) {
      // Splash screen muncul selama 4 detik di halaman Home
      const t = setTimeout(() => setShowSplash(false), 4000);
      return () => clearTimeout(t);
    } else {
      // Jika user menavigasi ke halaman selain home, splash langsung hilang
      setShowSplash(false);
    }
  }, [isHome]);

  // Efek Scroll to Top otomatis setiap kali route berubah (setelah splash hilang)
  useEffect(() => {
    if (!showSplash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, showSplash]);

  if (showSplash) return <Splash />;

  return (
    /* bg-white dark:bg-black: Dasar mode terang/gelap.
       transition-colors duration-300: Animasi halus saat switch theme.
       min-h-screen flex flex-col: Memastikan footer tetap di bawah jika konten sedikit.
    */
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      
      {/* Header dengan navigasi dan ThemeToggle */}
      <Header />

      {/* Komponen Widget Terjemahan */}
      <AdvancedTranslate />

      {/* Main Content Area */}
      <main className="flex-1 focus:outline-none" id="main-content">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Layout;