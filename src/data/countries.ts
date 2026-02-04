import * as flags from "country-flag-icons/react/3x2"
import { getAllCountries } from "countries-and-timezones"
import { Country } from "@/types"
import { COUNTRY_COORDINATES } from "./countryCoordinates"

const isFlagKey = (key: string): key is keyof typeof flags => key in flags

const getFallbackTimeZone = (timeZones: string[]) => {
  return timeZones.length > 0 ? timeZones[0] : "UTC"
}

export const COUNTRIES: Country[] = Object.values(getAllCountries())
  .map((country) => {
    const code = country.id.toUpperCase()
    const coords = COUNTRY_COORDINATES[code] || { lat: 0, lng: 0 }
    return {
      code,
      name: country.name,
      timeZone: getFallbackTimeZone(country.timezones),
      timeZones: country.timezones,
      lat: coords.lat,
      lng: coords.lng
    }
  })
  .filter((country) => isFlagKey(country.code))
  .sort((a, b) => a.name.localeCompare(b.name))

const COUNTRIES_MAP = new Map<string, Country>(COUNTRIES.map((c) => [c.code.toLowerCase(), c]))

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES_MAP.get(code.toLowerCase())
}

export const searchCountries = (query: string, excludeCodes: string[] = []): Country[] => {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  const excludeSet = new Set(excludeCodes)
  const results: Country[] = []

  for (const country of COUNTRIES) {
    if (results.length >= 10) break
    if (!excludeSet.has(country.code) && country.name.toLowerCase().includes(lowerQuery)) {
      results.push(country)
    }
  }

  return results
}

export const getRandomCountries = (count: number, excludeCodes: string[] = []): Country[] => {
  const available = COUNTRIES.filter((c) => !excludeCodes.includes(c.code))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
