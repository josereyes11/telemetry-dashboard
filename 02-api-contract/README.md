# API Contract: Job Detail Screen

You designed the **job detail screen** of a cloud platform. Users submit programs to a machine, wait in a queue, and later look at the results. Before the backend is built, a backend engineer shares a first draft of the endpoint `GET /api/jobs/:id`. Your job: make sure the API can actually support the screen, then build the frontend logic on top of the final contract.

You don't need any physics for this. Only three words: a **job** is one program sent to the machine, **qubits** is how big the program is, and **shots** is how many times it gets run. Results come back as counts per **bitstring** (like `"00"` or `"11"`).

**Rules for today:** no AI. Docs are fine (MDN, typescriptlang.org, vitest.dev).

Time: about 2.5 hours. Part 1 is on paper, no code.

## The screen you designed

The job detail screen shows:

- The job name and when it was submitted, in the user's local time
- A status badge: queued, running, completed, failed or cancelled
- When queued: position in the queue and an estimated start time
- When running: a progress bar
- When completed: a bar chart of the results, and the most likely result with its probability
- When failed: what went wrong in plain words, and what the user can do about it
- When cancelled: who cancelled it (the user or an operator in the lab)

## The backend draft

```json
{
  "id": "8f3a",
  "s": 2,
  "res": null,
  "err": "E417",
  "ts": 1731340800
}
```

The backend engineer's note: *"`s` is the status: 0 = queued, 1 = running, 2 = done, 3 = failed. `res` is null until the job is done. `err` is only set when it failed. `ts` is a timestamp."*

## Tasks

### Part 1: Read the screen against the draft (`notes.md`, about 45 min)

- [ ] List every piece of information the screen needs, one line each
- [ ] List the problems in the draft. Look for: missing data, unclear names, things that contradict each other in this example, and anything that would force the frontend to guess
- [ ] Write your proposed response as JSON for three cases: queued, completed and failed
- [ ] Write three questions you would ask the backend engineer in the meeting

### Part 2: Compare with the agreed contract (`src/types.ts`, read only)

After the meeting, this is what you agreed on.

- [ ] Read `types.ts` slowly. Notice how each status has its own type with only the fields that make sense for that status. This pattern is called a **discriminated union**.
- [ ] Fill in section 5 of `notes.md`: what matches your proposal, what is different, what would you still push for?

### Part 3: `getStatusText(job)` in `src/jobMessages.ts`

Return the text for the status badge:

| Status | Text |
| --- | --- |
| queued, position 1 | `Queued · next in line` |
| queued, other position | `Queued · position 3` |
| running | `Running · 33%` (completed shots / total shots, rounded) |
| completed | `Completed` |
| failed | `Failed` |
| cancelled by user | `Cancelled by you` |
| cancelled by operator | `Cancelled by an operator` |

- [ ] All `getStatusText` tests pass
- [ ] Notice what TypeScript lets you access inside each case. Can you read `job.progress` when the status is `"queued"`? Why not?

### Part 4: `getErrorMessage(code)`

The backend sends an error code. The user should never see the code itself. Map each code to a `{ title, action }` object.

| Code | Title | Action |
| --- | --- | --- |
| `CIRCUIT_TOO_LARGE` | Your program uses too many qubits | Reduce the number of qubits and submit again. |
| `MACHINE_CALIBRATING` | The machine is being calibrated | Your job was not run. Submit it again in a few minutes. |
| `INVALID_GATE` | *you write it* | *you write it* |
| `TIMEOUT` | *you write it* | *you write it* |
| `INTERNAL` | *you write it* | *you write it* |
| anything else | Something went wrong | Try again. If it keeps happening, contact support with the job ID. |

- [ ] Write a type for the return value
- [ ] Write the copy for the three empty rows. This is your UX writing part.
- [ ] All `getErrorMessage` tests pass
- [ ] Think: why does the function accept any `string` and not only `ErrorCode`? What happens when the backend adds a new code next month?

### Part 5: `getMostLikelyResult(job)`

From `result.counts`, find the bitstring with the highest count and its probability (its count divided by the sum of all counts).

Example: `{ "00": 480, "11": 510, "01": 6, "10": 4 }` → `{ bitstring: "11", probability: 0.51 }`

- [ ] Write a return type
- [ ] All `getMostLikelyResult` tests pass

### Part 6: `loadJob(id, fetchFn)` in `src/loadJob.ts`

Load a job and always return something the screen can show. Never let an error crash the screen.

| Situation | Return |
| --- | --- |
| Response OK | `{ state: "success", job }` |
| Status 404 | `{ state: "error", message: "This job doesn't exist or was deleted." }` |
| Any other error status | `{ state: "error", message: "The server had a problem (500). Try again in a moment." }` (use the real status number) |
| Request fails completely (no network) | `{ state: "error", message: "Can't reach the server. Check your connection." }` |

- [ ] Write the `LoadResult` type
- [ ] Call `fetchFn` with the URL `/api/jobs/<id>`
- [ ] All `loadJob` tests pass

## Talk it through (Wednesday, out loud, 2 minutes each)

1. "Walk me through how you'd work with a backend engineer on a new feature."
2. "The backend team says the field names don't matter, the frontend can map them. What do you say?"
3. "How do you decide between polling and WebSockets for job status?"
4. "What should the UI show if the API returns a status it doesn't know?"

Use this exercise as your example. Then add one real moment from nyris if you have one.

## Hints (only if you're stuck)

<details>
<summary>Part 1: I can't find many problems</summary>

Go through the screen list line by line and ask: "Which field in the draft gives me this?" Then look at the example itself: the status says done, but what does `res` say?
</details>

<details>
<summary>Part 3: where do I start?</summary>

You need to do something different for each value of `job.status`. Which JavaScript statement is made for "one value, many cases"?
</details>

<details>
<summary>Part 5: how do I loop over an object?</summary>

Objects don't have `.map` or `.reduce`, but arrays do. Which `Object.` method turns an object into an array of `[key, value]` pairs?
</details>

<details>
<summary>Part 6: the 404 and the network error end up in the same place</summary>

`fetch` only throws when the request can't happen at all. A 404 is a successful request with a bad answer. Where does each one end up: in the `try` or in the `catch`?
</details>

## Words you should be able to explain on Wednesday

Endpoint, request/response, HTTP status codes (200, 404, 500), JSON, API contract, discriminated union, union type, `Record<string, number>`, ISO 8601 timestamp, error code vs. error message, `async`/`await`, `try`/`catch`, polling vs. WebSocket, backwards compatibility.

## Development

```bash
npm install
npm run test       # run the tests in watch mode
npm run typecheck  # check for TypeScript errors
```

At the start, all tests fail and `typecheck` shows errors. That's expected.
