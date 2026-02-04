import type { StorybookConfig } from "@storybook/nextjs-vite"
import path from "path"
import { fileURLToPath } from "url"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  async viteFinal(config) {
    const rootDir = path.dirname(fileURLToPath(import.meta.url))
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@": path.resolve(rootDir, "../src")
      }
    }
    return config
  }
}
export default config
