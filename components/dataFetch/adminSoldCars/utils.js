export const normalizeImagePath = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return path.startsWith("/") ? path.substring(1) : path;
};
