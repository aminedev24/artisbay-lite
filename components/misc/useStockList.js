"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiInventory } from '../utilities/apiBase';
import { getCarPlaceholderImage } from "../utilities/stockPlaceholders";
import { parseImageUrls } from "../utilities/ichinomiyaCardAdapter";
import useExchangeRate from '../dataFetch/useExchangeRate';
import {
  defaultFilterState, controlledFilterKeys, KEYWORD_ALIASES,
  PAGE_SIZE_OPTIONS, filterOptions,
} from "./stockConstants";

function applyAliases(query) {
  let q = query.toLowerCase().trim();
  for (const [alias, replacement] of Object.entries(KEYWORD_ALIASES)) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\b' + escaped + '\\b', 'g');
    q = q.replace(re, replacement);
  }
  return q;
}

function buildSearchStr(car) {
  const parts = [
    car.name, car.make, car.model, car.grade, car.year,
    car.body, car.category, car.fuel, car.color, car.ref_no,
    car.chassis_no, car.engine_capacity, car.transmission,
    car.drive, car.steering,
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

function normalizeText(value) {
  if (typeof value === "string") return value.toLowerCase().trim();
  if (value != null) return String(value).toLowerCase().trim();
  return "";
}

function parsePrice(price) {
  if (!price) return 0;
  return Number(String(price).replace(/[^0-9.]/g, '')) || 0;
}

function isPartnerStock(car) {
  return String(car?.company || "").toLowerCase() === "ichinomiya_import";
}

function toUsd(rawPrice, car, rate) {
  const num = parsePrice(rawPrice);
  if (!num) return 0;
  if (isPartnerStock(car)) return num;
  const cur = (car?.currency || "JPY").toUpperCase();
  if (cur === "USD") return num;
  if (cur === "JPY" && rate > 0) return num / rate;
  return num;
}

function secureImg(url) {
  return typeof url === 'string' ? url.replace(/^http:\/\//i, 'https://') : url;
}

export default function useStockList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSyncDone = useRef(false);

  const apiUrl = apiInventory;
  const imgBasePath = `${apiUrl}/cars`;
  const { usdToYenRate } = useExchangeRate();

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(true);

  const [filters, setFilters] = useState(() => {
    const initial = { ...defaultFilterState };
    for (const key of controlledFilterKeys) {
      const val = searchParams.get(key);
      if (val) initial[key] = val;
    }
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page'), 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [carsPerPage, setCarsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('newest');
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableBodyTypes, setAvailableBodyTypes] = useState([]);
  const [heroStats, setHeroStats] = useState([]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  // Fetch cars from API
  useEffect(() => {
    setLoading(true);
    setViewLoading(true);
    fetch(`${apiUrl}/cars/fetchStock.php`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((car) => {
          const sanitizedImages = parseImageUrls(car.image_urls);
          return {
            ...car,
            ref: car.ref_no || car.id || '',
            name: [car.year, car.make, car.model].filter(Boolean).join(' '),
            body: car.category || car.body_type || '',
            cc: car.engine_capacity || '',
            trans: car.transmission || '',
            img: sanitizedImages.length > 0 ? secureImg(sanitizedImages[0]) : getCarPlaceholderImage(car),
            images: sanitizedImages.length > 0 ? sanitizedImages.map(secureImg) : [getCarPlaceholderImage(car)],
            price_usd: toUsd(car.final_value || car.price, car, usdToYenRate),
            price: car.final_value || car.price || '',
            chassis: car.chassis_no || '',
            mileage: car.mileage || '',
          };
        });
        setAllCars(normalized);
        setLoading(false);
        setTimeout(() => setViewLoading(false), 800);
      })
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setLoading(false);
        setTimeout(() => setViewLoading(false), 800);
      });
  }, [apiUrl, usdToYenRate]);

  // Derive available options from loaded cars
  useEffect(() => {
    const makesSet = new Set();
    const bodySet = new Set();
    let ready = 0;
    let arrivals = 0;
    allCars.forEach((car) => {
      if (car.make) makesSet.add(car.make);
      if (car.body) bodySet.add(car.body);
      if (car.ship_date) {
        const d = new Date(car.ship_date);
        const now = new Date();
        if (!Number.isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          arrivals++;
        }
      }
      if (car.status === 'ready' || car.ship_status === 'ready') ready++;
    });
    setAvailableMakes(Array.from(makesSet).sort((a, b) => a.localeCompare(b)));
    setAvailableBodyTypes(Array.from(bodySet).sort((a, b) => a.localeCompare(b)));
    setHeroStats([
      { label: "Ready to ship", value: ready, subLabel: "inspected units", icon: "faShip" },
      { label: "Fresh arrivals", value: arrivals, subLabel: "this month", icon: "faCalendarCheck" },
      { label: "Vehicles listed", value: allCars.length, subLabel: "all stock", icon: "faCarSide" },
    ]);
  }, [allCars]);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, val]) => val !== defaultFilterState[key]) || !!searchTerm;
  }, [filters, searchTerm]);

  // Filter cars
  const filteredCars = useMemo(() => {
    if (loading) return [];
    const lowerQuery = searchTerm.trim().toLowerCase();
    const chassisQuery = (filters.chassis || '').trim().toLowerCase();
    const minPriceValue = parsePrice(filters.minPrice);
    const maxPriceValue = parsePrice(filters.maxPrice);
    const yearFromValue = filters.yearFrom === 'Any' ? null : Number(filters.yearFrom);
    const yearToValue = filters.yearTo === 'Any' ? null : Number(filters.yearTo);
    const mileageFilter = filters.mileage;

    return allCars.filter((car) => {
      const searchable = (lowerQuery || chassisQuery) ? buildSearchStr(car) : '';

      if (lowerQuery) {
        const normalizedQuery = applyAliases(lowerQuery);
        const tokens = normalizedQuery.trim().split(/\s+/).filter(Boolean);
        if (!tokens.every(t => searchable.includes(t))) return false;
      }
      if (chassisQuery && !searchable.includes(chassisQuery)) return false;
      if (filters.make !== 'All Makes' && normalizeText(car.make) !== normalizeText(filters.make)) return false;
      if (filters.model !== 'All Models' && !normalizeText(car.model).includes(normalizeText(filters.model))) return false;
      if (filters.bodyType !== 'All Types' && car.body !== filters.bodyType) return false;
      if (filters.fuel !== 'All' && normalizeText(car.fuel) !== normalizeText(filters.fuel)) return false;
      if (filters.transmission !== 'All' && normalizeText(car.transmission) !== normalizeText(filters.transmission)) return false;
      if (filters.steering !== 'All' && car.steering && !normalizeText(car.steering).includes(normalizeText(filters.steering))) return false;
      if (filters.grade !== 'All' && normalizeText(car.grade) !== normalizeText(filters.grade)) return false;

      const priceValue = car.price_usd || 0;
      if (filters.minPrice !== 'No Min' && priceValue < minPriceValue) return false;
      if (filters.maxPrice !== 'No Max' && priceValue > maxPriceValue) return false;

      const yearValue = Number(car.year) || 0;
      if (yearFromValue !== null && yearValue < yearFromValue) return false;
      if (yearToValue !== null && yearValue > yearToValue) return false;

      if (mileageFilter !== 'All') {
        const m = parseInt(car.mileage) || 0;
        if (mileageFilter === 'under30k' && (m >= 30000 || !m)) return false;
        if (mileageFilter === 'under50k' && (m >= 50000 || !m)) return false;
        if (mileageFilter === 'under80k' && (m >= 80000 || !m)) return false;
        if (mileageFilter === 'under100k' && (m >= 100000 || !m)) return false;
        if (mileageFilter === 'over100k' && m <= 100000) return false;
      }

      return true;
    });
  }, [allCars, filters, searchTerm, loading]);

  // Sort cars
  const sortedCars = useMemo(() => {
    const arr = [...filteredCars];
    switch (sortBy) {
      case 'price_asc': return arr.sort((a, b) => (a.price_usd || 0) - (b.price_usd || 0));
      case 'price_desc': return arr.sort((a, b) => (b.price_usd || 0) - (a.price_usd || 0));
      case 'year_new': return arr.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
      case 'year_old': return arr.sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0));
      case 'mileage_asc': return arr.sort((a, b) => (parseInt(a.mileage) || Infinity) - (parseInt(b.mileage) || Infinity));
      case 'mileage_desc': return arr.sort((a, b) => (parseInt(b.mileage) || -1) - (parseInt(a.mileage) || -1));
      default: return arr;
    }
  }, [filteredCars, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedCars.length / carsPerPage));

  const paginatedCars = useMemo(() => {
    const start = (page - 1) * carsPerPage;
    return sortedCars.slice(start, start + carsPerPage);
  }, [sortedCars, page, carsPerPage]);

  // Sync filters to URL
  useEffect(() => {
    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      return;
    }

    const params = new URLSearchParams();
    params.set('page', String(page));
    for (const key of controlledFilterKeys) {
      if (filters[key] !== defaultFilterState[key]) params.set(key, filters[key]);
    }
    if (searchTerm) params.set('search', searchTerm);
    if (carsPerPage !== 12) params.set('perPage', String(carsPerPage));

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState({ ...window.history.state, url: newUrl }, '', newUrl);
  }, [page, filters, searchTerm, carsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm, carsPerPage, sortBy]);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 300);
    }
  }, [page]);

  // View loading state
  useEffect(() => {
    if (loading) { setViewLoading(true); return; }
    setViewLoading(true);
    const timer = setTimeout(() => setViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [loading, page]);

  const visiblePageNumbers = useMemo(() => {
    const total = totalPages;
    const maxButtons = 5;
    if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(maxButtons / 2);
    let start = page - half;
    let end = page + half;
    if (start < 1) { start = 1; end = start + maxButtons - 1; }
    if (end > total) { end = total; start = end - maxButtons + 1; }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  // Navigation handlers
  const handleViewDetails = useCallback((car) => {
    if (!car) return;
    const identifier = car.ref_no || car.id || car.stock_no;
    if (!identifier) return;
    router.push(`/vehicle?id=${encodeURIComponent(String(identifier).trim())}`);
  }, [router]);

  const handleCarClick = useCallback((car) => {
    window.open(`/vehicle?id=${encodeURIComponent(String(car.ref_no || car.id || ''))}`, '_blank', 'noopener');
  }, []);

  const handleRequestInvoice = useCallback((car) => {
    if (typeof window === "undefined") return;
    const normalizeAmount = (value) => {
      if (value === null || value === undefined) return "";
      const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
      return Number.isFinite(numeric) ? numeric : "";
    };
    const invoicePayload = {
      make: car.make || "",
      model: car.model || "",
      vehicle_ref: car.ref_no || car.id || "",
      vehicle_description: [car.year, car.make, car.model].filter(Boolean).join(" "),
      engine_capacity: car.engine_capacity || "",
      mileage: car.mileage || "",
      chasis_number: car.chassis_no || car.chassisNumber || car.chassis || car.vin_number || "",
      deposit_amount: normalizeAmount(car.final_value ?? car.price),
      deposit_currency: (String(car?.company || "").toLowerCase() === "ichinomiya_import" ? "USD" : car.currency || 'JPY').toUpperCase(),
      deposit_purpose: "order vehicle",
      description: `Payment for ${[car.year, car.make, car.model].filter(Boolean).join(" ")}`,
    };
    const payloadString = JSON.stringify(invoicePayload);
    try { sessionStorage.setItem("invoiceData", payloadString); } catch (e) {}
    try { localStorage.setItem("invoiceData", payloadString); } catch (e) {}
    const targetUrl = "/invoice-generator?regenerate=false";
    const opened = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (!opened) router.push(targetUrl);
  }, [router]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    if (e) e.preventDefault();
  }, []);

  const clearFilter = useCallback((key) => {
    if (key === 'search') { setSearchTerm(''); return; }
    setFilters((prev) => ({
      ...prev,
      [key]: defaultFilterState[key],
      ...(key === 'make' ? { model: 'All Models' } : {}),
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ ...defaultFilterState });
    setSearchTerm('');
    setPage(1);
  }, []);

  const handleQuickFilter = useCallback((key, value) => {
    setFilters({ ...defaultFilterState, [key]: value });
    setSearchTerm('');
    setPage(1);
  }, []);

  const goToPage = useCallback((p) => {
    const next = Math.min(Math.max(p, 1), totalPages);
    setPage(next);
    setViewLoading(true);
    setTimeout(() => setViewLoading(false), 300);
  }, [totalPages]);

  const handlePageSizeChange = useCallback((value) => {
    setCarsPerPage(Number(value));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const skeletonCount = Math.max(carsPerPage, 6);

  const renderSkeletonCard = (key) => (
    <div key={`skel-${key}`} className="rounded-lg border border-[var(--border-color)] bg-[var(--white)] p-2 shadow-sm">
      <div className="mb-2 h-24 rounded bg-gray-200 animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-2/3 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <div className="h-2 rounded bg-gray-200 animate-pulse" /><div className="h-2 rounded bg-gray-200 animate-pulse" />
        <div className="h-2 rounded bg-gray-200 animate-pulse" /><div className="h-2 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <div className="h-6 rounded bg-gray-200 animate-pulse" /><div className="h-6 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );

  const activeFilterTags = useMemo(() => {
    const tags = [];
    if (filters.make !== 'All Makes') tags.push({ key: 'make', label: 'Make', value: filters.make });
    if (filters.model !== 'All Models') tags.push({ key: 'model', label: 'Model', value: filters.model });
    if (filters.bodyType !== 'All Types') tags.push({ key: 'bodyType', label: 'Type', value: filters.bodyType });
    if (filters.fuel !== 'All') tags.push({ key: 'fuel', label: 'Fuel', value: filters.fuel });
    if (filters.transmission !== 'All') tags.push({ key: 'transmission', label: 'Trans', value: filters.transmission });
    if (filters.steering !== 'All') tags.push({ key: 'steering', label: 'Steering', value: filters.steering });
    if (filters.yearFrom !== 'Any') tags.push({ key: 'yearFrom', label: 'From', value: filters.yearFrom });
    if (filters.yearTo !== 'Any') tags.push({ key: 'yearTo', label: 'To', value: filters.yearTo });
    if (filters.minPrice !== 'No Min') tags.push({ key: 'minPrice', label: 'Min', value: filters.minPrice });
    if (filters.maxPrice !== 'No Max') tags.push({ key: 'maxPrice', label: 'Max', value: filters.maxPrice });
    if (filters.grade !== 'All') tags.push({ key: 'grade', label: 'Grade', value: filters.grade });
    if (filters.mileage !== 'All') tags.push({ key: 'mileage', label: 'Mileage', value: filters.mileage });
    if (filters.chassis) tags.push({ key: 'chassis', label: 'Chassis', value: filters.chassis });
    if (searchTerm) tags.push({ key: 'search', label: 'Search', value: `"${searchTerm}"` });
    return tags;
  }, [filters, searchTerm]);

  return {
    allCars,
    loading,
    viewLoading,
    searchTerm,
    setSearchTerm,
    page,
    sortBy,
    sortedCars,
    paginatedCars,
    totalPages,
    visiblePageNumbers,
    availableMakes,
    availableBodyTypes,
    heroStats,
    hasActiveFilters,
    numberFormatter,
    imgBasePath,
    carsPerPage,
    skeletonCount,
    renderSkeletonCard,
    filters,
    activeFilterTags,
    handleViewDetails,
    handleCarClick,
    handleRequestInvoice,
    handleSearchSubmit,
    handleResetFilters: clearAllFilters,
    handleFilterChange,
    clearFilter,
    clearAllFilters,
    handleQuickFilter,
    goToPage,
    handlePageSizeChange,
    handleSortChange,
    setSortBy,
    updateFilters: (updates) => { Object.entries(updates).forEach(([k, v]) => handleFilterChange(k, v)); },
  };
}
