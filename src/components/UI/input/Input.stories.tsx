import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Input } from "./Input"
import { SearchIcon } from "@/components/icons/SearchIcon"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "Search",
    leftIcon: <SearchIcon />
  }
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithRightElement: Story = {
  args: {
    rightElement: <span style={{ fontSize: 12, opacity: 0.7 }}>Ctrl K</span>
  }
}
