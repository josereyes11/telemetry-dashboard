// Part 5
// TODO: show three live TelemetryCards in a grid (see the README for the values)

import TelemetryCard from "./TelemetryCard";
import { useLiveValue } from "./useLiveValue";

type Sensor = {
  label: string;
  start: number;
  step: number;
  unit: string;
  min: number;
  max: number;
};

const sensors: Sensor[] = [
  { label: "Trap temperature", start: 4, step: 0.1, unit: "K", min: 3, max: 5 },
  { label: "Laser power", start: 12, step: 1, unit: "mW", min: 0, max: 20 },
  {
    label: "Vacuum pressure",
    start: 2,
    step: 0.4,
    unit: "nPa",
    min: 0,
    max: 3,
  },
];

function LiveCard({ sensor }: { sensor: Sensor }) {
  const value = useLiveValue(sensor.start, sensor.step);
  return (
    <TelemetryCard
      label={sensor.label}
      value={value}
      unit={sensor.unit}
      min={sensor.min}
      max={sensor.max}
    />
  );
}

export default function App() {
  return (
    <main>
      <h1>Machine status</h1>
      <div className="card-grid">
        {sensors.map((sensor) => (
          <LiveCard key={sensor.label} sensor={sensor} />
        ))}
      </div>
    </main>
  );
}
