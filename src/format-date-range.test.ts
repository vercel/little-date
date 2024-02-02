import { expect, describe, test } from "vitest";
import type { DateRangeFormatOptions } from "./format-date-range";
import { formatDateRange } from "./format-date-range";

const today = new Date("2023-11-15T12:00:00.000Z");

const defaultOptions: DateRangeFormatOptions = {
  today,
  locale: "en-US",
};

describe("format date range", () => {
  test("format date range same month", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-12T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Jan 1 - 12");
  });

  test("format date range different month", () => {
    const from = new Date("2023-01-03T00:00:00.000Z");
    const to = new Date("2023-04-20T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Jan 3 - Apr 20");
  });

  test("format date range different year", () => {
    const from = new Date("2022-01-01T00:00:00.000Z");
    const to = new Date("2023-01-20T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1 '22 - Jan 20 '23"
    );
  });

  test("format date range full day", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-01T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Sun, Jan 1");
  });

  test("format date range same day, different hours", () => {
    const from = new Date("2023-01-01T00:11:00.000Z");
    const to = new Date("2023-01-01T14:30:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1, 12:11am - 2:30pm"
    );
  });

  test("format date range same day, different hours, with 24-hour locale", () => {
    const from = new Date("2023-01-01T00:11:00.000Z");
    const to = new Date("2023-01-01T14:00:59.999Z");

    expect(
      formatDateRange(from, to, {
        ...defaultOptions,
        locale: "en-GB",
      })
    ).toBe("Jan 1, 0:11 - 14:00");
  });

  test("format date range different days with time", () => {
    const from = new Date("2023-01-01T00:11:00.000Z");
    const to = new Date("2023-01-02T14:30:00.000Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1, 12:11am - Jan 2, 2:30pm"
    );
  });

  test("format date range different days with single time", () => {
    const from = new Date("2023-01-01T00:11:00.000Z");
    const to = new Date("2023-01-02T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1, 12:11am - Jan 2"
    );
  });

  test("format date range different years with time", () => {
    const from = new Date("2022-01-01T00:11:00.000Z");
    const to = new Date("2023-01-02T14:30:00.000Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1 '22, 12:11am - Jan 2 '23, 2:30pm"
    );
  });

  test("format date range different years with time, includeTime: false", () => {
    const from = new Date("2022-01-01T00:11:00.000Z");
    const to = new Date("2023-01-02T14:30:00.000Z");

    expect(
      formatDateRange(from, to, {
        ...defaultOptions,
        includeTime: false,
      })
    ).toBe("Jan 1 '22 - Jan 2 '23");
  });

  test("format date range full day different year", () => {
    const from = new Date("2022-01-01T00:00:00.000Z");
    const to = new Date("2022-01-01T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Sat, Jan 1, 2022");
  });

  test("format date range full month", () => {
    const from = new Date("2023-04-01T00:00:00.000Z");
    const to = new Date("2023-04-30T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("April 2023");
  });

  test("format date range full month different year", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-31T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("January 2023");
  });

  test("format date range hour difference", () => {
    const from = new Date("2023-01-01T12:00:00.000Z");
    const to = new Date("2023-01-01T12:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe(
      "Jan 1, 12pm - 12:59pm"
    );
  });

  test("format date range today, different hours", () => {
    const from = today;
    const to = new Date(today.getTime() + 60 * 60 * 1000); // Today + 1 hour

    expect(formatDateRange(from, to, defaultOptions)).toBe("12pm - 1pm");
  });

  test("format date range full year", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-12-31T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("2023");
  });

  test("format date range quarter", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-03-31T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Q1 2023");
  });

  test("across two full months", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-02-28T23:59:59.999Z");

    expect(formatDateRange(from, to, defaultOptions)).toBe("Jan - Feb 2023");
  });

  test("custom separator", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-12T23:59:59.999Z");

    expect(
      formatDateRange(from, to, {
        ...defaultOptions,
        separator: "to",
      })
    ).toBe("Jan 1 to 12");
  });

  test("automatic locale detection should not fail", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-12T23:59:59.999Z");

    expect(
      formatDateRange(from, to, {
        today,
      })
    ).toBe("Jan 1 - 12");
  });
});
