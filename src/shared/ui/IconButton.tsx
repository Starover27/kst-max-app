import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({ className, label, children, ...props }: IconButtonProps) {
  return (
    <button className={className} type="button" aria-label={label} {...props}>
      {children}
    </button>
  )
}
