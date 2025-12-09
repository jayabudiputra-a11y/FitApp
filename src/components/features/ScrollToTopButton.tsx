// D:\projects\fitapp-2025\src\components\features/ScrollToTopButton.tsx

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react"; // Menggunakan ikon yang konsisten

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Tombol muncul setelah scroll 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Jika tidak visible, jangan render apa-apa
  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top" // Aksesibilitas
      className="
        fixed
        bottom-6
        right-6
        z-50 // <-- TAMBAHKAN INI untuk memastikan selalu di atas
        bg-emerald-600
        hover:bg-emerald-700
        text-white
        p-3
        rounded-full
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-300
        ease-in-out
        group
      "
    >
      {/* Menggunakan ikon SVG untuk tampilan yang lebih baik */}
      <ChevronUp 
        className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" 
      />
    </button>
  );
}