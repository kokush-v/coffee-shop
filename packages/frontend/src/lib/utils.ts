import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weight(weight: number): string {
  if (weight < 1000) {
    return `${weight} г.`;
  }

  const format = Number.isInteger(weight / 1000)
    ? weight / 1000
    : (weight / 1000).toFixed(1).replace(".", ",");

  return `${format} кг.`;
}
