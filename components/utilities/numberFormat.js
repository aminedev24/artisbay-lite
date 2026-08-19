export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(String(value).replace(/,/g, ''));
  return Number.isNaN(num) ? String(value) : num.toLocaleString();
};

export const formatNumberWithUnit = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const match = String(value).trim().match(/^(-?[\d,.]+)\s*([^\d\s.,-].*)?$/);
  if (!match) return String(value);
  const num = Number(match[1].replace(/,/g, ''));
  if (Number.isNaN(num)) return String(value);
  const unit = match[2] ? ` ${match[2].trim()}` : '';
  return `${num.toLocaleString()}${unit}`;
};
