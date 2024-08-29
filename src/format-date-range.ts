import {
  isSameDay,
  isSameYear,
  isSameMonth,
  format,
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
} from "date-fns";

/**
 * Shortens AM/PM notation in a time string and removes trailing ":00" if present.
 * 
 * @param text - The time string to shorten.
 * @returns The shortened time string.
 */
const shortenAmPm = (text: string): string => {
  const shortened = (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");
  return shortened.includes("m") ? shortened.replace(/:00/g, "") : shortened;
};

/**
 * Removes leading zero from a time string.
 * 
 * @param text - The time string to process.
 * @returns The time string without leading zero.
 */
const removeLeadingZero = (text: string): string => text.replace(/^0/, "");

/**
 * Formats a date's time to a 12-hour clock format without leading zeroes and optionally includes AM/PM.
 * 
 * @param date - The date to format.
 * @param locale - The locale string for localization (optional).
 * @returns The formatted time string.
 */
export const formatTime = (date: Date, locale?: string): string => {
  return removeLeadingZero(
    shortenAmPm(
      date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }) || ""
    )
  );
};

/**
 * Creates a function to format time based on the provided locale.
 * 
 * @param locale - The locale string for localization (optional).
 * @returns A function that formats a date's time.
 */
const createFormatTime = (locale?: string) => (date: Date): string =>
  formatTime(date, locale);

/**
 * Retrieves the browser's language setting.
 * 
 * @returns The navigator language string.
 */
const getNavigatorLanguage = (): string => {
  if (typeof window === "undefined") {
    return "en-US";
  }
  return window.navigator.language;
};

export interface DateRangeFormatOptions {
  today?: Date;        // The current date for relative formatting (default is now)
  locale?: string;     // Locale for formatting (default is browser's language)
  includeTime?: boolean; // Whether to include time in the output
  separator?: string;  // Separator between date parts (default is "-")
}

/**
 * Formats a date range into a human-readable string, with various formatting options.
 * 
 * @param from - The start date of the range.
 * @param to - The end date of the range.
 * @param options - Options for formatting the date range.
 * @returns A formatted string representing the date range.
 */
export const formatDateRange = (
  from: Date,
  to: Date,
  {
    today = new Date(),
    locale = getNavigatorLanguage(),
    includeTime = true,
    separator = "-",
  }: DateRangeFormatOptions = {}
): string => {
  const sameYear = isSameYear(from, to);
  const sameMonth = isSameMonth(from, to);
  const sameDay = isSameDay(from, to);
  const thisYear = isSameYear(from, today);
  const thisDay = isSameDay(from, today);

  const yearSuffix = thisYear ? "" : `, ${format(to, "yyyy")}`;
  const formatTime = createFormatTime(locale);

  const startTimeSuffix = includeTime && !isSameMinute(startOfDay(from), from)
    ? `, ${formatTime(from)}`
    : "";

  const endTimeSuffix = includeTime && !isSameMinute(endOfDay(to), to)
    ? `, ${formatTime(to)}`
    : "";

  // Check if the range is the entire year
  if (
    isSameMinute(startOfYear(from), from) &&
    isSameMinute(endOfYear(to), to)
  ) {
    return `${format(from, "yyyy")}`;
  }

  // Check if the range is an entire quarter
  if (
    isSameMinute(startOfQuarter(from), from) &&
    isSameMinute(endOfQuarter(to), to) &&
    getQuarter(from) === getQuarter(to)
  ) {
    return `Q${getQuarter(from)} ${format(from, "yyyy")}`;
  }

  // Check if the range spans an entire month
  if (
    isSameMinute(startOfMonth(from), from) &&
    isSameMinute(endOfMonth(to), to)
  ) {
    if (sameMonth && sameYear) {
      return `${format(from, "LLLL yyyy")}`;
    }
    return `${format(from, "LLL")} ${separator} ${format(to, "LLL yyyy")}`;
  }

  // Range spans across years
  if (!sameYear) {
    return `${format(from, "LLL d ''yy")}${startTimeSuffix} ${separator} ${format(to, "LLL d ''yy")}${endTimeSuffix}`;
  }

  // Range spans across months
  if (!sameMonth) {
    return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(to, "LLL d")}${endTimeSuffix}${yearSuffix}`;
  }

  // Range spans across days
  if (!sameDay) {
    if (startTimeSuffix || endTimeSuffix) {
      return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(to, "LLL d")}${endTimeSuffix}${yearSuffix}`;
    }
    return `${format(from, "LLL d")} ${separator} ${format(to, "d")}${yearSuffix}`;
  }

  // Same day with different times
  if (startTimeSuffix || endTimeSuffix) {
    if (thisDay) {
      return `${formatTime(from)} ${separator} ${formatTime(to)}`;
    }
    return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${formatTime(to)}${yearSuffix}`;
  }

  // Full day
  return `${format(from, "eee, LLL d")}${yearSuffix}`;
};
