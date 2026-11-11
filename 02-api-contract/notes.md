# Notes: job detail screen vs. API draft

## 1. What the screen needs (one line per piece of information)

- Job name and submitted time (shown in the user's local time)
- Status: queued, running, completed, failed, cancelled
- Queued: queue position + estimated start time
- Running: progress (done vs. total)
- Completed: result counts for the chart + the most likely result
- Failed: what went wrong in plain words + what the user can do
- Cancelled: who cancelled it (user or operator)

## 2. Problems I see in the backend draft

- `s: 2` is a magic number. Every client has to know that 2 means "done".
  Use readable strings: "queued", "running", "completed"...
- Short names (`s`, `res`, `err`, `ts`) are unclear. Names are part of the contract.
- It contradicts itself: status says done (2), but `res` is null. Is it
  empty, still loading, or broken? The frontend has to guess.
- `ts`: which time? Submitted, started or finished? And it's a Unix number.
  Better: named fields in ISO 8601 UTC, e.g. "submittedAt": "2026-11-11T13:00:00Z".
- `err: "E417"` is a code with no meaning for the user. Fine as a code,
  but we need a fixed list of codes so the frontend can map them to messages.
- Missing: job name, queue position, estimated start, progress, who cancelled.
- No "cancelled" status at all.

## 3. My proposed response

Queued:
{ "id": "8f3a", "name": "Bell test", "status": "queued",
"submittedAt": "2026-11-11T13:00:00Z",
"queuePosition": 3, "estimatedStartAt": "2026-11-11T13:20:00Z" }

Completed:
{ "id": "8f3a", "name": "Bell test", "status": "completed",
"submittedAt": "...", "startedAt": "...", "finishedAt": "...",
"result": { "counts": { "00": 480, "11": 510, "01": 6, "10": 4 } } }

Failed:
{ "id": "8f3a", "name": "Bell test", "status": "failed",
"submittedAt": "...", "finishedAt": "...",
"error": { "code": "MACHINE_CALIBRATING", "detail": "for logs only" } }

## 4. Questions I would ask the backend engineer

1. Can you estimate tge start time, or only the queue position? What should the UI show when there's no estimate?
2. Do we poll this endpoint or get updates pushed (webSocet)? How often does the status chnage?
3. What's the full list of error codes, and what happens when you add a new one?

## 5. My proposal vs. the agreed contract (`src/types.ts`)

What's the same, what's different, and what would I push for next time?

-
