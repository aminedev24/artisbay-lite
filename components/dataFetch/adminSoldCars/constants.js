import { apiInventory } from '../../utilities/apiBase';
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
      <rect width="160" height="120" fill="#f3f4f6"/>
      <path d="M28 90h104L110 62l-20 22-18-22-20 28-24-30z" fill="#d1d5db"/>
      <circle cx="60" cy="46" r="11" fill="#94a3b8"/>
      <text x="50%" y="90%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">No Image</text>
    </svg>`,
  );

export const API_BASE = apiInventory;