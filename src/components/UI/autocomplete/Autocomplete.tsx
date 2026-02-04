import React, { ReactNode, ReactElement, useState, useRef, useEffect, KeyboardEvent, useCallback } from "react"
import { useClickOutside } from "@/hooks/useClickOutside"
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
}: AutocompleteProps<T>): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const hasOptions = options.length > 0

  useEffect(() => {
    if (hasOptions) setIsListOpen(true)
    else setIsListOpen(false)
  }, [hasOptions])

  const handleClose = useCallback(() => setIsListOpen(false), [])

  useClickOutside(wrapperRef, handleClose, isListOpen)

  const handleSelectOption = useCallback(
    (option: T) => {
      onSelect(option)
      setIsListOpen(false)
    },
    [onSelect]
  )

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
