import { ReactNode, InputHTMLAttributes, forwardRef } from "react"
import styles from "./Input.module.scss"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ leftIcon, rightElement, className = "", ...props }, ref) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
      <input ref={ref} className={styles.input} {...props} />
      {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
    </div>
  )
})

Input.displayName = "Input"
