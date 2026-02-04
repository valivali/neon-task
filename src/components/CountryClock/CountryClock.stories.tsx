import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CountryClock } from "./CountryClock"
import { Country } from "@/types"

const sampleCountry: Country = {
  code: "US",
  name: "United States",
  timeZone: "America/New_York",
  timeZones: ["America/New_York", "America/Los_Angeles"],
  lat: 40.7128,
  lng: -74.006
}

const meta: Meta<typeof CountryClock> = {
  title: "Components/CountryClock",
  component: CountryClock,
  args: {
    country: sampleCountry,
    currentTime: new Date(),
    onRemove: () => {},
    onShowOnMap: () => {},
    onSelectOffset: () => {}
  }
}

export default meta
type Story = StoryObj<typeof CountryClock>

export const Default: Story = {}
