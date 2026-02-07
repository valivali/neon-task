import { InputHTMLAttributes } from "react"
import { cn } from "@/utils/classNames"
import styles from "./Toggle.module.scss"

type ToggleSize = "sm" | "md"

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: ToggleSize
}

export const Toggle = ({ checked, onChange, label, size = "md", className, disabled, ...props }: ToggleProps) => {
  return (
    <label className={cn(styles.toggle, styles[size], disabled && styles.disabled, className)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        {...props}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
