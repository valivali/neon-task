import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Dropdown } from "./Dropdown"
import { Button } from "../button/Button"

const DropdownDemo = () => {
  return (
    <div style={{ height: "300px" }}>
      <Dropdown trigger={<Button>Open menu</Button>} align="start">
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown>
    </div>
  )
}

const meta: Meta<typeof DropdownDemo> = {
  title: "UI/Dropdown",
  component: DropdownDemo
}

export default meta
type Story = StoryObj<typeof DropdownDemo>

export const Default: Story = {}
