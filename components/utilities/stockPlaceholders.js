const makePlaceholders = {
  toyota:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
  honda:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  nissan:
    "https://images.unsplash.com/photo-1502164980785-f8aa41d53611?auto=format&fit=crop&w=1200&q=80",
  mazda:
    "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1200&q=80",
  subaru:
    "https://images.unsplash.com/photo-1418225043143-90858d2301b4?auto=format&fit=crop&w=1200&q=80",
  suzuki:
    "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  mitsubishi:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  lexus:
    "https://images.unsplash.com/photo-1503731983530-182755f3fc2b?auto=format&fit=crop&w=1200&q=80",
  volkswagen:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
  bmw: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
};

const bodyPlaceholders = {
  suv: "https://images.unsplash.com/photo-1441148345475-03a2e82f9719?auto=format&fit=crop&w=1200&q=80",
  hatchback:
    "https://images.unsplash.com/photo-1518021960029-881541f8c0e4?auto=format&fit=crop&w=1200&q=80",
  sedan:
    "https://images.unsplash.com/photo-1549921296-3ec93abae044?auto=format&fit=crop&w=1200&q=80",
  wagon:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  truck:
    "https://images.unsplash.com/photo-1449130015084-2d48a345ae66?auto=format&fit=crop&w=1200&q=80",
  coupe:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
  van: "https://images.unsplash.com/photo-1469478715127-6d347c4a32c7?auto=format&fit=crop&w=1200&q=80",
};

const fallbackPool = [
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503731983530-182755f3fc2b?auto=format&fit=crop&w=1200&q=80",
];

export const getCarPlaceholderImage = (car = {}) => {
  const makeKey = (car.make || "").toLowerCase();
  if (makeKey && makePlaceholders[makeKey]) {
    return makePlaceholders[makeKey];
  }

  const bodyKey = (car.category || car.body_type || "").toLowerCase();
  if (bodyKey && bodyPlaceholders[bodyKey]) {
    return bodyPlaceholders[bodyKey];
  }

  const hashSource =
    car.ref_no || car.stock_no || car.id || `${car.make || ""}-${car.model || ""}`;
  const hashValue = Array.from(hashSource).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return fallbackPool[Math.abs(hashValue) % fallbackPool.length];
};
