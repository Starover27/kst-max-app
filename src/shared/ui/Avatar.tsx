import type { ImgHTMLAttributes } from 'react'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number
}

export function Avatar({ size, className, ...props }: AvatarProps) {
  // default to CSS variable --size-avatar if not provided
  const defaultSize = typeof window !== 'undefined'
    ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--size-avatar')) || 64
    : 64

  const finalSize = size ?? defaultSize
  return <img className={className} width={finalSize} height={finalSize} {...props} />
}
