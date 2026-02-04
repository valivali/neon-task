import { useEffect } from "react"

export function useEscapeKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handler()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handler, enabled])
}
