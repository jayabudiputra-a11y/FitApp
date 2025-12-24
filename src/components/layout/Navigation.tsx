import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { navItems } from '@/config/navItems'

const Navigation = () => {
  const { user } = useAuth()

  return (
    <nav className="flex items-center space-x-10">
      {navItems.map((item) => {
        if (item.to === '/profile' && !user) return null

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-lg font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-purple-600 bg-clip-text text-transparent scale-110'
                  : 'text-[#800000] hover:text-yellow-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default Navigation
