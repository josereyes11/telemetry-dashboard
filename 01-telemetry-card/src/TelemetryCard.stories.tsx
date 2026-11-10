import type { Meta, StoryObj } from "@storybook/react-vite";
import TelemetryCard from "./TelemetryCard";

const meta = {
  title: "Telemetry/TelemetryCard",
  component: TelemetryCard,
  args: {
    label: "Trap temperature",
    unit: "K",
    min: 2,
    max: 5,
  },
} satisfies Meta<typeof TelemetryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = {
  args: { value: 3.1 },
};

export const OutOfRange: Story = {
  args: { value: 5.6 },
};

export const CustomPrecision: Story = {
  args: {
    label: "Laser power",
    value: 12.3456,
    unit: "mW",
    min: 0,
    max: 20,
    precision: 1,
  },
};
