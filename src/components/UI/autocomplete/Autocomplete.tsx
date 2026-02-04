import React, { ReactNode, useState, useRef, useEffect, KeyboardEvent } from "react"
import { Input } from "@/components/UI/input/Input"
import styles from "./Autocomplete.module.scss"

export interface AutocompleteProps<T> {
  value: string
  onChange: (value: string) => void
  options: T[]
  onSelect: (option: T) => void
  getOptionKey: (option: T) => string
  renderOption: (option: T) => ReactNode
  placeholder?: string
  leftIcon?: ReactNode
  rightElement?: ReactNode
  inputRef?: React.RefObject<HTMLInputElement>
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

export function Autocomplete<T>({
  value,
  onChange,
  options,
  onSelect,
  getOptionKey,
  renderOption,
  placeholder,
  leftIcon,
  rightElement,
  inputRef: inputRefProp,
  onKeyDown
}: AutocompleteProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const hasOptions = options.length > 0

  useEffect(() => {
    if (hasOptions) setIsListOpen(true)
    else setIsListOpen(false)
  }, [hasOptions])

  useEffect(() => {
    if (!isListOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Node && wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsListOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isListOpen])

  const handleSelectOption = (option: T) => {
    onSelect(option)
    setIsListOpen(false)
  }

  const isOpen = hasOptions && isListOpen

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Input
        ref={inputRefProp}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        leftIcon={leftIcon}
        rightElement={rightElement}
      />
      {isOpen && (
        <div className={styles.list}>
          {options.map((option) => (
            <button key={getOptionKey(option)} type="button" className={styles.item} onClick={() => handleSelectOption(option)}>
              {renderOption(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
