import type { Meta, StoryObj } from "@storybook/react"
import { Subtitle, Text, Title } from "./Text"

const TextDemo = () => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Title level={2}>Title</Title>
      <Subtitle size="sm">Subtitle</Subtitle>
      <Text variant="p" size="md">
        Body text for paragraphs and descriptions.
      </Text>
      <Text variant="caption" size="sm">
        Caption text
      </Text>
    </div>
  )
}

const meta: Meta<typeof TextDemo> = {
  title: "UI/Text",
  component: TextDemo
}

export default meta
type Story = StoryObj<typeof TextDemo>

export const Default: Story = {}
