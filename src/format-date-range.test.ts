import { expect, test } from "vitest";
import { formatDateRange } from "./format-date-range";

const today = new Date("2021-08-01T12:00:00.000Z");

test("format date range same month", () => {
  const from = new Date("2021-01-01T12:00:00.000Z");
  const to = new Date("2021-01-12T12:00:00.000Z");

  expect(formatDateRange(from, to, today)).toBe("Jan 1 - 12");
});

test("format date range different month", () => {
  const from = new Date("2021-01-03T12:00:00.000Z");
  const to = new Date("2021-04-20T12:00:00.000Z");

  expect(formatDateRange(from, to, today)).toBe("Jan 3 - Apr 20");
});

test("format date range different year", () => {
  const from = new Date("2020-01-01T12:00:00.000Z");
  const to = new Date("2021-01-20T12:00:00.000Z");

  expect(formatDateRange(from, to, today)).toBe("Jan 1, '20 - Jan 20, '21");
});

test("format date range full day", () => {
  const from = new Date("2021-01-01T00:00:00.000Z");
  const to = new Date("2021-01-01T23:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("Fri, Jan 1");
});

test("format date range full day different year", () => {
  const from = new Date("2020-01-01T00:00:00.000Z");
  const to = new Date("2020-01-01T23:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("Wed, Jan 1, 2020");
});

test("format date range full month", () => {
  const from = new Date("2021-04-01T00:00:00.000Z");
  const to = new Date("2021-04-30T23:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("April 2021");
});

test("format date range full month different year", () => {
  const from = new Date("2020-01-01T00:00:00.000Z");
  const to = new Date("2020-01-31T23:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("January 2020");
});

test("format date range hour difference", () => {
  const from = new Date("2021-01-01T12:00:00.000Z");
  const to = new Date("2021-01-01T12:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("Jan 1, 12:00pm - 12:59pm");
});

test("format date range full year", () => {
  const from = new Date("2021-01-01T00:00:00.000Z");
  const to = new Date("2021-12-31T23:59:59.999Z");

  expect(formatDateRange(from, to, today)).toBe("2021");
});
