export function cn(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(' ')
}
