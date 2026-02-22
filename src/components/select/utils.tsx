import React from "react";
import type { SelectOption, SelectRootProps } from "./types";
import { isTrullyEmpty } from "../../utils";

export function getTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }

  if (React.isValidElement(node)) {
    return getTextFromReactNode((node.props as any).children);
  }

  return "";
}

export function filterOption(option: SelectOption, query: string): boolean {
  if (!query) return true;

  const labelText = getTextFromReactNode(option.label);

  return labelText.toLowerCase().includes(query.toLowerCase());
}

export function highlightText(
  text: string,
  query: string,
): React.ReactNode[] | string {
  if (!query) return text;

  const words = query.split(/\s+/).filter(Boolean);
  const escapedWords = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );

  const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");
  const parts = text.split(regex);
  const lowercasedWords = words.map((w) => w.toLowerCase());

  return parts.map((part, i) => {
    if (lowercasedWords.includes(part.toLowerCase())) {
      return <mark key={i}>{part}</mark>;
    }

    return part;
  });
}

export function getDefaultValue(options: {
  defaultValue: SelectRootProps["defaultValue"];
  value: SelectRootProps["value"];
  multiple: boolean;
}) {
  const { defaultValue = "", multiple, value = "" } = options;

  if (multiple) {
    let result = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

    if (isTrullyEmpty(result)) {
      if (Array.isArray(value)) {
        result = value;
      } else {
        result = [value];
      }
    }

    return result;
  }

  return defaultValue ?? value;
}
