import type { Job } from "./types";

// Part 6
// TODO: write a type called `LoadResult`.
//   Success: { state: "success"; job: Job }
//   Error:   { state: "error"; message: string }

// `fetchFn` defaults to the real fetch. The tests pass in a fake one.
export async function loadJob(id: string, fetchFn: typeof fetch = fetch) {
  // your code here
}
