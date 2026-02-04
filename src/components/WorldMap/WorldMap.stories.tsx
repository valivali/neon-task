import type { Meta, StoryObj } from "@storybook/react"
import { WorldMap } from "./WorldMap"
import { Country } from "@/types"

const focusedCountry: Country = {
  code: "JP",
  name: "Japan",
  timeZone: "Asia/Tokyo",
  timeZones: ["Asia/Tokyo"],
  lat: 35.6762,
  lng: 139.6503
}

const meta: Meta<typeof WorldMap> = {
  title: "Components/WorldMap",
  component: WorldMap,
  args: {
    highlightedCountries: ["JP", "US", "BR"],
    focusedCountry,
    onCountryClick: () => {}
  },
  decorators: [
    (Story) => (
      <div style={{ height: 520 }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof WorldMap>

export const Default: Story = {}
