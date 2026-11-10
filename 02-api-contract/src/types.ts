// The contract you and the backend engineer agreed on after the meeting.
// Read only. Don't change this file. Your functions are built against it.

export type ErrorCode =
  | "CIRCUIT_TOO_LARGE"
  | "INVALID_GATE"
  | "MACHINE_CALIBRATING"
  | "TIMEOUT"
  | "INTERNAL";

type JobBase = {
  id: string;
  name: string; // name the user gave the job
  submittedAt: string; // ISO 8601 in UTC, e.g. "2026-11-11T13:00:00Z"
  qubits: number; // how many qubits the program uses
  shots: number; // how many times the program is run
};

export type QueuedJob = JobBase & {
  status: "queued";
  queuePosition: number; // 1 = next in line
  estimatedStartAt: string | null; // null = backend can't estimate yet
};

export type RunningJob = JobBase & {
  status: "running";
  startedAt: string;
  progress: { completedShots: number; totalShots: number };
};

export type CompletedJob = JobBase & {
  status: "completed";
  startedAt: string;
  finishedAt: string;
  // How often each result came out. Keys are bitstrings, values are counts.
  // Example: { "00": 480, "11": 510, "01": 6, "10": 4 }
  result: { counts: Record<string, number> };
};

export type FailedJob = JobBase & {
  status: "failed";
  finishedAt: string;
  error: { code: ErrorCode; detail: string }; // detail is for logs, not for users
};

export type CancelledJob = JobBase & {
  status: "cancelled";
  cancelledAt: string;
  cancelledBy: "user" | "operator";
};

export type Job = QueuedJob | RunningJob | CompletedJob | FailedJob | CancelledJob;
