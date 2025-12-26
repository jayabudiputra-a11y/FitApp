import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const Button = ({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}: ButtonProps) => {
  // Base style dengan fokus ring yang sedikit lebih transparan agar rapi di dark mode
  const base = 'px-8 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    // OPTIMASI: Emerald 600 -> 700 untuk kontras teks putih yang solid
    default: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/10',
    
    // OPTIMASI: Emerald 600 -> 700 untuk garis border dan teks
    outline: 'border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button