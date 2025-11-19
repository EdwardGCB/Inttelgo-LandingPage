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
