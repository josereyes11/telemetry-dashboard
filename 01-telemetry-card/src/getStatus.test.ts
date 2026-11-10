import { getStatus } from "./getStatus";

describe("getStatus (range 0 to 100, so the warning margin is 10)", () => {
  it("returns 'ok' for a value in the middle of the range", () => {
    expect(getStatus(50, 0, 100)).toBe("ok");
  });

  it("returns 'ok' exactly at the edge of the warning margin", () => {
    expect(getStatus(10, 0, 100)).toBe("ok");
    expect(getStatus(90, 0, 100)).toBe("ok");
  });

  it("returns 'warning' when the value is close to min", () => {
    expect(getStatus(5, 0, 100)).toBe("warning");
  });

  it("returns 'warning' when the value is close to max", () => {
    expect(getStatus(95, 0, 100)).toBe("warning");
  });

  it("treats min and max themselves as still in range (warning)", () => {
    expect(getStatus(0, 0, 100)).toBe("warning");
    expect(getStatus(100, 0, 100)).toBe("warning");
  });

  it("returns 'out-of-range' below min or above max", () => {
    expect(getStatus(-1, 0, 100)).toBe("out-of-range");
    expect(getStatus(101, 0, 100)).toBe("out-of-range");
  });

  it("works with ranges that don't start at 0", () => {
    // range 3 to 5 → width 2 → margin 0.2
    expect(getStatus(4, 3, 5)).toBe("ok");
    expect(getStatus(3.1, 3, 5)).toBe("warning");
    expect(getStatus(5.5, 3, 5)).toBe("out-of-range");
  });
});
