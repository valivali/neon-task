import { useCallback, useEffect, useRef } from "react"

type LongPressOptions = {
  delay?: number
  moveThreshold?: number
}

type LongPressHandlers = {
  onTouchStart: (event: React.TouchEvent) => void
  onTouchMove: (event: React.TouchEvent) => void
  onTouchEnd: () => void
  onTouchCancel: () => void
  onContextMenu: (event: React.MouseEvent) => void
}

export const useLongPress = (onLongPress: () => void, options: LongPressOptions = {}): LongPressHandlers => {
  const { delay = 500, moveThreshold = 10 } = options
  const timerRef = useRef<number | null>(null)
  const startPositionRef = useRef<{ x: number; y: number } | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const touch = event.touches[0]
      startPositionRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null
      clearTimer()
      timerRef.current = window.setTimeout(() => {
        onLongPress()
        timerRef.current = null
      }, delay)
    },
    [clearTimer, delay, onLongPress]
  )

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!startPositionRef.current || !event.touches[0]) return
      const { x, y } = startPositionRef.current
      const deltaX = Math.abs(event.touches[0].clientX - x)
      const deltaY = Math.abs(event.touches[0].clientY - y)
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clearTimer()
      }
    },
    [clearTimer, moveThreshold]
  )

  const handleTouchEnd = useCallback(() => {
    clearTimer()
    startPositionRef.current = null
  }, [clearTimer])

  const handleTouchCancel = useCallback(() => {
    clearTimer()
    startPositionRef.current = null
  }, [clearTimer])

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
  }, [])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    onContextMenu: handleContextMenu
  }
}
