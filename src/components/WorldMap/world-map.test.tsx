import { render, waitFor, act } from "@testing-library/react"
import { WorldMap } from "./WorldMap"
import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import React from "react"

jest.mock("react-globe.gl", () => {
  const React = require("react")
  return {
    __esModule: true,
    default: React.forwardRef((_props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      React.useEffect(() => {
        if (typeof ref === "object" && ref && "current" in ref) {
          ;(ref as React.RefObject<unknown>).current = { pointOfView: jest.fn() }
        }
      }, [ref])
      return null
    })
  }
})

const originalFetch = global.fetch

describe("WorldMap", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockJson = () =>
      Promise.resolve({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "USA",
            properties: { ISO_A2: "US", NAME: "United States" },
            geometry: { type: "Polygon", coordinates: [] }
          }
        ]
      })
    global.fetch = jest.fn(() => Promise.resolve({ json: mockJson } as Response))
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    })) as unknown as typeof ResizeObserver
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("fetches geojson on mount", async () => {
    render(<WorldMap highlightedCountries={[]} onCountryClick={jest.fn()} />)
    expect(global.fetch).toHaveBeenCalledWith("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    await act(async () => {
      await Promise.resolve()
    })
  })

  it("renders globe container", async () => {
    const { container } = render(<WorldMap highlightedCountries={[]} onCountryClick={jest.fn()} />)
    await waitFor(() => {
      expect(container.querySelector("[class*='globeContainer']")).toBeDefined()
    })
  })

  it("accepts highlightedCountries and focusedCountry without crashing", async () => {
    const { container } = render(
      <WorldMap
        highlightedCountries={["US", "DE"]}
        focusedCountry={{
          code: "US",
          name: "United States",
          timeZone: "America/New_York",
          timeZones: ["America/New_York"],
          lat: 38,
          lng: -97
        }}
        onCountryClick={jest.fn()}
      />
    )
    await waitFor(() => {
      expect(container.querySelector("[class*='globeContainer']")).toBeDefined()
    })
  })
})
