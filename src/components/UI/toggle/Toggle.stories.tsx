import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { Toggle } from "./Toggle"

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  args: {
    label: "Dark mode",
    size: "md"
  }
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Toggle {...args} checked={checked} onChange={setChecked} />
  }
}
