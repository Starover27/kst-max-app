import type { HTMLAttributes } from 'react'
import styles from './Chip.module.css'; // Импортируем модульные стили

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  isActive?: boolean; // Добавляем проп для активного состояния
}

export function Chip({ className, children, isActive, ...props }: ChipProps) {
  return (
    <span
      className={`${styles.chip} ${isActive ? styles.active : ''} ${className || ''}`.trim()} // Применяем стили
      {...props}
    >
      {children}
    </span>
  )
}