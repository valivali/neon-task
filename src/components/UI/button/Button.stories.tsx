import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./Button"
import { SearchIcon } from "@/components/icons/SearchIcon"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button"
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: "primary"
  }
}

export const Secondary: Story = {
  args: {
    variant: "secondary"
  }
}

export const Loading: Story = {
  args: {
    isLoading: true
  }
}

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    leftIcon: <SearchIcon />,
    "aria-label": "Search"
  }
}
