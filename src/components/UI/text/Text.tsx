import { ReactNode, ReactElement } from "react"
import { cn } from "@/utils/classNames"
import styles from "./Text.module.scss"

type TextSize = "sm" | "md" | "lg"
type TextVariant = "span" | "p" | "div" | "caption"
type SubtitleVariant = "div" | "span" | "p"
type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6

interface BaseTextProps {
  children: ReactNode
  className?: string
  size?: TextSize
}

interface TextProps extends BaseTextProps {
  variant?: TextVariant
}

interface TitleProps extends BaseTextProps {
  level?: TitleLevel
}

interface SubtitleProps extends BaseTextProps {
  variant?: SubtitleVariant
}

const titleTags: Record<TitleLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
}

const getTextTag = (variant: TextVariant) => {
  if (variant === "caption") return "span"
  return variant
}

export const Text = ({ children, className, size, variant = "span" }: TextProps): ReactElement => {
  const Tag = getTextTag(variant)
  const sizeClass = size ? `text--${size}` : undefined
  const classes = cn(styles.text, sizeClass, className)

  return <Tag className={classes}>{children}</Tag>
}

export const Title = ({ children, className, size, level = 1 }: TitleProps): ReactElement => {
  const Tag = titleTags[level]
  const sizeClass = size ? `title--${size}` : undefined
  const classes = cn(styles.title, sizeClass, className)

  return <Tag className={classes}>{children}</Tag>
}

export const Subtitle = ({ children, className, size, variant = "div" }: SubtitleProps): ReactElement => {
  const Tag = variant
  const sizeClass = size ? `subtitle--${size}` : undefined
  const classes = cn(styles.subtitle, sizeClass, className)

  return <Tag className={classes}>{children}</Tag>
}
