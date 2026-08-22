// inventoryConsole.js — homepage hero replacement.
// Was a photo slider + a separate multi-field search form + a static
// make/body-type grid. This replaces all three with one dense "search the
// live inventory" panel (counts computed from the same stock feed the
// listing page uses), matching the auction/inventory-platform direction the
// client asked for instead of a marketing-style hero banner.
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { apiInventory } from "../utilities/apiBase";
import { getCarBodyType, getCarMake } from "../utilities/ichinomiyaCardAdapter";

const BUDGETS = [
  { label: "Under $10,000", minPrice: "", maxPrice: "10000" },
  { label: "$10,000 – $20,000", minPrice: "10000", maxPrice: "20000" },
  { label: "$20,000 – $40,000", minPrice: "20000", maxPrice: "40000" },
  { label: "$40,000 – $75,000", minPrice: "40000", maxPrice: "75000" },
  { label: "$75,000+", minPrice: "75000", maxPrice: "" },
];

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const InventoryConsole = () => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetch(`${apiInventory}/cars/fetchStock.php`)
      .then((res) => res.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .catch(() => setCars([]));
  }, []);

  const makesWithCounts = useMemo(() => {
    const map = new Map();
    cars.forEach((car) => {
      const name = getCarMake(car);
      if (!name) return;
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [cars]);

  const bodyTypesWithCounts = useMemo(() => {
    const map = new Map();
    cars.forEach((car) => {
      const name = getCarBodyType(car);
      if (!name) return;
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [cars]);

  const budgetsWithCounts = useMemo(() => {
    return BUDGETS.map((b) => {
      const min = b.minPrice ? Number(b.minPrice) : -Infinity;
      const max = b.maxPrice ? Number(b.maxPrice) : Infinity;
      const count = cars.filter((car) => {
        const p = Number(car.final_value ?? car.price ?? 0);
        return p >= min && p <= max;
      }).length;
      return { ...b, count };
    });
  }, [cars]);

  const goToMake = (name) => router.push(`/stock-list?make=${encodeURIComponent(name)}`);
  const goToBodyType = (name) => router.push(`/stock-list?bodyType=${encodeURIComponent(name)}`);
  const goToBudget = (b) => {
    const params = new URLSearchParams();
    if (b.minPrice) params.set("minPrice", b.minPrice);
    if (b.maxPrice) params.set("maxPrice", b.maxPrice);
    router.push(`/stock-list?${params.toString()}`);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/stock-list?search=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <div className="px-4 pt-4 md:pt-6">
      <div className="mx-auto max-w-[1320px] border border-gray-200 bg-white">
        {/* Console header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-navy px-5 py-3.5">
          <h1 className="font-display text-lg font-bold text-white md:text-xl">
            Search the Live Inventory
          </h1>
          <span className="font-mono text-xs text-white/80">
            {cars.length ? `${cars.length.toLocaleString()} vehicles` : "Loading stock…"} &middot; updated from Japan
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 border-b border-gray-200 px-5 py-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by make, model or stock number"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <button
            type="submit"
            className="bg-brand-orange px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-orange-hover"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr]">
          {/* Shop by make */}
          <div className="border-b border-gray-200 p-4 md:border-b-0 md:border-r">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Shop by Make</p>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {(makesWithCounts.length ? makesWithCounts : Array.from({ length: 8 }, () => null)).map((m, i) =>
                m ? (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => goToMake(m.name)}
                    className="border border-gray-200 px-1 py-2 text-center text-[11px] font-semibold transition hover:border-brand-navy"
                  >
                    {m.name}
                    <div className="font-mono text-[10px] text-brand-orange">{m.count}</div>
                  </button>
                ) : (
                  <div key={`skel-${i}`} className="h-[46px] animate-pulse border border-gray-100 bg-gray-100" />
                )
              )}
            </div>
          </div>

          {/* Shop by body type */}
          <div className="border-b border-gray-200 p-4 md:border-b-0 md:border-r">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Shop by Body Type</p>
            <div className="flex flex-col gap-1.5">
              {(bodyTypesWithCounts.length ? bodyTypesWithCounts : Array.from({ length: 5 }, () => null)).map((b, i) =>
                b ? (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => goToBodyType(b.name)}
                    className="flex items-center justify-between border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-brand-navy"
                  >
                    <span>{b.name}</span>
                    <span className="font-mono text-gray-400">{b.count}</span>
                  </button>
                ) : (
                  <div key={`skel-${i}`} className="h-[30px] animate-pulse border border-gray-100 bg-gray-100" />
                )
              )}
            </div>
          </div>

          {/* Shop by budget */}
          <div className="p-4">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Shop by Budget</p>
            <div className="flex flex-col gap-1.5">
              {budgetsWithCounts.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => goToBudget(b)}
                  className="flex items-center justify-between border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-brand-navy"
                >
                  <span>{b.label}</span>
                  <span className="font-mono text-gray-400">{b.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryConsole;
