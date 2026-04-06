import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export const PROJECT_CATEGORIES = [
  { value: "WEBSITE", label: "Website" },
  { value: "MOBILE_APP", label: "Mobile App" },
  { value: "SAAS", label: "SaaS" },
  { value: "PORTFOLIO", label: "Portfolio" },
  { value: "UI_DESIGN", label: "UI Design" },
  { value: "STARTUP_IDEA", label: "Startup Idea" },
  { value: "LANDING_PAGE", label: "Landing Page" },
  { value: "OTHER", label: "Other" },
] as const;

export const CREDIT_COSTS = {
  SUBMIT_PROJECT: -5,
  BOOST_PROJECT: -3,
  EARN_FEEDBACK: 3,
  SIGNUP_BONUS: 5,
} as const;
