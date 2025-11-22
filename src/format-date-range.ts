import {
  isSameDay,
  isSameYear,
  isSameMonth,
  format as _format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfDay,
  isSameMinute,
  startOfYear,
  getQuarter,
  startOfQuarter,
  endOfQuarter,
  endOfYear,
  Locale
} from "date-fns";
import * as Locales from 'date-fns/locale';

const DEFAULT_LOCALE = 'en-US' as const;
const DEFAULT_LOCALE_WITHOUT_HYPHEN = DEFAULT_LOCALE.replace('-', '') as keyof typeof Locales;

const shortenAmPm = (text: string): string => {
  const shortened = (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");
  const withoutDoubleZero = shortened.includes("m")
    ? shortened.replace(/:00/g, "")
    : shortened;
  return withoutDoubleZero;
};

const removeLeadingZero = (text: string): string => text.replace(/^0/, "");

const createFormatTime =
  (locale?: string, tz?: string) =>
  (date: Date): string =>
    removeLeadingZero(
    shortenAmPm(
      date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz,
      }) || ""
    )
  );

const getNavigatorLanguage = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  return window.navigator.language;
};

export interface DateRangeFormatOptions {
  today?: Date;
  locale?: string;
  includeTime?: boolean;
  separator?: string;
  timezone?: string;
}

const isKnownLocale = (key: string): key is keyof typeof Locales => {
  return key in Locales;
};

const getLocaleDateFns = (locale: string): Locale => {
  if (isKnownLocale(locale)) {
    return Locales[locale];
  }
  const rootLocale = locale.substring(0, 2);
  if (isKnownLocale(rootLocale)) {
    return Locales[rootLocale];
  }
  return Locales[DEFAULT_LOCALE_WITHOUT_HYPHEN];
};

const createLocaleFormatter = (locale: string) => {
  return (date: Date | number, formatStr: string) => {
    return _format(date, formatStr, { locale: getLocaleDateFns(locale) });
  };
};

export const formatDateRange = (
  from: Date,
  to: Date,
  {
    today = new Date(),
    locale = getNavigatorLanguage(),
    includeTime = true,
    separator = "-",
    timezone,
  }: DateRangeFormatOptions = {}
): string => {
  const sameYear = isSameYear(from, to);
  const sameMonth = isSameMonth(from, to);
  const sameDay = isSameDay(from, to);
  const thisYear = isSameYear(from, today);
  const thisDay = isSameDay(from, today);

  const format = createLocaleFormatter(locale);

  const yearSuffix = thisYear ? "" : `, ${format(to, "yyyy")}`;

  const formatTime = createFormatTime(locale, timezone);

  const startTimeSuffix =
    includeTime && !isSameMinute(startOfDay(from), from)
      ? `, ${formatTime(from)}`
      : "";

  const endTimeSuffix =
    includeTime && !isSameMinute(endOfDay(to), to) ? `, ${formatTime(to)}` : "";

  // Check if the range is the entire year
  // Example: 2023
  if (
    isSameMinute(startOfYear(from), from) &&
    isSameMinute(endOfYear(to), to)
  ) {
    return `${format(from, "yyyy")}`;
  }

  // Check if the range is an entire quarter
  // Example: Q1 2023
  if (
    isSameMinute(startOfQuarter(from), from) &&
    isSameMinute(endOfQuarter(to), to) &&
    getQuarter(from) === getQuarter(to)
  ) {
    return `Q${getQuarter(from)} ${format(from, "yyyy")}`;
  }

  // Check if the range is across entire month
  if (
    isSameMinute(startOfMonth(from), from) &&
    isSameMinute(endOfMonth(to), to)
  ) {
    if (sameMonth && sameYear) {
      // Example: January 2023
      return `${format(from, "LLLL yyyy")}`;
    }
    // Example: Jan - Feb 2023
    return `${format(from, "LLL")} ${separator} ${format(to, "LLL yyyy")}`;
  }

  // Range across years
  // Example: Jan 1 '23 - Feb 12 '24
  if (!sameYear) {
    return `${format(
      from,
      "LLL d ''yy"
    )}${startTimeSuffix} ${separator} ${format(
      to,
      "LLL d ''yy"
    )}${endTimeSuffix}`;
  }

  // Range across months
  // Example: Jan 1 - Feb 12[, 2023]
  if (!sameMonth) {
    return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(
      to,
      "LLL d"
    )}${endTimeSuffix}${yearSuffix}`;
  }

  // Range across days
  if (!sameDay) {
    // Check for a time suffix, if so print the month twice
    // Example: Jan 1, 12:00pm - Jan 2, 1:00pm[, 2023]
    if (startTimeSuffix || endTimeSuffix) {
      return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(
        to,
        "LLL d"
      )}${endTimeSuffix}${yearSuffix}`;
    }

    // Example: Jan 1 - 12[, 2023]
    return `${format(from, "LLL d")} ${separator} ${format(
      to,
      "d"
    )}${yearSuffix}`;
  }

  // Same day, different times
  // Example: Jan 1, 12pm - 1pm[, 2023]
  if (startTimeSuffix || endTimeSuffix) {
    // If it's today, don't include the date
    // Example: 12:30pm - 1pm
    if (thisDay) {
      return `${formatTime(from)} ${separator} ${formatTime(to)}`;
    }

    // Example: Jan 1, 12pm - 1pm[, 2023]
    return `${format(
      from,
      "LLL d"
    )}${startTimeSuffix} ${separator} ${formatTime(to)}${yearSuffix}`;
  }

  // Full day
  // Example: Fri, Jan 1[, 2023]
  return `${format(from, "eee, LLL d")}${yearSuffix}`;
};
