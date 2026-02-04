import type { Meta, StoryObj } from "@storybook/react"
import { Card } from "./Card"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <div style={{ padding: "16px" }}>
        <strong>Card title</strong>
        <p>Card content goes here.</p>
      </div>
    </Card>
  )
}
