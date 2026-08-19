import { useCallback } from "react";
import { formatNumberWithUnit } from "../utilities/numberFormat";

export const normalizeValue = (text) => {
  if (typeof text !== "string") return "";
  return text.replace(/\s+/g, " ").trim().toUpperCase();
};

export const toTitleCase = (text) => {
  const normalized = normalizeValue(text);
  if (!normalized) return "";
  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function useFormatLineItems() {
  return useCallback(
    (items) =>
      items.map((item) => {
        const makeTitle = toTitleCase(item.makerCarName);
        const modelTitle = toTitleCase(item.model);
        const descriptiveLabel = [makeTitle, modelTitle].filter(Boolean).join(" ").trim();
        const specParts = [];
        if (item.cc) specParts.push(`CC: ${formatNumberWithUnit(item.cc)}`);
        if (item.door) specParts.push(`Door: ${item.door}`);
        if (item.seat) specParts.push(`Seat: ${item.seat}`);
        if (item.shift) specParts.push(`Shift: ${item.shift}`);
        if (item.year) specParts.push(`Year: ${item.year}`);
        if (item.color) specParts.push(`Color: ${toTitleCase(item.color)}`);
        if (item.mileage) specParts.push(`Mileage: ${formatNumberWithUnit(item.mileage)}`);
        if (item.fuelType) specParts.push(`Fuel: ${toTitleCase(item.fuelType)}`);
        const combinedDescription = [descriptiveLabel, specParts.join(" | ")]
          .filter(Boolean)
          .join(" | ")
          .trim();
        return {
          ...item,
          makerCarName: makeTitle,
          model: modelTitle,
          color: toTitleCase(item.color),
          goodsDescription: combinedDescription,
        };
      }),
    []
  );
}
