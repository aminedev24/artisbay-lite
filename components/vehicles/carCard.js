// carCard.js  Unified vehicle card
// Visual design from inc (FontAwesome icons, specs bar, two-button layout).
// Theme CSS variables used throughout for consistent branding.
// Compact layout mirrors the Ichinomiya marketplace CarGrid: fixed-height
// thumbnail, tiny uppercase text, single-row spec line and one action button.
import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faCalendarAlt, faGasPump, faTachometerAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useUser } from '../user/userContext';
import { useFavorites, toggleFavorite } from './useFavorites';
import { getCarPriceUsd, normalizeCurrency, secureImageUrl } from '../utilities/ichinomiyaCardAdapter';
import { formatNumberWithUnit } from '../utilities/numberFormat';

const PLACEHOLDER_IMAGE = '/images/vehicles/artisbay-placeholder.svg';

const absoluteUrlPattern = /https?:\/\/[^\s"']+/gi;
const escapedAbsoluteUrlPattern = /https?:\\\/\\\/[^\s"']+/gi;

const parseImageCandidates = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed || trimmed === '[]' || trimmed.toLowerCase() === 'null') return [];

  // Most partner rows store image_urls as a JSON string.
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean);
    }
  } catch (error) {
    // Fall through to regex extraction below.
  }

  const absoluteMatches = [...trimmed.matchAll(absoluteUrlPattern)].map((match) => match[0]);
  if (absoluteMatches.length > 0) return absoluteMatches;

  const escapedMatches = [...trimmed.matchAll(escapedAbsoluteUrlPattern)]
    .map((match) => match[0].replace(/\\\//g, '/'));
  if (escapedMatches.length > 0) return escapedMatches;

  return [trimmed];
};

const CarCard = ({ car, imgBasePath, onViewDetails, onRequestInvoice }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const favorites = useFavorites();
  const isFavorite = favorites.isFavorite(car.ref_no || car.stock_no || "");
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const make = car.make || "N/A";
  const model = car.model || "Model N/A";
  const priceAmount = getCarPriceUsd(car);
  const currency = normalizeCurrency(car);
  const price = priceAmount > 0 ? `${currency} ${priceAmount.toLocaleString()}` : "Price TBD";
  const year = car.year || "N/A";
  const mileage = formatNumberWithUnit(car.mileage) || "N/A";
  const fuel = car.fuel || "N/A";
  const transmission = car.transmission || "N/A";
  const cc = formatNumberWithUnit(car.engine_capacity || car.engineCapacity || car.cc || car.engine) || "N/A";
  const category = car.category || car.body || car.shape || car.body_type || car.type || "N/A";

  const rawStatus = String(car.status || car.availability || "").toLowerCase().trim();
  const isSold = rawStatus === "sold" || rawStatus.startsWith("sold");
  const isReserved = rawStatus === "reserved";

  const mainImageUrl = useMemo(() => {
    const base = (imgBasePath || "").replace(/\/+$/, "");
    const isDummyUrl = (url) => /images\.unsplash\.com/i.test(url);

    const candidates = [
      ...parseImageCandidates(car.images),
      ...parseImageCandidates(car.image_urls),
    ];
    let candidate = candidates[0] || null;
    if (!candidate) return PLACEHOLDER_IMAGE;

    const trimmed = String(candidate).trim();
    if (!trimmed || trimmed === "[]" || trimmed.toLowerCase() === "null") return PLACEHOLDER_IMAGE;

    const absoluteMatch = [...trimmed.matchAll(absoluteUrlPattern)].pop();
    if (absoluteMatch) {
      const absoluteUrl = absoluteMatch[0];
      return isDummyUrl(absoluteUrl) ? PLACEHOLDER_IMAGE : secureImageUrl(absoluteUrl);
    }

    const normalized = trimmed.replace(/^\//, "");
    if (!base) return `/${normalized}`;
    return `${base}/${normalized}`;
  }, [car.images, car.image_urls, imgBasePath]);

  useEffect(() => { setImageLoaded(false); }, [mainImageUrl]);

  const handleFavoriteClick = async (event) => {
    event.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    if (favoriteBusy) return;
    setFavoriteBusy(true);
    await toggleFavorite(car);
    setFavoriteBusy(false);
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (event) => {
    setImageLoaded(true);
    const img = event?.target;
    if (img && img.src.indexOf(PLACEHOLDER_IMAGE) === -1) {
      img.onerror = null;
      img.src = PLACEHOLDER_IMAGE;
    }
  };

  return (
    <div className="flex h-full flex-col bg-[var(--white)] rounded border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

      {/* Image Section */}
      <div className="relative h-32 overflow-hidden cursor-pointer" onClick={() => onViewDetails && onViewDetails(car)}>
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" aria-hidden="true" />}
        <img
          src={mainImageUrl}
          alt={`${make} ${model}`}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <span className="absolute top-0 left-0 bg-[var(--primary-color)] text-white text-[9px] font-extrabold px-2 py-0.5 tracking-wider">
          {year}
        </span>
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
          className={`absolute top-0 right-0 z-20 flex h-7 w-7 items-center justify-center rounded-bl-lg border-b border-l border-[var(--border-color)] bg-white/95 transition ${
            isFavorite ? "text-red-500" : "text-[var(--grey-text)] hover:text-[var(--primary-color)]"
          }`}
        >
          <FontAwesomeIcon icon={faHeart} className={`h-3.5 w-3.5 ${isFavorite ? "text-red-500" : ""}`} />
        </button>
        {isSold && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/65">
            <div className="rounded bg-red-700 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
              Sold
            </div>
          </div>
        )}
        {isReserved && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55">
            <div className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Under Negotiation
            </div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-[11px] font-extrabold text-[var(--text-color)] uppercase truncate leading-tight cursor-pointer" onClick={() => onViewDetails && onViewDetails(car)}>
          {make} {model}
        </h3>
        {isSold || isReserved ? (
          <div className="mt-0.5 text-[13px] font-extrabold italic text-[var(--grey-text)]">Price on request</div>
        ) : (
          <div className="mt-0.5 text-[15px] font-extrabold text-[var(--accent-color)]">
            {price} {priceAmount > 0 && <small className="text-[9px] text-gray-500 font-normal">FOB</small>}
          </div>
        )}
        <div className="mt-1.5 flex justify-between text-[9px] text-[var(--grey-text)] uppercase font-bold border-t border-[var(--border-color)] pt-1.5">
          <span className="flex items-center gap-0.5"><FontAwesomeIcon icon={faGaugeHigh} className="w-2.5 h-2.5 text-[var(--accent-color)]" />{cc}</span>
          <span className="flex items-center gap-0.5"><FontAwesomeIcon icon={faTachometerAlt} className="w-2.5 h-2.5 text-[var(--accent-color)]" />{mileage}km</span>
          <span className="flex items-center gap-0.5"><FontAwesomeIcon icon={faGasPump} className="w-2.5 h-2.5 text-[var(--accent-color)]" />{fuel}</span>
          <span className="flex items-center gap-0.5"><FontAwesomeIcon icon={faCalendarAlt} className="w-2.5 h-2.5 text-[var(--accent-color)]" />{transmission}</span>
        </div>
        <span className="mt-1 text-[9px] text-gray-400">{car.ref_no || car.stock_no || ""}</span>

        <button
          type="button"
          onClick={() => onViewDetails(car)}
          className="mt-2 border border-[var(--primary-color)] bg-white text-[var(--primary-color)] py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded hover:bg-[var(--primary-color)] hover:text-white transition"
        >
          View Details
        </button>
        {typeof onRequestInvoice === "function" && (
          <button
            type="button"
            onClick={() => onRequestInvoice(car)}
            className="mt-1 border border-[var(--primary-color)] bg-[var(--primary-color)] text-white py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded hover:bg-[var(--primary-color-hover)] transition"
          >
            Request Invoice
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCard;
