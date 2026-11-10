// Part 1
// TODO: export a type called `Status`.
//       It can only be one of these three strings: "ok", "warning", "out-of-range"

// TODO: give this function a return type (use your `Status` type)
//       and write the logic described in the README.

export type Status = "ok" | "warning" | "out-of-range";

export function getStatus(value: number, min: number, max: number): Status {
  if (value < min || value > max) {
    return "out-of-range";
  }

  const margin = (max - min) * 0.1;

  if (value < min + margin || value > max - margin) {
    return "warning";
  }

  return "ok";
}
