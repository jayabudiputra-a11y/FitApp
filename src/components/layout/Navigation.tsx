import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth' 
import { navItems } from '@/config/navItems'

const Navigation = () => {
  const { user } = useAuth()
  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => {
        if (item.to === '/profile' && !user) {
          return null
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `font-medium transition-colors ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-gray-700 hover:text-emerald-600'
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