import { NavLink } from 'react-router-dom'
import { navItems } from '@/config/navItems' // Import dari config

const Navigation = () => {
  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => (
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
      ))}
    </nav>
  )
}

export default Navigation