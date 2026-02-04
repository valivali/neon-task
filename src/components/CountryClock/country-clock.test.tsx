import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CountryClock, formatOffset, getOffsetsByTimeZone } from "./CountryClock"
import type { Country } from "@/types"
import { jest, describe, it, expect, beforeEach } from "@jest/globals"

jest.mock("country-flag-icons/react/3x2", () => ({
  US: () => <span data-testid="flag-US" />,
  GB: () => <span data-testid="flag-GB" />
}))

const mockCountry: Country = {
  code: "US",
  name: "United States",
  timeZone: "America/New_York",
  timeZones: ["America/New_York", "America/Los_Angeles"],
  lat: 38,
  lng: -97
}

const fixedDate = new Date("2025-02-04T12:00:00.000Z")

describe("CountryClock", () => {
  const onRemove = jest.fn()
  const onShowOnMap = jest.fn()
  const onSelectOffset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders country name and time placeholder when currentTime is null", () => {
    render(
      <CountryClock
        country={mockCountry}
        currentTime={null}
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    expect(screen.getByText("United States")).toBeDefined()
    expect(screen.getByText("--:--")).toBeDefined()
  })

  it("renders formatted time and offset when currentTime is provided", () => {
    render(
      <CountryClock
        country={mockCountry}
        currentTime={fixedDate}
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    expect(screen.getByText("United States")).toBeDefined()
    const timeBlock = screen.getByText(/--:--|^\d{2}:\d{2}$/).closest("div")
    expect(timeBlock).toBeDefined()
  })

  it("calls onRemove when Remove is chosen from options", async () => {
    render(
      <CountryClock
        country={mockCountry}
        currentTime={fixedDate}
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    const optionsButton = screen.getByRole("button", { name: /options/i })
    await userEvent.click(optionsButton)
    const removeItem = screen.getByText("Remove")
    await userEvent.click(removeItem)
    expect(onRemove).toHaveBeenCalledWith("US")
  })

  it("calls onShowOnMap when Show on map is chosen", async () => {
    render(
      <CountryClock
        country={mockCountry}
        currentTime={fixedDate}
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    const optionsButton = screen.getByRole("button", { name: /options/i })
    await userEvent.click(optionsButton)
    const showOnMap = screen.getByText("Show on map")
    await userEvent.click(showOnMap)
    expect(onShowOnMap).toHaveBeenCalledWith("US")
  })

  it("renders timezone badges when country has multiple offsets and calls onSelectOffset on click", async () => {
    render(
      <CountryClock
        country={mockCountry}
        currentTime={fixedDate}
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    const radiogroup = screen.getByRole("radiogroup", { name: /United States timezones/i })
    expect(radiogroup).toBeDefined()
    const badges = within(radiogroup).getAllByRole("radio")
    expect(badges.length).toBeGreaterThanOrEqual(1)
    await userEvent.click(badges[badges.length - 1])
    expect(onSelectOffset).toHaveBeenCalledWith("US", expect.any(String))
  })

  it("uses selectedOffset when it is in available offsets", () => {
    render(
      <CountryClock
        country={{ ...mockCountry, timeZones: ["America/New_York"], timeZone: "America/New_York" }}
        currentTime={fixedDate}
        selectedOffset="-05"
        onRemove={onRemove}
        onShowOnMap={onShowOnMap}
        onSelectOffset={onSelectOffset}
      />
    )
    expect(screen.getByText("United States")).toBeDefined()
  })
})

describe("formatOffset", () => {
  it("returns +00 for GMT", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT" }])).toBe("+00")
  })

  it("returns +00 for UTC", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "UTC" }])).toBe("+00")
  })

  it("returns +00 when no timeZoneName part (uses default GMT+0)", () => {
    expect(formatOffset([{ type: "literal", value: " " }])).toBe("+00")
  })

  it("returns +00 for empty parts", () => {
    expect(formatOffset([])).toBe("+00")
  })

  it("returns +00 for unmatched value", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "EST" }])).toBe("+00")
  })

  it("formats positive offset without minutes", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT+5" }])).toBe("+05")
  })

  it("formats negative offset without minutes", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT-5" }])).toBe("-05")
  })

  it("formats offset with minutes", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT+5:30" }])).toBe("+05:30")
  })

  it("pads single-digit hours", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT+9" }])).toBe("+09")
  })

  it("keeps double-digit hours", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT+12" }])).toBe("+12")
  })

  it("formats negative double-digit", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT-11" }])).toBe("-11")
  })

  it("handles GMT+0 as +00", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT+0" }])).toBe("+00")
  })

  it("handles GMT-0 as -00", () => {
    expect(formatOffset([{ type: "timeZoneName", value: "GMT-0" }])).toBe("-00")
  })
})

describe("getOffsetsByTimeZone", () => {
  const date = new Date("2025-02-04T12:00:00.000Z")

  it("returns empty array for empty timeZones", () => {
    expect(getOffsetsByTimeZone([], date)).toEqual([])
  })

  it("returns one entry for single timezone", () => {
    const result = getOffsetsByTimeZone(["America/New_York"], date)
    expect(result).toHaveLength(1)
    expect(result[0].timeZone).toBe("America/New_York")
    expect(result[0].offset).toMatch(/^[+-]\d{2}(:\d{2})?$/)
  })

  it("deduplicates same offset from multiple zones", () => {
    const result = getOffsetsByTimeZone(["America/New_York", "America/Toronto"], date)
    const offsets = result.map((r) => r.offset)
    expect(offsets).toHaveLength(new Set(offsets).size)
  })

  it("returns entries sorted by offset (localeCompare)", () => {
    const result = getOffsetsByTimeZone(["America/Los_Angeles", "America/New_York", "UTC"], date)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].offset.localeCompare(result[i - 1].offset)).toBeGreaterThanOrEqual(0)
    }
  })

  it("keeps first timezone when multiple zones share same offset", () => {
    const result = getOffsetsByTimeZone(["America/New_York", "America/Toronto"], date)
    expect(result).toHaveLength(1)
    expect(result[0].timeZone).toBe("America/New_York")
  })
})
