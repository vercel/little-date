import { expect, describe, test } from "vitest";
import type { DateRangeFormatOptions } from "./format-date-range";
import { formatDateRange } from "./format-date-range";

const today = new Date("2023-11-15T12:00:00.000Z");

describe("format date range", () => {
  test("automatic locale detection should not fail", () => {
    const from = new Date("2023-01-01T00:00:00.000Z");
    const to = new Date("2023-01-12T23:59:59.999Z");

    expect(
      formatDateRange(from, to, {
        today,
      })
    ).toBe("Jan 1 - 12");
  });

  test("uses provided timezone when formatting time", () => {
    const from = today;
    const to = new Date(today.getTime() + 60 * 60 * 1000); // Today + 1 hour

    expect(formatDateRange(from, to, { ...defaultOptions, timezone: "Asia/Baku" })).toBe("4pm - 5pm");
  });
});

const locales = ["en-US", "en-GB", "pt-BR"] as const;

const defaultOptions: DateRangeFormatOptions = {
  today,
};

type Locale = (typeof locales)[number];

type ExpectedResults = Record<Locale, string>;

const formatRangeLocaleTestCases: {
  description: string;
  from: Date;
  to: Date;
  options?: Partial<DateRangeFormatOptions>;
  expected: ExpectedResults;
}[] = [
  {
    description: "format date range same month",
    from: new Date("2023-08-01T00:00:00.000Z"),
    to: new Date("2023-08-12T23:59:59.999Z"),
    expected: {
      "en-US": "Aug 1 - 12",
      "en-GB": "Aug 1 - 12",
      "pt-BR": "ago 1 - 12",
    },
  },
  {
    description: "format date range different month",
    from: new Date("2023-01-03T00:00:00.000Z"),
    to: new Date("2023-04-20T23:59:59.999Z"),
    expected: {
      "en-US": "Jan 3 - Apr 20",
      "en-GB": "Jan 3 - Apr 20",
      "pt-BR": "jan 3 - abr 20",
    },
  },
  {
    description: "format date range different year",
    from: new Date("2022-04-01T00:00:00.000Z"),
    to: new Date("2023-04-20T23:59:59.999Z"),
    expected: {
      "en-US": "Apr 1 '22 - Apr 20 '23",
      "en-GB": "Apr 1 '22 - Apr 20 '23",
      "pt-BR": "abr 1 '22 - abr 20 '23",
    },
  },
  {
    description: "format date range full day",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-01-01T23:59:59.999Z"),
    expected: {
      "en-US": "Sun, Jan 1",
      "en-GB": "Sun, Jan 1",
      "pt-BR": "dom, jan 1",
    },
  },
  {
    description: "format date range same day, different hours",
    from: new Date("2023-10-01T00:11:00.000Z"),
    to: new Date("2023-10-01T14:30:59.999Z"),
    expected: {
      "en-US": "Oct 1, 12:11am - 2:30pm",
      "en-GB": "Oct 1, 0:11 - 14:30",
      "pt-BR": "out 1, 0:11 - 14:30",
    },
  },
  {
    description: "format date range different days with time",
    from: new Date("2023-01-01T00:11:00.000Z"),
    to: new Date("2023-01-02T14:30:00.000Z"),
    expected: {
      "en-US": "Jan 1, 12:11am - Jan 2, 2:30pm",
      "en-GB": "Jan 1, 0:11 - Jan 2, 14:30",
      "pt-BR": "jan 1, 0:11 - jan 2, 14:30",
    },
  },
  {
    description: "format date range different days with single time",
    from: new Date("2023-01-01T00:11:00.000Z"),
    to: new Date("2023-01-02T23:59:59.999Z"),
    expected: {
      "en-US": "Jan 1, 12:11am - Jan 2",
      "en-GB": "Jan 1, 0:11 - Jan 2",
      "pt-BR": "jan 1, 0:11 - jan 2",
    },
  },
  {
    description: "format date range different years with time",
    from: new Date("2022-12-01T00:11:00.000Z"),
    to: new Date("2023-12-02T14:30:00.000Z"),
    expected: {
      "en-US": "Dec 1 '22, 12:11am - Dec 2 '23, 2:30pm",
      "en-GB": "Dec 1 '22, 0:11 - Dec 2 '23, 14:30",
      "pt-BR": "dez 1 '22, 0:11 - dez 2 '23, 14:30",
    },
  },
  {
    description: "format date range different years with time, includeTime: false",
    from: new Date("2022-01-01T00:11:00.000Z"),
    to: new Date("2023-01-02T14:30:00.000Z"),
    options: {
      includeTime: false,
    },
    expected: {
      "en-US": "Jan 1 '22 - Jan 2 '23",
      "en-GB": "Jan 1 '22 - Jan 2 '23",
      "pt-BR": "jan 1 '22 - jan 2 '23",
    },
  },
  {
    description: "format date range full day different year",
    from: new Date("2022-01-01T00:00:00.000Z"),
    to: new Date("2022-01-01T23:59:59.999Z"),
    expected: {
      "en-US": "Sat, Jan 1, 2022",
      "en-GB": "Sat, Jan 1, 2022",
      "pt-BR": "sáb, jan 1, 2022",
    },
  },
  {
    description: "format date range full month",
    from: new Date("2023-04-01T00:00:00.000Z"),
    to: new Date("2023-04-30T23:59:59.999Z"),
    expected: {
      "en-US": "April 2023",
      "en-GB": "April 2023",
      "pt-BR": "abril 2023",
    },
  },
  {
    description: "format date range full month different year",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-01-31T23:59:59.999Z"),
    expected: {
      "en-US": "January 2023",
      "en-GB": "January 2023",
      "pt-BR": "janeiro 2023",
    },
  },
  {
    description: "format date range hour difference",
    from: new Date("2023-01-01T12:00:00.000Z"),
    to: new Date("2023-01-01T12:59:59.999Z"),
    expected: {
      "en-US": "Jan 1, 12pm - 12:59pm",
      "en-GB": "Jan 1, 12:00 - 12:59",
      "pt-BR": "jan 1, 12:00 - 12:59",
    },
  },
  {
    description: "format date range today, different hours",
    from: today,
    to: new Date(today.getTime() + 60 * 60 * 1000), // Today + 1 hour
    expected: {
      "en-US": "12pm - 1pm",
      "en-GB": "12:00 - 13:00",
      "pt-BR": "12:00 - 13:00",
    },
  },
  {
    description: "format date range full year",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-12-31T23:59:59.999Z"),
    expected: {
      "en-US": "2023",
      "en-GB": "2023",
      "pt-BR": "2023",
    },
  },
  {
    description: "format date range quarter",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-03-31T23:59:59.999Z"),
    expected: {
      "en-US": "Q1 2023",
      "en-GB": "Q1 2023",
      "pt-BR": "Q1 2023",
    },
  },
  {
    description: "across two full months",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-02-28T23:59:59.999Z"),
    expected: {
      "en-US": "Jan - Feb 2023",
      "en-GB": "Jan - Feb 2023",
      "pt-BR": "jan - fev 2023",
    },
  },
  {
    description: "custom separator",
    from: new Date("2023-01-01T00:00:00.000Z"),
    to: new Date("2023-01-12T23:59:59.999Z"),
    options: {
      separator: "to",
    },
    expected: {
      "en-US": "Jan 1 to 12",
      "en-GB": "Jan 1 to 12",
      "pt-BR": "jan 1 to 12",
    },
  },
];

describe.each(locales)("format date range with locale %s", (locale) => {
  test.each(formatRangeLocaleTestCases)("$description", ({ from, to, options, expected }) => {
    expect(formatDateRange(from, to, {
      ...defaultOptions,
      locale,
      ...options, 
    })).toBe(expected[locale]);
  });
});
