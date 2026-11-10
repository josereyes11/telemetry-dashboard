# Telemetry Card

Build a small, tested React + TypeScript component that shows one live value from a machine, like the temperature of a trap or the power of a laser. Operators look at dozens of these at once, so the card has to tell them in one glance if something needs attention.

**Rules for today:** no AI. You can use the docs (react.dev, MDN, typescriptlang.org, testing-library.com). When you get stuck for more than 10 minutes, write down where and move on. Those notes are your Wednesday review list.

Time: about 3 hours.

## Tasks

### Part 1: The status logic (`src/getStatus.ts`)

Every value has a `min` and a `max`. The card has three states:

| Status | When |
| --- | --- |
| `"out-of-range"` | value is below `min` or above `max` |
| `"warning"` | value is inside the range, but within **10% of the range width** from `min` or `max` |
| `"ok"` | everything else |

Example: range 0 to 100 → width 100 → margin 10. So 5 and 95 are `"warning"`, 10 and 90 are `"ok"`, 101 is `"out-of-range"`. The values exactly at `min` and `max` are still in range, so they are `"warning"`.

- [ ] Export a type `Status` that only allows the three strings above
- [ ] Give `getStatus` the return type `Status`
- [ ] Write the logic so all tests in `getStatus.test.ts` pass

### Part 2: The component (`src/TelemetryCard.tsx`)

- [ ] Write a `TelemetryCardProps` type with these props:
  - `label` (string)
  - `value` (number)
  - `unit` (string)
  - `min` (number)
  - `max` (number)
  - `precision` (number, **optional**, default `2`)
- [ ] Render an `<article>` with the class `telemetry-card` plus a BEM modifier for the status, for example `telemetry-card telemetry-card--warning`
- [ ] Show the label as an `<h3>`
- [ ] Show the value with `precision` decimals and the unit, for example `4.24 K`
- [ ] Show the status as text: `OK`, `Warning` or `Out of range`, in an element with `role="status"`
- [ ] All tests in `TelemetryCard.test.tsx` pass

### Part 3: A live value (`src/useLiveValue.ts`)

In the real product the values would arrive through a WebSocket. For now you fake it with a timer.

Write a custom hook `useLiveValue(initialValue, step, intervalMs = 1000)` that:

- [ ] Starts with `initialValue`
- [ ] Every `intervalMs` milliseconds, changes the value with this formula:
  `next = previous + (Math.random() * 2 - 1) * step`
- [ ] Stops the timer when the component unmounts
- [ ] Passes all tests in `useLiveValue.test.ts`

### Part 4: Write your own tests

In `TelemetryCard.test.tsx` there are two `it.todo(...)` lines at the bottom.

- [ ] Turn both into real tests. Look at the tests above them for the pattern.
- [ ] Break your component on purpose for a moment and check that your new tests fail. A test that never fails doesn't test anything.

### Part 5: Put it together (`src/App.tsx` and `src/index.css`)

- [ ] Show three live cards in a CSS grid:

| Label | Start value | Step | Unit | Min | Max |
| --- | --- | --- | --- | --- | --- |
| Trap temperature | 4 | 0.1 | K | 3 | 5 |
| Laser power | 12 | 1 | mW | 0 | 20 |
| Vacuum pressure | 2 | 0.4 | nPa | 0 | 3 |

- [ ] Style the three states. Rule: someone who can't see color must still understand the state (think icon, border, weight, text).
- [ ] Watch the cards change state in the browser

## Bonus

- [ ] Add a small range bar under the value that shows where the value sits between `min` and `max`
- [ ] Add Storybook (`npx storybook@latest init`) and write one story per state
- [ ] Think, don't code: if the values came from a WebSocket, what would change in `useLiveValue`? What happens to the card if the connection drops and no new values arrive?

## Hints (only if you're stuck)

<details>
<summary>Part 1: my numbers are almost right but not quite</summary>

Draw the range on paper as a line from `min` to `max`. Mark where the warning zones start. Which comparison do you need at the exact border: `<` or `<=`? The tests for 10 and 90 tell you.
</details>

<details>
<summary>Part 2: how do I make a prop optional with a default?</summary>

Two separate things: the `?` in the type makes it optional, and the default goes in the destructuring of the props. Look up "default values in destructuring".
</details>

<details>
<summary>Part 3: the value goes up once and then gets stuck</summary>

Think of the interval callback as a photo taken when the effect ran. Which value of the state is in that photo? `setState` can take a function instead of a value. Why would that help here?
</details>

<details>
<summary>Part 3: the cleanup test fails</summary>

What can a `useEffect` return, and when does React call it?
</details>

## Words you should be able to explain on Wednesday

Props, state, `useEffect` and its cleanup, dependency array, custom hook, union type, optional prop, `toFixed`, BEM modifier, `role="status"`, unit test vs. component test, why tests use `getByRole`.

## Development

```bash
npm install
npm run dev        # open the app in the browser
npm run test       # run the tests in watch mode
npm run typecheck  # check for TypeScript errors
```

At the start, all tests fail and `typecheck` shows errors. That's expected. They go away as you finish each part.
