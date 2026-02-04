"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
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

const WorldMap = dynamic(() => import("@/components/WorldMap/WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading globe...</div>
})

export default function WorldClockPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [countryCodes, setCountryCodes] = useSessionStorage<string[]>("world-clock-countries", [])
  const [selectedOffsets, setSelectedOffsets] = useSessionStorage<Record<string, string>>("world-clock-timezone-offsets", {})
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const [countryToRemove, setCountryToRemove] = useState<string | null>(null)
  const [focusedCountry, setFocusedCountry] = useState<Country | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [countryToAdd, setCountryToAdd] = useState<Country | null>(null)

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
      setFocusedCountry(country)
    }
  }, [])

  const handleCountryClick = useCallback(
    (code: string) => {
      const country = getCountryByCode(code)
      if (!country) return

      if (countryCodes.includes(country.code)) {
        setFocusedCountry(country)
      } else {
        setCountryToAdd(country)
        setAddModalOpen(true)
      }
    },
    [countryCodes]
  )

  const handleConfirmAdd = useCallback(() => {
    if (countryToAdd) {
      setCountryCodes([countryToAdd.code, ...countryCodes])
      setFocusedCountry(countryToAdd)
      setCountryToAdd(null)
      toast.success(`Added ${countryToAdd.name}`)
    }
  }, [countryToAdd, countryCodes, setCountryCodes])

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

        <div className={styles.content}>
          <div className={styles.clockSection}>
            {countries.length === 0 ? (
              <EmptyState />
            ) : (
              <div className={styles.clockList}>
                {countries.map((country: Country) => (
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

          <div className={styles.mapSection}>
            <WorldMap highlightedCountries={countryCodes} focusedCountry={focusedCountry} onCountryClick={handleCountryClick} />
          </div>
        </div>
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

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Clock"
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={handleConfirmAdd}
      >
        {countryToAdd && `Add a clock for ${countryToAdd.name}?`}
      </Modal>
    </main>
  )
}
