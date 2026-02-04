import { KeyboardEvent, useState, useRef, useMemo } from "react"
import toast from "react-hot-toast"
import { Country } from "@/types"
import { searchCountries } from "@/data/countries"
import { useDebounce } from "@/hooks/useDebounce"
import { Autocomplete } from "@/components/UI/autocomplete/Autocomplete"
import { SearchIcon } from "@/components/icons/SearchIcon"
import { CloseIcon } from "@/components/icons/CloseIcon"
import styles from "./CountrySearch.module.scss"
import { Button } from "../UI/button/Button"

interface CountrySearchProps {
  onSelect: (country: Country) => void
  existingCodes: string[]
}

export const CountrySearch = ({ onSelect, existingCodes }: CountrySearchProps) => {
  const [inputValue, setInputValue] = useState("")
  const debouncedValue = useDebounce(inputValue, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCountries = useMemo(() => {
    if (debouncedValue.length < 1) return []
    return searchCountries(debouncedValue, existingCodes)
  }, [debouncedValue, existingCodes])

  const handleSelect = (country: Country) => {
    onSelect(country)
    setInputValue("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.length >= 3) {
      if (filteredCountries.length > 0) {
        handleSelect(filteredCountries[0])
      } else {
        toast.error("Couldn't find such country in our world")
      }
    }
  }

  const handleClear = () => {
    setInputValue("")
    inputRef.current?.focus()
  }

  return (
    <div className={styles.searchWrapper}>
      <Autocomplete<Country>
        value={inputValue}
        onChange={setInputValue}
        options={filteredCountries}
        onSelect={handleSelect}
        getOptionKey={(c) => c.code}
        renderOption={(c) => c.name}
        placeholder="Add New Country"
        leftIcon={<SearchIcon />}
        rightElement={
          inputValue ? (
            <Button variant="trinary" size="sm" className={styles.clearButton} onClick={handleClear} aria-label="Clear input">
              <CloseIcon />
            </Button>
          ) : undefined
        }
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
