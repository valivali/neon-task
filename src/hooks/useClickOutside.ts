import { RefObject, useEffect } from "react"

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T | null>, handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof Node && ref.current && !ref.current.contains(target)) {
        handler()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [ref, handler, enabled])
}
