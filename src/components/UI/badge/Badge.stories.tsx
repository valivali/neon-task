import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Badge } from "./Badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Badge"
  }
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    isSelected: true
  }
}
