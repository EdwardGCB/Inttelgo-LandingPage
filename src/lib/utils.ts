import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createElement } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function externalLink(text: string, url: string) {
  return createElement(
    "a",
    {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-[#ff6400] hover:text-[#d95300]",
    },
    text
  );
}

export function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (!apiUrl) {
    console.warn("VITE_API_URL is not defined");
    return "";
  }
  // Si la URL comienza con http://, reemplazarla por https://
  return apiUrl.replace(/^http:\/\//, "https://");
}
