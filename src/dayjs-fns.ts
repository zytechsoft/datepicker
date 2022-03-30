import dayjs from "dayjs";

export type Locale = {
  code?: string
};

type Interval = {
  start: Date | number
  end: Date | number
}

export function format(
  date: Date | number,
  format: string,
  options?: {
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    firstWeekContainsDate?: number
    useAdditionalWeekYearTokens?: boolean
    useAdditionalDayOfYearTokens?: boolean
  }
): string {
  // convert from date-fns to days format string
  const dayjsFormat = format
    .replace(/y/g, "Y") // year
    .replace(/d/g, "D") // day of month
    .replace("EEEEEE", "dd") // Su-Sa
    .replace("EEEEE", "dd") // S-S not supported, converted to Su-Sa
    .replace("EEEE", "dddd") // Sunday-Saturday
    .replace("EEE", "ddd") // Sun-Sat
    .replace("E", "ddd") // Sun-Sat

  if (options?.locale?.code) {
    return dayjs(date).locale(options.locale.code).format(dayjsFormat);
  }
  return dayjs(date).format(dayjsFormat);
}

export function addDays(date: Date | number, amount: number): Date {
  return dayjs(date).add(amount, "day").toDate();
}

export function subDays(date: Date | number, amount: number): Date {
  return dayjs(date).subtract(amount, "day").toDate();
}

export function addMonths(date: Date | number, amount: number): Date {
  return dayjs(date).add(amount, "month").toDate();
}

export function subMonths(date: Date | number, amount: number): Date {
  return dayjs(date).subtract(amount, "month").toDate();
}

export function startOfWeek(
  date: Date | number,
  options?: {
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }): Date {

  const weekStartsOn = options?.weekStartsOn ?? 0;

  if (options?.locale?.code) {
    return dayjs(date).locale(options.locale.code).startOf("week").add(weekStartsOn, "day").toDate();
  }

  return dayjs(date).startOf("week").add(weekStartsOn, "day").toDate();
}

export function startOfMonth(date: Date | number): Date {
  return dayjs(date).startOf("month").toDate();
}

export function endOfWeek(
  date: Date | number,
  options?: {
    locale?: Locale
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }): Date {

  return dayjs(startOfWeek(date, options)).add(7, "day").toDate();
}

export function endOfMonth(date: Date | number): Date {
  return dayjs(date).endOf("month").toDate();
}

export function isAfter(dateLeft: Date | number, dateRight: Date | number): boolean {
  return dayjs(dateLeft).isAfter(dateRight);
}

export function isBefore(dateLeft: Date | number, dateRight: Date | number): boolean {
  return dayjs(dateLeft).isBefore(dateRight);
}

export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean {
  return dayjs(dateLeft).isSame(dateRight, "day");
}

export function isSameMonth(dateLeft: Date | number, dateRight: Date | number): boolean {
  return dayjs(dateLeft).isSame(dateRight, "month");
}

export function isWeekend(date: Date | number): boolean {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
}

export function isValid(date: any | number): boolean {
  return dayjs(date).isValid();
}

export function eachDayOfInterval(interval: Interval,
  options?: {
    step?: number
  }
): Date[] {

  const step = options?.step ?? 1;
  const start = dayjs(interval.start);
  const end = dayjs(interval.end);

  const days: Date[] = [];
  const numberOfDays = end.diff(start, "day");
  for (var i = 0; i < numberOfDays; i++) {
    days.push(start.add(step * i, "day").toDate());
  }

  return days;
}
