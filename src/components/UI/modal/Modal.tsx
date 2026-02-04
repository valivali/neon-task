import React, { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { CloseIcon } from "@/components/icons/CloseIcon"
import styles from "./Modal.module.scss"
import { Button } from "../button/Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <Button size="sm" variant="secondary" className={styles.cancelButton} onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button size="sm" variant="primary" className={styles.confirmButton} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
