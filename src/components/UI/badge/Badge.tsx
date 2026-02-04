import { ButtonHTMLAttributes } from "react"
import styles from "./Badge.module.scss"

interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean
}

export const Badge = ({ isSelected = false, className = "", children, ...props }: BadgeProps) => {
  return (
    <button type="button" className={`${styles.badge} ${isSelected ? styles.selected : ""} ${className}`} {...props}>
      {children}
    </button>
  )
}
