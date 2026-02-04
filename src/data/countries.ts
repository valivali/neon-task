import * as flags from "country-flag-icons/react/3x2"
import { getAllCountries } from "countries-and-timezones"
import { Country } from "@/types"

const isFlagKey = (key: string): key is keyof typeof flags => key in flags

const getFallbackTimeZone = (timeZones: string[]) => {
  return timeZones.length > 0 ? timeZones[0] : "UTC"
}

export const COUNTRIES: Country[] = Object.values(getAllCountries())
  .map((country) => {
    const code = country.id.toUpperCase()
    return {
      code,
      name: country.name,
      timeZone: getFallbackTimeZone(country.timezones),
      timeZones: country.timezones
    }
  })
  .filter((country) => isFlagKey(country.code))
  .sort((a, b) => a.name.localeCompare(b.name))

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase())
}

export const searchCountries = (query: string, excludeCodes: string[] = []): Country[] => {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  return COUNTRIES.filter((country) => !excludeCodes.includes(country.code) && country.name.toLowerCase().includes(lowerQuery)).slice(0, 10)
}

export const getRandomCountries = (count: number, excludeCodes: string[] = []): Country[] => {
  const available = COUNTRIES.filter((c) => !excludeCodes.includes(c.code))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
