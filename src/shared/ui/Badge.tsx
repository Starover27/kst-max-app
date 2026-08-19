import type { HTMLAttributes } from 'react'

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}
