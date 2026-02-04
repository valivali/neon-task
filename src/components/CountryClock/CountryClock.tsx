import { memo } from "react"
import * as flags from "country-flag-icons/react/3x2"
import { Country } from "@/types"
import { Card } from "@/components/UI/card/Card"
import { Dropdown } from "@/components/UI/dropdown/Dropdown"
import { Badge } from "@/components/UI/badge/Badge"
import { OptionsIcon } from "@/components/icons/OptionsIcon"
import { PinIcon } from "@/components/icons/PinIcon"
import { TrashIcon } from "@/components/icons/TrashIcon"
import styles from "./CountryClock.module.scss"
import { Button } from "../UI/Button/Button"
import { Subtitle, Text, Title } from "../UI/text/Text"

interface CountryClockProps {
  country: Country
  currentTime: Date | null
  selectedOffset?: string
  onRemove: (code: string) => void
  onShowOnMap: (code: string) => void
  onSelectOffset: (code: string, offset: string) => void
}

const CountryClockComponent = ({ country, currentTime, selectedOffset, onRemove, onShowOnMap, onSelectOffset }: CountryClockProps) => {
  const FlagComponent = isFlagKey(country.code) ? flags[country.code] : undefined
  const timeZones = country.timeZones.length ? country.timeZones : [country.timeZone]
  const offsets = currentTime ? getOffsetsByTimeZone(timeZones, currentTime) : []
  const availableOffsets = offsets.map((entry) => entry.offset)
  const activeOffset = selectedOffset && availableOffsets.includes(selectedOffset) ? selectedOffset : availableOffsets[0]
  const activeTimeZone = offsets.find((entry) => entry.offset === activeOffset)?.timeZone ?? country.timeZone

  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: activeTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })

  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: activeTimeZone,
    timeZoneName: "shortOffset"
  })

  const timeString = currentTime ? timeFormatter.format(currentTime) : "--:--"
  const offsetString = currentTime ? formatOffset(offsetFormatter.formatToParts(currentTime)) : ""

  return (
    <Card className={styles.clockCard}>
      <div className={styles.clockContent}>
        <div className={styles.leftSection}>
          <div className={styles.flagWrapper}>{FlagComponent && <FlagComponent className={styles.flag} />}</div>
          <Subtitle variant="span" className={styles.countryName} size="lg">
            {country.name}
          </Subtitle>
        </div>

        <div className={styles.timeBlock}>
          <div className={styles.timeInfo}>
            <span className={styles.time}>{timeString}</span>
            <span className={styles.offset}>{offsetString}</span>
          </div>
        </div>

        <div className={styles.optionsWrapper}>
          <Dropdown
            align="end"
            trigger={
              <Button
                variant="trinary"
                iconOnly
                leftIcon={<OptionsIcon />}
                size="xs"
                className={styles.optionsButton}
                aria-label="Options"
              />
            }
          >
            <Dropdown.Item onClick={() => onShowOnMap(country.code)}>
              <div className={styles.dropdownItem}>
                <PinIcon />
                <Text size="sm">Show on map</Text>
              </div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onRemove(country.code)}>
              <div className={styles.dropdownItem}>
                <TrashIcon />
                <Text size="sm">Remove</Text>
              </div>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      {availableOffsets.length > 1 && (
        <div className={styles.timeZones} role="radiogroup" aria-label={`${country.name} timezones`}>
          {availableOffsets.map((offset) => (
            <Badge
              key={offset}
              isSelected={offset === activeOffset}
              role="radio"
              aria-checked={offset === activeOffset}
              onClick={() => onSelectOffset(country.code, offset)}
            >
              {offset}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}

const isFlagKey = (key: string): key is keyof typeof flags => key in flags

const getOffsetsByTimeZone = (timeZones: string[], date: Date) => {
  const seen = new Set<string>()
  const offsetEntries: { offset: string; timeZone: string }[] = []

  timeZones.forEach((timeZone) => {
    const offsetFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset"
    })
    const offset = formatOffset(offsetFormatter.formatToParts(date))
    if (!seen.has(offset)) {
      seen.add(offset)
      offsetEntries.push({ offset, timeZone })
    }
  })

  return offsetEntries.sort((a, b) => a.offset.localeCompare(b.offset))
}

const formatOffset = (parts: Intl.DateTimeFormatPart[]) => {
  const offsetPart = parts.find((part) => part.type === "timeZoneName")
  const value = offsetPart?.value ?? "GMT+0"
  if (value === "GMT" || value === "UTC") return "+00"

  const match = value.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/)
  if (!match) return "+00"

  const hoursValue = Math.abs(Number(match[1]))
  const sign = match[1].startsWith("-") ? "-" : "+"
  const hours = String(hoursValue).padStart(2, "0")
  const minutes = match[2]

  return minutes ? `${sign}${hours}:${minutes}` : `${sign}${hours}`
}

export const CountryClock = memo(CountryClockComponent)
