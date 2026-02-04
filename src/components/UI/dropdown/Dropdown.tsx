import React, { ReactNode, useState, useRef, cloneElement, isValidElement, createContext, useContext, useCallback } from "react"
import { useClickOutside } from "@/hooks/useClickOutside"
import { useEscapeKey } from "@/hooks/useEscapeKey"
import styles from "./Dropdown.module.scss"

type DropdownContextValue = {
  onClose: () => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "end"
}

export const Dropdown = ({ trigger, children, isOpen: controlledOpen, onOpenChange, align = "end" }: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const wrapperRef = useRef<HTMLDivElement>(null)

  const setOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) setInternalOpen(open)
      onOpenChange?.(open)
    },
    [isControlled, onOpenChange]
  )

  const handleClose = useCallback(() => setOpen(false), [setOpen])

  useEscapeKey(handleClose, isOpen)
  useClickOutside(wrapperRef, handleClose, isOpen)

  const handleTriggerClick = useCallback(() => {
    setOpen(!isOpen)
  }, [isOpen, setOpen])

  type TriggerProps = { onClick?: () => void }
  const triggerWithClick = isValidElement(trigger)
    ? cloneElement(trigger as React.ReactElement<TriggerProps>, {
        onClick: handleTriggerClick
      })
    : trigger

  return (
    <DropdownContext.Provider value={{ onClose: () => setOpen(false) }}>
      <div ref={wrapperRef} className={styles.wrapper}>
        {triggerWithClick}
        {isOpen && <div className={`${styles.panel} ${align === "end" ? styles.panelEnd : styles.panelStart}`}>{children}</div>}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
}

export const DropdownItem = ({ children, onClick }: DropdownItemProps) => {
  const context = useContext(DropdownContext)

  const handleClick = () => {
    onClick?.()
    context?.onClose()
  }

  return (
    <div className={styles.item} onClick={handleClick}>
      {children}
    </div>
  )
}

Dropdown.Item = DropdownItem
