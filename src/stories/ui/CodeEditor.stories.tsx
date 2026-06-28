import type { Meta, StoryObj } from "@storybook/react";
import { CodeEditor } from "@/components/ui/code-editor";
import { ThemeProvider } from "@/features/theme/theme-provider";

const meta: Meta<typeof CodeEditor> = {
  title: "UI/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="w-[600px] h-[500px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    language: {
      control: "select",
      options: ["javascript", "typescript", "json", "html", "css", "python"],
    },
    value: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeEditor>;

export const Default: Story = {
  args: {
    language: "javascript",
    value: "function helloWorld() {\n  console.log('Hello, world!');\n}",
  },
};

export const JSONViewer: Story = {
  args: {
    language: "json",
    value: '{\n  "name": "ToolMate",\n  "version": "1.0.0",\n  "awesome": true\n}',
    options: {
      readOnly: true,
      minimap: { enabled: false },
    },
  },
};

export const TypescriptEditor: Story = {
  args: {
    language: "typescript",
    value: "interface User {\n  id: number;\n  name: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'John Doe',\n};",
  },
};
