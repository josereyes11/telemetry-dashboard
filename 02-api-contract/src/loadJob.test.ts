import { loadJob } from "./loadJob";
import type { Job } from "./types";

const job: Job = {
  id: "job-42",
  name: "Bell test",
  submittedAt: "2026-11-11T13:00:00Z",
  qubits: 2,
  shots: 1000,
  status: "queued",
  queuePosition: 2,
  estimatedStartAt: null,
};

// Builds a fake Response. Only `ok`, `status` and `json()` are used.
const fakeResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as Response;

describe("loadJob", () => {
  it("calls the right URL", async () => {
    const fetchFn = vi.fn().mockResolvedValue(fakeResponse(200, job));
    await loadJob("job-42", fetchFn);
    expect(fetchFn).toHaveBeenCalledWith("/api/jobs/job-42");
  });

  it("returns the job when the request works", async () => {
    const fetchFn = vi.fn().mockResolvedValue(fakeResponse(200, job));
    expect(await loadJob("job-42", fetchFn)).toEqual({ state: "success", job });
  });

  it("returns a clear message when the job doesn't exist (404)", async () => {
    const fetchFn = vi.fn().mockResolvedValue(fakeResponse(404, { error: "not found" }));
    expect(await loadJob("nope", fetchFn)).toEqual({
      state: "error",
      message: "This job doesn't exist or was deleted.",
    });
  });

  it("returns a general message for other server errors and includes the status", async () => {
    const fetchFn = vi.fn().mockResolvedValue(fakeResponse(500, {}));
    expect(await loadJob("job-42", fetchFn)).toEqual({
      state: "error",
      message: "The server had a problem (500). Try again in a moment.",
    });
  });

  it("returns a connection message when the request itself fails", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await loadJob("job-42", fetchFn)).toEqual({
      state: "error",
      message: "Can't reach the server. Check your connection.",
    });
  });
});
