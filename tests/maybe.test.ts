import { Just, Nothing } from "../src/maybe";

test("'map()' keeps the correct Type after being called", () => {
  expect(
    Just("hello")
      .map((_x) => "world")
      .isJust(),
  ).toBe(true);
  expect(
    Nothing()
      .map((_x) => "world")
      .isNothing(),
  ).toBe(true);
});

test("'map()' can change type of `Just` value", () => {
  const just = Just("hello").map((x) => x.length);
  expect(just.isJust()).toBe(true);
  if (just.isJust()) {
    expect(just.value).toBe(5);
  }
});
