import React, { ReactNode, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { useEscapeKey } from "@/hooks/useEscapeKey"
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
  useEscapeKey(onClose, isOpen)

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }, [onCancel, onClose])

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }, [onConfirm, onClose])

  if (!isOpen) return null

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
