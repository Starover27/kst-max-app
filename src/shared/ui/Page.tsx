import { useEffect, useState } from 'react'

interface PageProps {
  children: React.ReactNode
  className?: string
}

export function Page({ children, className = '' }: PageProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div className={`page-fade-enter ${entered ? 'page-fade-enter-active' : ''} ${className}`}>{children}</div>
  )
}

export default Page
