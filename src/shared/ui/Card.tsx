import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'outline'
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
