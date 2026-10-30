export function Button({children, style, onClick}: {children: React.ReactNode; style?: string, onClick?: () => void}) {
  return <button onClick={onClick} className={`pointer-events-auto ${style}`}>{children}</button>
}