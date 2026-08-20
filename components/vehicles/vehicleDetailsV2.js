// vehicleDetailsV2.js — Unified vehicle detail page
// Visual design from inc (two-column layout, equipment list, trust badges).
// Data fetching uses fetchVehicle.php (single efficient query, dynamic partner DB detection).
// Theme CSS variables used throughout for consistent branding.
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faImages,
  faShareAlt,
  faPaperPlane,
  faArrowLeft,
  faCar,
  faShip,
  faClipboardList,
  faShieldAlt,
  faCheck,
  faBan,
  faHandshake,
  faCheckCircle,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../user/userContext";
import { useFavorites, toggleFavorite } from "./useFavorites";
import { apiBaseUrl } from "../utilities/apiBase";
import { formatNumberWithUnit } from "../utilities/numberFormat";
import VehicleInquiryForm from "./vehicleInquiryForm";
import {
  normalizeCurrency,
  displayStockId,
  maskChassis,
  secureImageUrl,
  getCarPriceUsd,
  parseImageUrls,
} from "../utilities/ichinomiyaCardAdapter";

const PLACEHOLDER_IMAGE = "/images/vehicles/artisbay-placeholder.svg";
const absoluteUrlPattern = /https?:\/\/[^\s"']+/gi;
const UNKNOWN = new Set(["", "n/a", "na", "unknown", "0", "null", "undefined", "-", "--"]);
const isUnknownLike = (v) => UNKNOWN.has(String(v ?? "").trim().toLowerCase());

// Kept in sync with the partner source's full option code table (see
// ichinomiya-motors server-scripts/process_upload.php $OPTIONS_MAP) so a
// genuinely-listed feature (e.g. Rear Camera, Cruise Control) never gets
// silently dropped just because it was missing from an older, shorter list.
const EQUIPMENT_LIST = [
  'Air Bag', 'Anti-lock Brakes', 'Air Conditioner', 'Alloy Wheels', 'Power Window',
  'Power Steering', 'Power Seat', 'Power Slide Door', 'HID Light', 'Fog Light',
  'LED Light', 'Push Start', 'Steering Switch', 'Back Monitor', 'Sun Roof',
  'Glass Roof', 'Roof Rail', 'Leather Seat', 'Seat Heater', 'Back Tyre',
  'Grill Guard', 'Side Step', 'Aero Parts', 'Rear Spoiler', 'Navigation System',
  'Keyless Entry', 'Parking Sensor', 'Cruise Control', '360 Camera',
  'Electric Tailgate', 'Rear Camera', 'Lane Keep Assist', 'Pre-collision System',
  'Blind Spot Monitor', 'Adaptive Cruise', 'Auto High Beam', 'Parking Assist',
  'Wireless Charger', 'ETC', 'Dashcam',
];

const VehicleDetailsV2 = ({ initialVehicleId = "" }) => {
  const router = useRouter();
  const { id: queryId } = router.query;
  const effectiveVehicleId = queryId || initialVehicleId;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const apiUrl = apiBaseUrl;
  const imgBasePath =
    process.env.NODE_ENV === "development"
      ? "http://localhost/artisbay-next/server"
      : "/server";

  const handleImageError = useCallback((event) => {
    const img = event?.target;
    if (!img || img.src.includes(PLACEHOLDER_IMAGE)) return;
    img.onerror = null;
    img.src = PLACEHOLDER_IMAGE;
  }, []);

  const resolveImageUrl = useCallback(
    (imagePath) => {
      if (!imagePath) return PLACEHOLDER_IMAGE;
      const trimmed = String(imagePath).trim();
      if (!trimmed || trimmed === "[]" || trimmed.toLowerCase() === "null") return PLACEHOLDER_IMAGE;
      if (trimmed === PLACEHOLDER_IMAGE || trimmed.endsWith("images/vehicles/artisbay-placeholder.svg")) {
        return PLACEHOLDER_IMAGE;
      }
      const absolute = [...trimmed.matchAll(absoluteUrlPattern)];
      if (absolute.length > 0) return secureImageUrl(absolute[absolute.length - 1][0]);
      if (trimmed.startsWith("http")) return secureImageUrl(trimmed);
      const normalized = trimmed.replace(/^\/+/, "");
      const withoutServer = normalized.startsWith("server/") ? normalized.slice(7) : normalized;
      if (withoutServer.startsWith("inventory/cars/")) return `${imgBasePath}/${withoutServer}`;
      if (withoutServer.startsWith("uploads/")) return `${imgBasePath}/inventory/cars/${withoutServer}`;
      if (withoutServer.startsWith("inventory/")) return `${imgBasePath}/${withoutServer}`;
      return `${imgBasePath}/${withoutServer}`;
    },
    [imgBasePath]
  );

  useEffect(() => {
    if (!router.isReady && !initialVehicleId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`${apiUrl}/inventory/cars/fetchVehicle.php?id=${encodeURIComponent(effectiveVehicleId)}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Vehicle not found");
          throw new Error("Failed to fetch vehicle details");
        }
        return res.json();
      })
      .then((item) => {
        if (!isMounted) return;

        let imagesArray = parseImageUrls(item.image_urls);
        const sanitizedImages = Array.isArray(imagesArray)
          ? imagesArray.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean)
          : [];

        let optionsArray = parseImageUrls(item.options);

        setCar({
          ...item,
          images: sanitizedImages.length > 0 ? sanitizedImages : [PLACEHOLDER_IMAGE],
          options: Array.isArray(optionsArray) ? optionsArray : [],
        });
        setError(null);
        setActiveImageIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Vehicle details fetch failed:", err);
        setError(err.message === "Vehicle not found"
          ? "Vehicle not found in current stock."
          : "Unable to load vehicle details. Please try again."
        );
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [effectiveVehicleId, apiUrl, router.isReady, initialVehicleId]);

  const galleryImages = useMemo(() => {
    if (!car) return [];
    const sources = Array.isArray(car.images) ? car.images : [];
    const resolved = sources.map((p) => resolveImageUrl(p)).filter(Boolean);
    return resolved.length > 0 ? resolved : [PLACEHOLDER_IMAGE];
  }, [car, resolveImageUrl]);

  useEffect(() => {
    setActiveImageIndex((prev) => Math.min(prev, Math.max(galleryImages.length - 1, 0)));
  }, [galleryImages.length]);

  const nextImage = useCallback(() => {
    if (!galleryImages.length) return;
    setActiveImageIndex((p) => (p + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    if (!galleryImages.length) return;
    setActiveImageIndex((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: car ? `${car.make} ${car.model}` : "Vehicle", url }); } catch (e) {}
    } else {
      try { await navigator.clipboard.writeText(url); alert("Link copied!"); } catch (e) {}
    }
  }, [car]);

  const backToStock = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/stock-list");
    }
  }, [router]);

  const priceDisplay = useMemo(() => {
    if (!car) return "Contact us";
    const numeric = getCarPriceUsd(car);
    if (!Number.isFinite(numeric) || numeric <= 0) return "Contact us";
    return `${normalizeCurrency(car)} ${numeric.toLocaleString("en-US")}`;
  }, [car]);

  const carName = car ? [car.year, car.make, car.model].filter(Boolean).join(" ") : "";
  const bodyType = car ? car.category || car.body || "" : "";
  const carOptions = useMemo(() => (car && Array.isArray(car.options) ? car.options : []), [car]);

  const rawStatus = car ? String(car.status || car.availability || "").toLowerCase().trim() : "";
  const isSold = rawStatus === "sold" || rawStatus.startsWith("sold");
  const isReserved = rawStatus === "reserved";

  const { user } = useUser();
  const favorites = useFavorites();
  const carRef = car ? String(car.ref_no || car.stock_no || "").trim() : "";
  const isFavorite = favorites.isFavorite(carRef);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  const handleFavoriteClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (favoriteBusy || !carRef) return;
    setFavoriteBusy(true);
    await toggleFavorite(car);
    setFavoriteBusy(false);
  };

  const leftSpecs = useMemo(() => {
    if (!car) return [];
    return [
      { label: "Ref No", value: displayStockId(car) },
      { label: "Make", value: car.make },
      { label: "Model", value: car.model },
      { label: "Model Code", value: car.model_code || car.modelCode },
      { label: "Body Type", value: bodyType },
      { label: "Color", value: car.color },
      { label: "Year", value: car.year },
    ].filter((s) => !isUnknownLike(s.value));
  }, [car, bodyType]);

  const rightSpecs = useMemo(() => {
    if (!car) return [];
    return [
      { label: "Mileage", value: formatNumberWithUnit(car.mileage) || "—" },
      { label: "Engine", value: formatNumberWithUnit(car.engine_capacity) || "—" },
      { label: "Fuel", value: car.fuel },
      { label: "Transmission", value: car.transmission },
      { label: "Drive", value: car.drive || car.drive_train },
      { label: "Steering", value: car.steering },
      { label: "Seats", value: car.seat },
      { label: "Doors", value: car.door },
      { label: "Chassis", value: maskChassis(car.chassis_no || car.chassis || car.chassisNo || car.frame_no || car.vin_number) },
    ].filter((s) => !isUnknownLike(s.value));
  }, [car]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--background-color)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--primary-color)]/20 border-t-[var(--accent-color)]" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-color)]">
            Loading vehicle...
          </p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--background-color)] px-4">
        <div className="max-w-md rounded-lg border border-[var(--border-color)] bg-[var(--white)] p-8 text-center shadow-sm">
          <FontAwesomeIcon icon={faCar} className="mb-3 text-4xl text-gray-300" />
          <p className="text-lg font-bold text-[var(--text-color)]">
            {error || "Unable to locate this vehicle."}
          </p>
          <button
            type="button"
            onClick={backToStock}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[var(--primary-color-hover)]"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Stocklist
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--background-color)] py-5">
        <div className="mx-auto w-full max-w-[1280px] px-4">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--grey-text)]">
            <button onClick={() => router.push("/")} className="hover:text-[var(--primary-color)]">
              HOME
            </button>
            <span>/</span>
            <button onClick={backToStock} className="hover:text-[var(--primary-color)]">
              STOCK
            </button>
            {car.make && (
              <>
                <span>/</span>
                <button
                  onClick={() => router.push(`/stock-list?make=${encodeURIComponent(car.make)}`)}
                  className="uppercase hover:text-[var(--primary-color)]"
                >
                  {car.make}
                </button>
              </>
            )}
            <span>/</span>
            <span className="font-medium text-[var(--text-color)]">{carName}</span>
          </nav>

          {/* Main two-column block */}
          <div className="mb-4 flex flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--white)] shadow-sm lg:flex-row">
            {/* LEFT: gallery */}
            <div className="shrink-0 border-[var(--border-color)] lg:w-[52%] lg:border-r">
              <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: "16 / 9" }}>
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`${carName} photo ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover object-top"
                  onError={handleImageError}
                />
                {isSold && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55">
                    <div className="flex items-center gap-1.5 rounded bg-red-700 px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg">
                      <FontAwesomeIcon icon={faBan} className="text-[10px]" /> Sold
                    </div>
                  </div>
                )}
                {isReserved && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55">
                    <div className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      Under Negotiation
                    </div>
                  </div>
                )}
                <span
                  className="pointer-events-none absolute bottom-2 left-3 z-10 select-none text-xs font-semibold uppercase tracking-wider text-gray-200/80"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                >
                  Meridian Motors
                </span>
                {bodyType && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-color)] shadow-sm">
                    {bodyType}
                  </span>
                )}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/65"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/65"
                    >
                      <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    </button>
                    <span className="absolute bottom-2 right-3 z-10 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold text-white">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </span>
                  </>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-1 overflow-x-auto border-t border-[var(--border-color)] bg-[var(--background-color)] px-2 py-2">
                  {galleryImages.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-[54px] w-[72px] shrink-0 overflow-hidden rounded border-2 transition ${
                        i === activeImageIndex
                          ? "border-[var(--primary-color)]"
                          : "border-transparent hover:border-[var(--border-color)]"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-[var(--border-color)] bg-[var(--white)] px-3 py-2 text-xs text-[var(--grey-text)]">
                <span>
                  <FontAwesomeIcon icon={faImages} className="mr-1" />
                  {galleryImages.length} photo{galleryImages.length === 1 ? "" : "s"}
                </span>
                <button onClick={handleShare} className="ml-auto flex items-center gap-1 transition hover:text-[var(--primary-color)]">
                  <FontAwesomeIcon icon={faShareAlt} /> Share
                </button>
              </div>
            </div>

            {/* RIGHT: info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="border-b border-[var(--border-color)] px-5 pb-3 pt-5">
                {isSold && (
                  <span className="mb-1 inline-block rounded border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                    Sold
                  </span>
                )}
                {isReserved && (
                  <span className="mb-1 inline-block rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Under Negotiation
                  </span>
                )}
                <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide text-[var(--primary-color)]">
                  {carName}
                </h1>
                <p className="mt-1 font-mono text-sm text-[var(--grey-text)]">Ref No #{displayStockId(car)}</p>
              </div>

              {isSold && (
                <div className="mx-5 mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <FontAwesomeIcon icon={faCheckCircle} className="shrink-0 text-lg text-red-500" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-red-700">Sold</p>
                    <p className="mt-0.5 text-[11px] text-red-600">
                      This vehicle has been sold. Contact us to find a similar one.
                    </p>
                  </div>
                </div>
              )}
              {isReserved && (
                <div className="mx-5 mt-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <FontAwesomeIcon icon={faHandshake} className="shrink-0 text-lg text-amber-500" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                      Under Negotiation
                    </p>
                    <p className="mt-0.5 text-[11px] text-amber-700">
                      This vehicle is currently being negotiated. Contact us for availability.
                    </p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="border-b border-[var(--border-color)] px-5 py-4">
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--grey-text)]">
                  Vehicle Price (FOB Japan)
                </p>
                {isSold || isReserved ? (
                  <div className="text-3xl font-extrabold italic leading-none tracking-tight text-[var(--grey-text)]">
                    Price on request
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold leading-none tracking-tight text-[var(--primary-color)]">
                    {priceDisplay}
                  </div>
                )}
                {!isSold && !isReserved && (
                  <p className="mt-1 text-[11px] text-[var(--grey-text)]">
                    Approx., excludes freight &amp; insurance
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 border-b border-[var(--border-color)] px-5 py-4">
                <button
                  onClick={() => document.getElementById("request-now-panel")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-color)] py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[var(--accent-color-hover)]"
                >
                  <FontAwesomeIcon icon={faPaperPlane} /> Request Now
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      isFavorite
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-[var(--primary-color)] bg-[var(--white)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} className={isFavorite ? "text-red-500" : ""} />
                    {isFavorite ? "Saved" : "Add to Favorites"}
                  </button>
                  <button
                    onClick={backToStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[var(--primary-color)] bg-[var(--white)] py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--primary-color)] transition hover:bg-[var(--primary-color)] hover:text-white"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Stock
                  </button>
                </div>
              </div>

              {/* Specs — two columns */}
              <div className="border-b border-[var(--border-color)] px-5 py-4">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--grey-text)]">
                  Vehicle Information
                </h4>
                <div className="flex gap-0 text-xs">
                  <dl className="min-w-0 flex-1">
                    {leftSpecs.map(({ label, value }) => (
                      <div key={label} className="flex flex-col border-b border-gray-50 py-1.5 sm:flex-row">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--grey-text)] sm:w-24 sm:shrink-0">
                          {label}
                        </dt>
                        <dd className="truncate font-medium text-[var(--text-color)]" title={String(value)}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mx-3 w-px bg-[var(--border-color)]" />
                  <dl className="min-w-0 flex-1">
                    {rightSpecs.map(({ label, value }) => (
                      <div key={label} className="flex flex-col border-b border-gray-50 py-1.5 sm:flex-row">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--grey-text)] sm:w-24 sm:shrink-0">
                          {label}
                        </dt>
                        <dd className="truncate font-medium text-[var(--text-color)]" title={String(value)}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Option / Equipment */}
              <div className="border-b border-[var(--border-color)] px-5 py-4">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--grey-text)]">
                  Option / Equipment
                </h4>
                <div className="grid grid-cols-3 gap-1.5 text-xs sm:grid-cols-5">
                  {EQUIPMENT_LIST.filter((item) => carOptions.includes(item)).map((item) => (
                    <div
                      key={item}
                      className="rounded border px-2 py-1.5 text-center font-medium border-[var(--primary-color)] bg-[var(--white)] text-[var(--primary-color)]"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-1 text-[9px] text-[var(--accent-color)]" />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mt-3">
                  {carOptions.length === 0
                    ? "* Equipment data not available for this vehicle — contact us to confirm specific features."
                    : "* List reflects features noted on the seller's inspection sheet and may not be exhaustive — contact us to confirm any specific feature."}
                </p>
              </div>

              {/* Trust badges */}
              <div className="space-y-2 px-5 py-4">
                {[
                  { icon: faShieldAlt, text: "Pre-export inspection available" },
                  { icon: faClipboardList, text: "Export documents handled end to end" },
                  { icon: faShip, text: "Worldwide RoRo / container shipping" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-[var(--grey-text)]">
                    <FontAwesomeIcon icon={b.icon} className="shrink-0 text-[var(--accent-color)]" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
			<i className="fas fa-exclamation-triangle text-amber-500 text-sm mt-0.5 shrink-0"></i>
			<div className="text-[11px] text-amber-700 leading-relaxed space-y-1">
			<p>Prices are approximate FOB Japan and exclude freight, insurance, and import duties.</p>
			<p>Vehicles are listed online and viewed by many buyers daily; reservation alone does not guarantee availability until your payment is reflected in our account.</p>
			<p>If the vehicle is unavailable when your payment is reflected, we will offer a similar unit or process a refund based on your decision.</p>
			<p>Please verify import regulations for your country before ordering.</p>
			</div>
			</div>

          {/* Request band */}
          <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-[var(--border-color)] bg-[var(--white)] px-6 py-5 shadow-sm sm:flex-row">
            <div className="flex items-center gap-4">
              <img
                src={galleryImages[0]}
                alt={carName}
                className="h-[60px] w-20 shrink-0 rounded border border-[var(--border-color)] object-cover"
                onError={handleImageError}
              />
              <div>
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--grey-text)]">
                  Ref #{displayStockId(car)}
                </p>
                <p className="font-bold text-[var(--primary-color)]">{carName}</p>
                <p className="text-sm text-[var(--grey-text)]">
                  {isSold || isReserved ? "Price on request" : priceDisplay}{" "}
                  {!isSold && !isReserved && (
                    <span className="text-[10px] uppercase tracking-wider text-[var(--grey-text)]">FOB Japan</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-color)]/10 px-8 py-3 text-sm font-bold uppercase tracking-widest text-[var(--accent-color)] sm:w-auto">
              <FontAwesomeIcon icon={faPaperPlane} /> Request this vehicle below
            </div>
          </div>

          {/* Inquiry */}
          <div id="request-now-panel" className="mb-8">
            <VehicleInquiryForm car={car} />
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailsV2;
