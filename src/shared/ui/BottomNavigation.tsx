import type { HTMLAttributes } from 'react'
import { NavLink } from 'react-router-dom'

interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {
  items: Array<{ label: string; icon: string; to?: string }>
}

export function BottomNavigation({ items, className, ...props }: BottomNavigationProps) {
  return (
    <nav className={className} {...props}>
      {items.map((item) => (
        item.to ? (
          <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ) : (
          <button key={item.label} type="button">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      ))}
    </nav>
  )
}
