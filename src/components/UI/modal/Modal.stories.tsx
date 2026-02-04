import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Modal } from "./Modal"
import { Button } from "../button/Button"

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete item" confirmText="Delete" cancelText="Cancel">
        This action cannot be undone.
      </Modal>
    </>
  )
}

const meta: Meta<typeof ModalDemo> = {
  title: "UI/Modal",
  component: ModalDemo
}

export default meta
type Story = StoryObj<typeof ModalDemo>

export const Default: Story = {}
