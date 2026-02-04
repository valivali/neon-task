import { useEffect, useState } from "react"
import { HourglassIcon } from "@/components/icons/HourglassIcon"
import { Text } from "@/components/UI/text/Text"
import styles from "./EmptyState.module.scss"

const timeQuotes = [
  "Time flies... especially when you have no clocks!",
  "No clocks? Guess it's always the right time for something!",
  "Time is an illusion. Lunchtime doubly so.",
  "Lost all your clocks? How timeless of you!",
  "A watched clock never boils... wait, that's not right.",
  "Time to add some time zones!"
]

export const EmptyState = () => {
  const [quote, setQuote] = useState(timeQuotes[0])

  useEffect(() => {
    const randomQuote = timeQuotes[Math.floor(Math.random() * timeQuotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <div className={styles.emptyState}>
      <HourglassIcon className={styles.icon} />
      <Text className={styles.quote}>{quote}</Text>
    </div>
  )
}
