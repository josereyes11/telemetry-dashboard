import type { Job, CompletedJob } from "./types";

// Part 3
export function getStatusText(job: Job): string {
  switch (job.status) {
    case "queued":
      return job.queuePosition === 1
        ? "Queued · next in line"
        : `Queued · position ${job.queuePosition}`;

    case "running": {
      const { completedShots, totalShots } = job.progress;
      const percent = Math.round((completedShots / totalShots) * 100);
      return `Running · ${percent}%`;
    }

    case "completed":
      return "Completed";

    case "failed":
      return "Failed";

    case "cancelled":
      return job.cancelledBy === "user"
        ? "Cancelled by you"
        : "Cancelled by an operator";
  }
}

// Part 4
// TODO: write a type for the return value: an object with `title` and `action` (both strings)
export function getErrorMessage(code: string) {
  // your code here
}

// Part 5
// TODO: write a return type: an object with `bitstring` (string) and `probability` (number)
export function getMostLikelyResult(job: CompletedJob) {
  // your code here
}
