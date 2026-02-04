import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useMemo, useState } from "react"
import { Autocomplete } from "./Autocomplete"
import { SearchIcon } from "@/components/icons/SearchIcon"

const AutocompleteDemo = () => {
  const [value, setValue] = useState("")
  const options = useMemo(() => ["Canada", "Japan", "Kenya", "Norway", "Brazil"], [])
  const filteredOptions = value ? options.filter((option) => option.toLowerCase().includes(value.toLowerCase())) : []

  return (
    <div style={{ height: "300px" }}>
      <Autocomplete
        value={value}
        onChange={setValue}
        options={filteredOptions}
        onSelect={(option) => setValue(option)}
        getOptionKey={(option) => option}
        renderOption={(option) => option}
        placeholder="Search countries"
        leftIcon={<SearchIcon />}
      />
    </div>
  )
}

const meta: Meta<typeof AutocompleteDemo> = {
  title: "UI/Autocomplete",
  component: AutocompleteDemo
}

export default meta
type Story = StoryObj<typeof AutocompleteDemo>

export const Default: Story = {}
