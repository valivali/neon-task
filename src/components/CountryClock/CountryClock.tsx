import React, { memo, useMemo, useState, useCallback, useEffect, useRef } from "react"
import * as flags from "country-flag-icons/react/3x2"
import { Country } from "@/types"
import { Card } from "@/components/UI/card/Card"
import { Dropdown } from "@/components/UI/dropdown/Dropdown"
import { Badge } from "@/components/UI/badge/Badge"
import { OptionsIcon } from "@/components/icons/OptionsIcon"
import { PinIcon } from "@/components/icons/PinIcon"
import { TrashIcon } from "@/components/icons/TrashIcon"
import { PencilIcon } from "@/components/icons/PencilIcon"
import { useLongPress } from "@/hooks/useLongPress"
import styles from "./CountryClock.module.scss"
import { Button } from "../UI/button/Button"
import { Subtitle, Text } from "../UI/text/Text"
import { cn } from "@/utils/classNames"

interface CountryClockProps {
  country: Country
  currentTime: Date | null
  selectedOffset?: string
  customName?: string
  onRemove: (code: string) => void
  onShowOnMap: (code: string) => void
  onSelectOffset: (code: string, offset: string) => void
  onNameChange: (code: string, name: string) => void
}

const CountryClockComponent = ({
  country,
  currentTime,
  selectedOffset,
  customName,
  onRemove,
  onShowOnMap,
  onSelectOffset,
  onNameChange
}: CountryClockProps) => {
  const FlagComponent = isFlagKey(country.code) ? flags[country.code] : undefined
  const [isEditing, setIsEditing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [editValue, setEditValue] = useState(customName ?? country.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const displayName = customName ?? country.name
  const isSingleWord = !displayName.trim().includes(" ")
  const shouldShowCode = customName && customName.trim() && customName.trim() !== country.name

  useEffect(() => {
    if (!isEditing) {
      setEditValue(displayName)
    }
  }, [displayName, isEditing])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditValue(displayName)
    setIsEditing(false)
  }, [displayName])

  const handleApplyEdit = useCallback(() => {
    const nextValue = editValue.trim()
    onNameChange(country.code, nextValue)
    setIsEditing(false)
  }, [country.code, editValue, onNameChange])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleApplyEdit()
      }
      if (event.key === "Escape") {
        event.preventDefault()
        handleCancelEdit()
      }
    },
    [handleApplyEdit, handleCancelEdit]
  )

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const nextTarget = event.relatedTarget as Node | null
      if (actionsRef.current && nextTarget && actionsRef.current.contains(nextTarget)) {
        return
      }
      handleCancelEdit()
    },
    [handleCancelEdit]
  )

  const longPressHandlers = useLongPress(() => {
    if (!isEditing) {
      setIsEditing(true)
    }
  })

  const timeZones = useMemo(
    () => (country.timeZones.length ? country.timeZones : [country.timeZone]),
    [country.timeZones, country.timeZone]
  )

  const offsets = useMemo(() => (currentTime ? getOffsetsByTimeZone(timeZones, currentTime) : []), [timeZones, currentTime])

  const availableOffsets = useMemo(() => offsets.map((entry) => entry.offset), [offsets])

  const activeOffset = useMemo(
    () => (selectedOffset && availableOffsets.includes(selectedOffset) ? selectedOffset : availableOffsets[0]),
    [selectedOffset, availableOffsets]
  )

  const activeTimeZone = useMemo(
    () => offsets.find((entry) => entry.offset === activeOffset)?.timeZone ?? country.timeZone,
    [offsets, activeOffset, country.timeZone]
  )

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: activeTimeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
    [activeTimeZone]
  )

  const offsetFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: activeTimeZone,
        timeZoneName: "shortOffset"
      }),
    [activeTimeZone]
  )

  const timeString = useMemo(() => (currentTime ? timeFormatter.format(currentTime) : "--:--"), [currentTime, timeFormatter])

  const offsetString = useMemo(
    () => (currentTime ? formatOffset(offsetFormatter.formatToParts(currentTime)) : ""),
    [currentTime, offsetFormatter]
  )

  return (
    <Card className={styles.clockCard}>
      <div className={styles.clockContent}>
        <div className={styles.leftSection}>
          <div className={styles.flagWrapper}>{FlagComponent && <FlagComponent className={styles.flag} />}</div>
          <div
            className={styles.nameWrapper}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            {...longPressHandlers}
          >
            {isEditing ? (
              <div className={styles.nameInputWrapper}>
                <input
                  ref={inputRef}
                  className={styles.nameInput}
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleInputBlur}
                  aria-label="Edit country name"
                />
                <div className={styles.editActions} ref={actionsRef}>
                  <Button size="xs" variant="primary" onClick={handleApplyEdit}>
                    Save
                  </Button>
                  <Button size="xs" variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Subtitle variant="span" className={styles.countryName} size="lg">
                  <span className={cn(styles.countryNameText, isSingleWord && styles.singleWord)}>{displayName}</span>
                  {shouldShowCode && <span className={styles.countryCode}> ({country.code})</span>}
                </Subtitle>
                {isHovering && (
                  <button type="button" className={styles.editIcon} onClick={handleStartEdit} aria-label="Edit name">
                    <PencilIcon />
                  </button>
                )}
              </>
            )}
          </div>
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

export const getOffsetsByTimeZone = (timeZones: string[], date: Date) => {
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

export const formatOffset = (parts: Intl.DateTimeFormatPart[]) => {
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
