import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { navItems } from '@/config/navItems' // Import dari config

const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fitapp</h2>

        <button
          onClick={onClose}
          className="p-2"
          aria-label="Tutup menu mobile"
          type="button"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center space-y-8 text-2xl font-medium">
        {/* Loop langsung dari navItems */}
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="hover:text-emerald-600 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MobileMenu