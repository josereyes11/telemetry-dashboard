import { render, screen } from "@testing-library/react";
import TelemetryCard from "./TelemetryCard";

describe("TelemetryCard", () => {
  it("shows the label as a heading", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={4}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Trap temperature" }),
    ).toBeInTheDocument();
  });

  it("shows the value with 2 decimals and the unit", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={4.236}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(screen.getByText("4.24 K")).toBeInTheDocument();
  });

  it("uses the precision prop when it is passed", () => {
    render(
      <TelemetryCard
        label="Laser power"
        value={12.3456}
        unit="mW"
        min={0}
        max={20}
        precision={1}
      />,
    );
    expect(screen.getByText("12.3 mW")).toBeInTheDocument();
  });

  it("shows the status as text, not only as color", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={4}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("OK");
  });

  it("adds a BEM modifier class that matches the status", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={3.1}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(screen.getByRole("article")).toHaveClass(
      "telemetry-card",
      "telemetry-card--warning",
    );
  });

  // Part 4: write these two tests yourself.
  // Replace `it.todo` with `it` and add the test body.
  it("shows 'Out of range' when the value is above max", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={6}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Out of range");
  });

  it("has the class telemetry-card--out-of-range when the value is below min", () => {
    render(
      <TelemetryCard
        label="Trap temperature"
        value={2}
        unit="K"
        min={3}
        max={5}
      />,
    );
    expect(screen.getByRole("article")).toHaveClass(
      "telemetry-card--out-of-range",
    );
  });
});
