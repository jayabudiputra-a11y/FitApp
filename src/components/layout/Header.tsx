import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '@/assets/masculine-logo.svg'
import MobileMenu from './MobileMenu'
import Navigation from './Navigation'
import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/common/ThemeToggle'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header
      className="
        relative overflow-hidden
        border-b-4 border-[#800000]
        bg-gradient-to-r from-yellow-300 to-yellow-400
      "
    >
      {/* Rainbow top bar */}
      <div className="absolute inset-x-0 top-0 h-1 flex">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-blue-500" />
        <div className="flex-1 bg-purple-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Fitapp Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-extrabold text-[#800000]">
                Fitapp
              </h1>
              <p className="text-xs text-[#800000]/70 tracking-wider">
                LGBTQ+ • Muscle Worship • Kings Only
              </p>
            </div>
          </Link>

          {/* RIGHT AREA */}
          <div className="flex items-center gap-6">
            {/* DESKTOP NAV */}
            <div className="hidden md:block">
              <Navigation />
            </div>

            {/* THEME TOGGLE (tetap boleh ada, tapi tidak ngaruh warna) */}
            <ThemeToggle />

            {/* MOBILE BUTTON */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-[#800000] text-2xl font-bold"
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && <MobileMenu onClose={closeMenu} />}
      </div>
    </header>
  )
}
