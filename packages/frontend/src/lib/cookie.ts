"use client";

export const getCookie = (name: string): string | undefined => {
  if (typeof window == "undefined") return undefined;

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
};
