import { ButtonHTMLAttributes, ReactNode } from "react"
import styles from "./Button.module.scss"
import { match } from "ts-pattern"

type ButtonVariant = "primary" | "secondary" | "trinary"
type ButtonSize = "xs" | "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  iconOnly?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading
  const content = match({ isLoading, iconOnly })
    .with({ isLoading: true }, () => <span className={styles.spinner} />)
    .with({ isLoading: false, iconOnly: true }, () => (
      <>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </>
    ))
    .otherwise(() => (
      <>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span className={styles.label}>{children}</span>
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </>
    ))

  return (
    <button
      className={`${className} ${styles.button} ${styles[variant]} ${styles[size]} ${iconOnly ? styles.iconOnly : ""}`}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  )
}
