import type { HTMLAttributes } from 'react'

export function Section({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={className} {...props}>
      {children}
    </section>
  )
}
