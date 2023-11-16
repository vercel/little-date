import {
  isSameDay,
  isSameHour,
  isSameYear,
  isSameMonth,
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfDay,
  isSameMinute,
  startOfYear,
  endOfYear,
} from "date-fns";

export const replaceAmPm = (text: string) =>
  (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");

export const formatTime = (date?: Date) =>
  replaceAmPm(
    date?.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }) || ""
  );

const getNavigatorLanguage = () => {
  if (typeof window === "undefined") {
    return "en-US";
  }
  return window.navigator.language;
};

export const formatDate = (
  date: Date,
  interval: "day" | "hour" | "minute" | "month"
) => {
  const lang = getNavigatorLanguage();
  switch (interval) {
    case "day":
      return (
        date?.toLocaleDateString(lang, {
          day: "2-digit",
        }) + "."
      );
    case "hour":
      const loc = date?.toLocaleTimeString(lang, {
        hour: "numeric",
      });
      return replaceAmPm(loc);
    case "minute":
      return formatTime(date);
    case "month":
      return date?.toLocaleDateString(lang, {
        month: "short",
      });
  }
};

export const formatDateRange = (from: Date, to: Date, today = new Date()) => {
  const sameYear = isSameYear(from, to);
  const sameMonth = isSameMonth(from, to);
  const sameDay = isSameDay(from, to);
  const thisYear = isSameYear(from, today);

  if (!sameYear) {
    return `${format(from, "LLL d, ''yy")} - ${format(to, "LLL d, ''yy")}`;
  }
  const yearSuffix = thisYear ? "" : `, ${format(to, "yyyy")}`;

  if (
    isSameMinute(startOfYear(from), from) &&
    isSameMinute(endOfYear(to), to)
  ) {
    return `${format(from, "yyyy")}`;
  }

  if (!sameMonth) {
    return `${format(from, "LLL d")} - ${format(to, "LLL d")}${yearSuffix}`;
  }

  if (
    isSameMinute(startOfMonth(from), from) &&
    isSameMinute(endOfMonth(to), to)
  ) {
    return `${format(from, "LLLL yyyy")}`;
  }

  if (!sameDay) {
    return `${format(from, "LLL d")} - ${format(to, "d")}${yearSuffix}`;
  }

  if (isSameMinute(startOfDay(from), from) && isSameMinute(endOfDay(to), to)) {
    return `${format(from, "eee, LLL d")}${yearSuffix}`;
  }

  if (isSameHour(from, to)) {
    return `${format(from, "LLL d")}, ${formatTime(from)} - ${formatTime(
      to
    )}${yearSuffix}`;
  }

  const lang = getNavigatorLanguage();
  return `${from.toLocaleDateString(lang)} - ${to.toLocaleDateString(lang)}`;
};
