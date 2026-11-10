import { getStatusText, getErrorMessage, getMostLikelyResult } from "./jobMessages";
import type { Job, CompletedJob } from "./types";

const base = {
  id: "job-42",
  name: "Bell test",
  submittedAt: "2026-11-11T13:00:00Z",
  qubits: 2,
  shots: 1000,
};

describe("getStatusText", () => {
  it("shows the queue position for queued jobs", () => {
    const job: Job = { ...base, status: "queued", queuePosition: 3, estimatedStartAt: null };
    expect(getStatusText(job)).toBe("Queued · position 3");
  });

  it("says 'Next in line' when the queue position is 1", () => {
    const job: Job = { ...base, status: "queued", queuePosition: 1, estimatedStartAt: null };
    expect(getStatusText(job)).toBe("Queued · next in line");
  });

  it("shows progress as a rounded percentage for running jobs", () => {
    const job: Job = {
      ...base,
      status: "running",
      startedAt: "2026-11-11T13:05:00Z",
      progress: { completedShots: 333, totalShots: 1000 },
    };
    expect(getStatusText(job)).toBe("Running · 33%");
  });

  it("shows 'Completed' and 'Failed'", () => {
    const done: Job = {
      ...base,
      status: "completed",
      startedAt: "2026-11-11T13:05:00Z",
      finishedAt: "2026-11-11T13:06:00Z",
      result: { counts: { "00": 1000 } },
    };
    const failed: Job = {
      ...base,
      status: "failed",
      finishedAt: "2026-11-11T13:06:00Z",
      error: { code: "TIMEOUT", detail: "worker 7 timed out" },
    };
    expect(getStatusText(done)).toBe("Completed");
    expect(getStatusText(failed)).toBe("Failed");
  });

  it("says who cancelled the job", () => {
    const byUser: Job = { ...base, status: "cancelled", cancelledAt: "2026-11-11T13:02:00Z", cancelledBy: "user" };
    const byOperator: Job = { ...base, status: "cancelled", cancelledAt: "2026-11-11T13:02:00Z", cancelledBy: "operator" };
    expect(getStatusText(byUser)).toBe("Cancelled by you");
    expect(getStatusText(byOperator)).toBe("Cancelled by an operator");
  });
});

describe("getErrorMessage", () => {
  it("returns the title and action for known codes", () => {
    expect(getErrorMessage("CIRCUIT_TOO_LARGE")).toEqual({
      title: "Your program uses too many qubits",
      action: "Reduce the number of qubits and submit again.",
    });
    expect(getErrorMessage("MACHINE_CALIBRATING")).toEqual({
      title: "The machine is being calibrated",
      action: "Your job was not run. Submit it again in a few minutes.",
    });
  });

  it("has a non-empty title and action for every known code", () => {
    const codes = ["CIRCUIT_TOO_LARGE", "INVALID_GATE", "MACHINE_CALIBRATING", "TIMEOUT", "INTERNAL"];
    codes.forEach((code) => {
      const message = getErrorMessage(code);
      expect(message.title.length).toBeGreaterThan(0);
      expect(message.action.length).toBeGreaterThan(0);
    });
  });

  it("falls back to a general message for codes it doesn't know yet", () => {
    expect(getErrorMessage("SOME_NEW_CODE_FROM_BACKEND")).toEqual({
      title: "Something went wrong",
      action: "Try again. If it keeps happening, contact support with the job ID.",
    });
  });
});

describe("getMostLikelyResult", () => {
  const completed = (counts: Record<string, number>): CompletedJob => ({
    ...base,
    status: "completed",
    startedAt: "2026-11-11T13:05:00Z",
    finishedAt: "2026-11-11T13:06:00Z",
    result: { counts },
  });

  it("returns the bitstring with the highest count", () => {
    const job = completed({ "00": 480, "11": 510, "01": 6, "10": 4 });
    expect(getMostLikelyResult(job).bitstring).toBe("11");
  });

  it("returns the probability as a fraction of all counts", () => {
    const job = completed({ "00": 480, "11": 510, "01": 6, "10": 4 });
    expect(getMostLikelyResult(job).probability).toBeCloseTo(0.51);
  });

  it("works when there is only one result", () => {
    const job = completed({ "101": 200 });
    expect(getMostLikelyResult(job)).toEqual({ bitstring: "101", probability: 1 });
  });
});
