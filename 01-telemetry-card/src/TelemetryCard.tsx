// Part 2
// TODO: import getStatus

// TODO: write a type called `TelemetryCardProps` (see the README for the list of props)

// TODO: type the props and build the component

import { getStatus, type Status } from "./getStatus";

type TelemetryCardProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  precision?: number;
};

const statusLabels: Record<Status, string> = {
  ok: "OK",
  warning: "Warning",
  "out-of-range": "Out of range",
};

function getPosition(value: number, min: number, max: number) {
  const percent = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, percent));
}

export default function TelemetryCard({
  label,
  value,
  unit,
  min,
  max,
  precision = 2,
}: TelemetryCardProps) {
  const status = getStatus(value, min, max);
  return (
    <article className={`telemetry-card telemetry-card--${status}`}>
      <h3>{label}</h3>
      <p className="telemetry-card__value">
        {value.toFixed(precision)} {unit}
      </p>
      <div className="telemetry-card__range" aria-hidden="true">
        <span
          className="telemetry-card__marker"
          style={{ left: `${getPosition(value, min, max)}%` }}
        />
      </div>
      <p className="telemetry-card__limits">
        {min} - {max} {unit}
      </p>
      <p className="telemetry-card__status" role="status">
        {statusLabels[status]}
      </p>
    </article>
  );
}
