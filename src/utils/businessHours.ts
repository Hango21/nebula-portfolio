import { ProfileData, DayHours } from "@/types/profile";

const DAYS: DayHours["day"][] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
};

export const isOpenAt = (profile: ProfileData, date: Date = new Date()): boolean => {
  const hours = profile.businessHours || [];
  const day = DAYS[date.getDay()];
  const entry = hours.find((h) => h.day === day);
  if (!entry || !entry.enabled) return false;
  const ranges = (entry.ranges && entry.ranges.length > 0)
    ? entry.ranges
    : [{ open: entry.open, close: entry.close }];
  const nowMin = date.getHours() * 60 + date.getMinutes();
  return ranges.some((r) => {
    const o = toMinutes(r.open);
    const c = toMinutes(r.close);
    return !Number.isNaN(o) && !Number.isNaN(c) && o < c && nowMin >= o && nowMin < c;
  });
};
