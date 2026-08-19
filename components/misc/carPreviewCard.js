// Shared vehicle preview card — same visual/behavior used by the homepage
// featured-cars carousel (fetchStock.js) and the Popular Models showcase
// (makestypes.js), so both stay in sync automatically.
import { useCallback } from "react";
import { useRouter } from "next/router";
import { apiBaseUrl } from "../utilities/apiBase";
import { formatNumberWithUnit } from "../utilities/numberFormat";
import { getCarPriceUsd, normalizeCurrency } from "../utilities/ichinomiyaCardAdapter";

const placeholderImage = "/images/vehicles/artisbay-placeholder.svg";
const absoluteUrlPattern = /https?:\/\/[^\s"']+/gi;

const buildImagePath = (raw, apiUrl) => {
  if (!raw) return placeholderImage;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === "[]" || trimmed.toLowerCase() === "null") {
    return placeholderImage;
  }

  const absoluteMatches = [...trimmed.matchAll(absoluteUrlPattern)];
  if (absoluteMatches.length > 0) {
    return absoluteMatches[absoluteMatches.length - 1][0];
  }

  const isAbsolute = /^https?:\/\//i.test(trimmed);
  if (isAbsolute) return trimmed;
  return `${apiUrl}/${trimmed.replace(/^\//, "")}`;
};

const CarPreviewCard = ({ car }) => {
  const router = useRouter();
  const apiUrl = apiBaseUrl;

  const handleImageError = useCallback((event) => {
    const img = event?.target;
    if (!img) return;
    if (img.src.includes(placeholderImage)) return; // avoid loops
    img.onerror = null;
    img.src = placeholderImage;
  }, []);

  const handleGenerateInvoice = useCallback(
    (car) => {
      if (typeof window === "undefined") return;

      const normalizeAmount = (value) => {
        if (value === null || value === undefined) return "";
        const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
        return Number.isFinite(numeric) ? numeric : "";
      };

      const invoicePayload = {
        make: car.make || "",
        model: car.model || "",
        vehicle_ref: car.ref_no || "",
        vehicle_description: [car.year, car.make, car.model].filter(Boolean).join(" "),
        engine_capacity: car.engine_capacity || "",
        mileage: car.mileage || "",
        chasis_number: car.chassis_no || "",
        deposit_amount: normalizeAmount(car.final_value),
        deposit_currency: (car.currency || "JPY").toUpperCase(),
        deposit_purpose: "order vehicle",
        description:
          car.description ||
          `Payment for ${[car.year, car.make, car.model].filter(Boolean).join(" ")}`,
      };

      try {
        sessionStorage.setItem("invoiceData", JSON.stringify(invoicePayload));
      } catch (error) {
        console.error("Failed to cache invoice data for generator:", error);
      }

      router.push({ pathname: "/invoice-generator", query: { regenerate: "false" } });
    },
    [router]
  );

  const handleViewDetails = useCallback(
    (car) => {
      if (!car) return;
      const identifier = car.ref_no || car.id || car.stock_no || car.chassis_no;
      if (!identifier) {
        console.warn("Vehicle missing identifier", car);
        return;
      }
      const encodedId = encodeURIComponent(String(identifier).trim());
      router.push(`/vehicle/${encodedId}`);
    },
    [router]
  );

  let imagePath = placeholderImage;
  if (car.image_urls && car.image_urls !== "[]") {
    try {
      const parsedImages = JSON.parse(car.image_urls);
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        imagePath = buildImagePath(parsedImages[0], apiUrl);
      } else if (typeof car.image_urls === "string") {
        imagePath = buildImagePath(car.image_urls, apiUrl);
      }
    } catch (e) {
      console.error("Invalid image_urls format:", car.image_urls, e);
      if (typeof car.image_urls === "string") {
        imagePath = buildImagePath(car.image_urls, apiUrl);
      }
    }
  }

  return (
    <div className="relative bg-[var(--white)] shadow-md rounded-md overflow-hidden border border-[var(--border-color)] hover:shadow-lg hover:scale-[1.01] transition-all duration-300 w-full max-w-[320px] mx-auto my-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-color)] via-[var(--secondary-color)] to-[var(--accent-color)]"></div>

      <img
        src={imagePath}
        alt={`${car.make} ${car.model}`}
        className="w-full h-28 object-cover rounded-t-xl bg-gray-100"
        loading="lazy"
        onError={handleImageError}
      />

      <div className="p-2">
        <h2 className="text-sm font-semibold text-[var(--text-color)] truncate">
          {car.make} {car.model} <span className="text-[var(--grey-text)]">({car.year})</span>
        </h2>

        <p className="text-sm font-bold text-[var(--accent-color)] mb-1">
          {normalizeCurrency(car)} {getCarPriceUsd(car).toLocaleString()}
        </p>

        <div className="grid grid-cols-2 gap-y-0.5 gap-x-2 text-[11px] text-[var(--grey-text)] leading-snug">
          <p><span className="font-semibold">Ref:</span> {car.ref_no}</p>
          <p><span className="font-semibold">Cat:</span> {car.category}</p>
          <p><span className="font-semibold">Mileage:</span> {formatNumberWithUnit(car.mileage)} km</p>
          <p><span className="font-semibold">Engine:</span> {formatNumberWithUnit(car.engine_capacity)}</p>
          <p><span className="font-semibold">Fuel:</span> {car.fuel}</p>
          <p><span className="font-semibold">Drive:</span> {car.drive}</p>
        </div>
      </div>
      <div className="px-2 pb-3 flex gap-2">
        <button
          type="button"
          onClick={() => handleViewDetails(car)}
          className="w-1/2 rounded-md border border-[var(--primary-color)] py-2 text-sm font-semibold text-[var(--primary-color)] transition hover:bg-[var(--primary-color)] hover:text-white"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => handleGenerateInvoice(car)}
          className="w-1/2 rounded-md bg-[var(--primary-color)] py-2 text-sm font-semibold text-white transition hover:bg-[var(--secondary-color)]"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default CarPreviewCard;
