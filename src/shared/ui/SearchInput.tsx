import type { InputHTMLAttributes } from 'react'
import { Input } from './Input'
import styles from './SearchInput.module.css'; // Импортируем модульные стили

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode // Иконка теперь опциональна, так как есть дефолт
}

export function SearchInput({ icon = '🔍', className, ...props }: SearchInputProps) {
  return (
    <div className={`${styles.searchInputContainer} ${className || ''}`.trim()}> {/* Добавляем обертку с классом */}
      <span className={styles.searchIcon}>{icon}</span> {/* Иконка */}
      <Input className={styles.searchInput} {...props} /> {/* Поле ввода */}
    </div>
  )
}