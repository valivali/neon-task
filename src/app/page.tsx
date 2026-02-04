"use client"

import { useState, useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { Country } from "@/types"
import { getCountryByCode, getRandomCountries } from "@/data/countries"
import { useInterval } from "@/hooks/useInterval"
import { useSessionStorage } from "@/hooks/useSessionStorage"
import { Title } from "@/components/UI/text/Text"
import { Modal } from "@/components/UI/modal/Modal"
import { CountryClock } from "@/components/CountryClock/CountryClock"
import { CountrySearch } from "@/components/CountrySearch/CountrySearch"
import { EmptyState } from "@/components/EmptyState/EmptyState"
import { GlobeIcon } from "@/components/icons/GlobeIcon"
import styles from "./page.module.scss"

export default function WorldClockPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [countryCodes, setCountryCodes] = useSessionStorage<string[]>("world-clock-countries", [])
  const [selectedOffsets, setSelectedOffsets] = useSessionStorage<Record<string, string>>("world-clock-timezone-offsets", {})
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const [countryToRemove, setCountryToRemove] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
  }, [])

  useEffect(() => {
    if (mounted && countryCodes.length === 0) {
      setCountryCodes(getRandomCountries(3).map((c) => c.code))
    }
  }, [mounted, setCountryCodes])

  useInterval(() => {
    setCurrentTime(new Date())
  }, 1000)

  const handleSelectCountry = useCallback(
    (country: Country) => {
      if (!countryCodes.includes(country.code)) {
        setCountryCodes([country.code, ...countryCodes])
      }
    },
    [countryCodes, setCountryCodes]
  )

  const handleRemoveClick = useCallback((code: string) => {
    setCountryToRemove(code)
    setRemoveModalOpen(true)
  }, [])

  const handleConfirmRemove = useCallback(() => {
    if (countryToRemove) {
      setCountryCodes(countryCodes.filter((code) => code !== countryToRemove))
      if (selectedOffsets[countryToRemove]) {
        const { [countryToRemove]: _, ...rest } = selectedOffsets
        setSelectedOffsets(rest)
      }
      setCountryToRemove(null)
      toast.success("Clock removed successfully")
    }
  }, [countryToRemove, countryCodes, selectedOffsets, setCountryCodes, setSelectedOffsets])

  const handleSelectOffset = useCallback(
    (code: string, offset: string) => {
      setSelectedOffsets({ ...selectedOffsets, [code]: offset })
    },
    [selectedOffsets, setSelectedOffsets]
  )

  const handleShowOnMap = useCallback((code: string) => {
    const country = getCountryByCode(code)
    if (country) {
      console.log(`Show ${country.name} on map`)
    }
  }, [])

  const countries = countryCodes.map((code) => getCountryByCode(code)).filter((country): country is Country => country !== undefined)

  if (!mounted) {
    return null
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <GlobeIcon className={styles.globeIcon} />
          <Title>World Clock App</Title>
        </div>

        <CountrySearch onSelect={handleSelectCountry} existingCodes={countryCodes} />

        {countries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.clockList}>
            {countries.map((country) => (
              <CountryClock
                key={country.code}
                country={country}
                currentTime={currentTime}
                selectedOffset={selectedOffsets[country.code]}
                onRemove={handleRemoveClick}
                onShowOnMap={handleShowOnMap}
                onSelectOffset={handleSelectOffset}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        title="Remove Clock"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemove}
      >
        Are you sure you want to remove this clock from your list?
      </Modal>
    </main>
  )
}
