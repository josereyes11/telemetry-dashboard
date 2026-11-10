// Part 3
// TODO: import what you need from React

// TODO: build the custom hook described in the README
import { useEffect, useState } from "react";

export function useLiveValue(
  initialValue: number,
  step: number,
  intervalMs = 1000,
) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((previous) => previous + (Math.random() * 2 - 1) * step);
    }, intervalMs);

    return () => clearInterval(id);
  }, [step, intervalMs]);
  return value;
}
