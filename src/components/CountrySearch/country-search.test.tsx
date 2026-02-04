import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CountrySearch } from "./CountrySearch"
import type { Country } from "@/types"
import { jest, describe, it, expect, beforeEach } from "@jest/globals"

const mockSearchCountries = jest.fn()
jest.mock("@/data/countries", () => ({
  searchCountries: (query: string, excludeCodes: string[]) => mockSearchCountries(query, excludeCodes)
}))

jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value
}))

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: jest.fn() }
}))

const mockCountry: Country = {
  code: "DE",
  name: "Germany",
  timeZone: "Europe/Berlin",
  timeZones: ["Europe/Berlin"],
  lat: 51,
  lng: 10
}

describe("CountrySearch", () => {
  const onSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchCountries.mockReturnValue([])
  })

  it("renders search input with placeholder", () => {
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    expect(screen.getByPlaceholderText("Add New Country")).toBeDefined()
  })

  it("filters and shows options when typing", async () => {
    mockSearchCountries.mockReturnValue([mockCountry])
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    const input = screen.getByPlaceholderText("Add New Country")
    await userEvent.type(input, "Germ")
    expect(mockSearchCountries).toHaveBeenCalledWith("Germ", [])
    expect(screen.getByText("Germany")).toBeDefined()
  })

  it("excludes existing codes from search", async () => {
    mockSearchCountries.mockReturnValue([])
    render(<CountrySearch onSelect={onSelect} existingCodes={["DE"]} />)
    await userEvent.type(screen.getByPlaceholderText("Add New Country"), "Germ")
    expect(mockSearchCountries).toHaveBeenCalledWith("Germ", ["DE"])
  })

  it("calls onSelect and clears input when option is selected", async () => {
    mockSearchCountries.mockReturnValue([mockCountry])
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    await userEvent.type(screen.getByPlaceholderText("Add New Country"), "Germ")
    await userEvent.click(screen.getByText("Germany"))
    expect(onSelect).toHaveBeenCalledWith(mockCountry)
    expect((screen.getByPlaceholderText("Add New Country") as HTMLInputElement).value).toBe("")
  })

  it("selects first option on Enter when query length >= 3 and results exist", async () => {
    mockSearchCountries.mockReturnValue([mockCountry])
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    const input = screen.getByPlaceholderText("Add New Country")
    await userEvent.type(input, "Ger")
    await userEvent.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith(mockCountry)
  })

  it("shows error toast on Enter when query length >= 3 and no results", async () => {
    const toast = await import("react-hot-toast")
    mockSearchCountries.mockReturnValue([])
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    await userEvent.type(screen.getByPlaceholderText("Add New Country"), "Xyz")
    await userEvent.keyboard("{Enter}")
    expect(toast.default.error).toHaveBeenCalledWith("Couldn't find such country in our world")
  })

  it("clears input when clear button is clicked", async () => {
    render(<CountrySearch onSelect={onSelect} existingCodes={[]} />)
    const input = screen.getByPlaceholderText("Add New Country")
    await userEvent.type(input, "test")
    expect((input as HTMLInputElement).value).toBe("test")
    await userEvent.click(screen.getByRole("button", { name: /clear input/i }))
    expect((input as HTMLInputElement).value).toBe("")
  })
})
