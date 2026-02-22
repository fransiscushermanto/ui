import type { StorybookConfig } from "@storybook/react-vite";
import fs from "fs";

function getStories(
  options: {
    pkg?: string;
    dir?: string;
  } = {},
) {
  const { pkg, dir = "components" } = options;

  const dirName = `src/${dir}`;
  const scope = pkg ? [pkg] : fs.readdirSync(dirName);

  return scope
    .map((pkg) => `${dirName}/${pkg}/stories`)
    .filter((storyDir) => fs.existsSync(storyDir))
    .map((storyDir) => `../${storyDir}/*.stories.tsx`);
}

const config: StorybookConfig = {
  stories: [...getStories()],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
};
export default config;
