import { renderHook, act } from "@testing-library/react";
import { useLiveValue } from "./useLiveValue";

describe("useLiveValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Math.random() always returns 1, so every tick moves the value up by exactly `step`
    vi.spyOn(Math, "random").mockReturnValue(1);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("starts with the initial value", () => {
    const { result } = renderHook(() => useLiveValue(10, 0.5));
    expect(result.current).toBe(10);
  });

  it("changes the value after one interval", () => {
    const { result } = renderHook(() => useLiveValue(10, 0.5));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(10.5);
  });

  it("keeps building on the latest value, tick after tick", () => {
    const { result } = renderHook(() => useLiveValue(10, 0.5));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(11.5);
  });

  it("respects a custom interval", () => {
    const { result } = renderHook(() => useLiveValue(10, 0.5, 2000));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(10);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(10.5);
  });

  it("cleans up the interval when the component unmounts", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useLiveValue(10, 0.5));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
