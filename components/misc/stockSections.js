"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight, faChevronDown, faChevronUp, faSearch,
  faFilter, faUndo, faTimes, faCarSide, faCalendarCheck,
  faShip,   faChevronLeft, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import CarCard from "../vehicles/carCard";
import { filterOptions, sortSelections, PAGE_SIZE_OPTIONS } from "./stockConstants";

export function HeroStatsSection({ heroStats, numberFormatter }) {
  if (!heroStats || heroStats.length === 0) return null;
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {heroStats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-3 hover:shadow-md transition">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-gray-600 font-semibold">
            <FontAwesomeIcon icon={stat.icon === "faShip" ? faShip : stat.icon === "faCalendarCheck" ? faCalendarCheck : faCarSide} size="sm" />
            <span>{stat.label}</span>
          </div>
          <p className="text-sm font-bold text-blue-900 mt-1">{numberFormatter.format(stat.value || 0)}</p>
          <p className="text-sm text-gray-500 mt-0.5">{stat.subLabel}</p>
        </div>
      ))}
    </div>
  );
}

export function Sidebar({ filters, onFilterChange, onQuickFilter, availableMakes, availableBodyTypes, allCars }) {
  const [brands, setBrands] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);

  React.useEffect(() => {
    const makeCount = {};
    const bodyCount = {};
    allCars.forEach((car) => {
      if (car.make) makeCount[car.make] = (makeCount[car.make] || 0) + 1;
      if (car.body) bodyCount[car.body] = (bodyCount[car.body] || 0) + 1;
    });
    setBrands(Object.entries(makeCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
    setBodyTypes(Object.entries(bodyCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
  }, [allCars]);

  const shopByPrice = [
    { label: '$500 – $1,000', min: '$500', max: '$1,000' },
    { label: '$1,000 – $2,500', min: '$1,000', max: '$2,500' },
    { label: '$2,500 – $5,000', min: '$2,500', max: '$5,000' },
    { label: '$5,000 – $10,000', min: '$5,000', max: '$10,000' },
  ];

  const handleMakeClick = (value) => {
    if (onQuickFilter) onQuickFilter('make', value);
    else if (onFilterChange) onFilterChange('make', value);
  };

  const handleBodyClick = (body) => {
    if (onQuickFilter) onQuickFilter('bodyType', body);
    else if (onFilterChange) onFilterChange('bodyType', body);
  };

  const handlePriceClick = (min, max) => {
    if (onFilterChange) {
      onFilterChange('minPrice', min);
      onFilterChange('maxPrice', max);
    }
  };

  return (
    <aside className="w-[230px] shrink-0 hidden lg:block">
      <div className="bg-white border border-gray-200 rounded p-3.5 grid grid-cols-2 gap-2.5 mb-3.5 shadow-sm">
        <div className="text-center p-2 rounded bg-gray-50">
          <div className="text-2xl font-bold text-blue-900">{allCars.length >= 1000 ? `${(allCars.length / 1000).toFixed(1)}K` : allCars.length}</div>
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Japan Stock</div>
        </div>
        <div className="text-center p-2 rounded bg-gray-50">
          <div className="text-2xl font-bold text-blue-900">{brands.length}</div>
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Brands</div>
        </div>
      </div>

      <a href="/contact" className="block bg-gradient-to-br from-blue-900 to-blue-800 text-white p-4 rounded mb-3.5 shadow-sm hover:opacity-90 transition">
        <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-80 mb-2">Need Help?</div>
        <div className="text-sm font-bold mb-1">Contact our team</div>
        <div className="text-[10px] opacity-70">We typically respond within 2 hours</div>
        <div className="mt-2 text-center bg-white/20 text-white font-extrabold text-[11px] tracking-wider py-2 rounded hover:bg-white/30 transition">
          Contact Us
        </div>
      </a>

      <div className="bg-white border border-gray-200 rounded overflow-hidden mb-3.5 shadow-sm">
        <div className="bg-blue-900 text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCarSide} className="text-xs opacity-70" />
          <span>Shop by Make</span>
          <span className="ml-auto text-[10px] opacity-70">{brands.length}</span>
        </div>
        {brands.slice(0, 7).map((brand) => (
          <div key={brand.name} onClick={() => handleMakeClick(brand.name)}
            className="flex justify-between items-center px-3.5 py-1.5 text-xs text-gray-500 border-b border-gray-100 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition"
          >
            <span>{brand.name}</span>
            <span className="text-[10px] font-bold text-gray-400">{brand.count.toLocaleString()}</span>
          </div>
        ))}
        {brands.length > 7 && (
          <div onClick={() => handleMakeClick('All Makes')} className="px-3.5 py-1.5 text-[10px] font-extrabold text-blue-900 uppercase tracking-wider cursor-pointer hover:underline">
            +{brands.length - 7} more brands
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden mb-3.5 shadow-sm">
        <div className="bg-blue-900 text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCarSide} className="text-xs opacity-70" />
          <span>Shop by Body</span>
          <span className="ml-auto text-[10px] opacity-70">{bodyTypes.length}</span>
        </div>
        {bodyTypes.map((item) => (
          <div key={item.name} onClick={() => handleBodyClick(item.name)}
            className="flex justify-between items-center px-3.5 py-1.5 text-xs text-gray-500 border-b border-gray-100 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition"
          >
            <span>{item.name}</span>
            <span className="text-[10px] font-bold text-gray-400">{item.count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden mb-3.5 shadow-sm">
        <div className="bg-blue-900 text-white px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span>Shop by Price</span>
        </div>
        {shopByPrice.map((range) => (
          <div key={range.label} onClick={() => handlePriceClick(range.min, range.max)}
            className="flex justify-between items-center px-3.5 py-1.5 text-xs text-gray-500 border-b border-gray-100 hover:bg-blue-50 hover:text-blue-900 cursor-pointer transition"
          >
            <span>{range.label}</span>
            <span className="text-[10px] font-bold text-gray-400">&rsaquo;</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function FilterForm({
  filters, onFilterChange, onSearchSubmit, onReset, searchTerm, setSearchTerm, dynamicOptions,
}) {
  const makes = dynamicOptions?.makes || filterOptions.makes;
  const models = dynamicOptions?.models || filterOptions.models;
  const bodyTypes = dynamicOptions?.bodyTypes || filterOptions.bodyTypes;
  const fuels = dynamicOptions?.fuels || filterOptions.fuels;
  const years = dynamicOptions?.years || filterOptions.years;

  const handleFilterAndSearch = (key, value) => {
    if (key === 'make' && value !== filters.make) {
      onFilterChange('model', 'All Models');
    }
    onFilterChange(key, value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-4 md:p-5 mb-5 shadow-sm">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faFilter} className="text-blue-900 text-xs" />
        <span>Search Vehicles</span>
        <span className="flex-1 h-px bg-gray-200" />
      </h3>
      <form onSubmit={onSearchSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 mb-2.5">
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Make</label>
            <select value={filters.make} onChange={(e) => handleFilterAndSearch('make', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {makes.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Model</label>
            <select value={filters.model} onChange={(e) => handleFilterAndSearch('model', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {models.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Min Price</label>
            <select value={filters.minPrice} onChange={(e) => handleFilterAndSearch('minPrice', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {filterOptions.minPrices.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Max Price</label>
            <select value={filters.maxPrice} onChange={(e) => handleFilterAndSearch('maxPrice', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {filterOptions.maxPrices.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Year From</label>
            <select value={filters.yearFrom} onChange={(e) => handleFilterAndSearch('yearFrom', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {years.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Year To</label>
            <select value={filters.yearTo} onChange={(e) => handleFilterAndSearch('yearTo', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {years.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 items-end">
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Body Type</label>
            <select value={filters.bodyType} onChange={(e) => handleFilterAndSearch('bodyType', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {bodyTypes.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Fuel</label>
            <select value={filters.fuel} onChange={(e) => handleFilterAndSearch('fuel', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {fuels.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Transmission</label>
            <select value={filters.transmission} onChange={(e) => handleFilterAndSearch('transmission', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {filterOptions.transmissions.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Steering</label>
            <select value={filters.steering} onChange={(e) => handleFilterAndSearch('steering', e.target.value)}
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500">
              {filterOptions.steerings.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Chassis No</label>
            <input value={filters.chassis} onChange={(e) => onFilterChange('chassis', e.target.value)}
              type="text" placeholder="e.g. JZX100..."
              className="w-full border border-gray-300 rounded py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-1.5">
            <button type="submit"
              className="flex flex-col items-center flex-1 bg-blue-900 text-white py-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider rounded hover:bg-blue-800 transition">
              <FontAwesomeIcon icon={faSearch} className="text-xs" />
              <span>Search</span>
            </button>
            {onReset && (
              <button type="button" onClick={onReset}
                className="flex flex-col items-center bg-gray-100 text-gray-500 py-1.5 px-3 text-[10px] font-extrabold uppercase tracking-wider rounded hover:bg-gray-200 hover:text-gray-700 transition">
                <FontAwesomeIcon icon={faUndo} className="text-xs" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export function ActiveFilterTags({ tags, onClearFilter, onClearAll, hasFilters }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {tags.map(({ key, label, value }) => (
        <button key={key} onClick={() => onClearFilter(key)}
          className="flex items-center gap-1.5 bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-100 text-xs font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition group"
        >
          <span>{label}: {value}</span>
          <FontAwesomeIcon icon={faTimes} className="text-[9px] opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      {hasFilters && (
        <button onClick={onClearAll} className="text-xs text-gray-400 hover:text-blue-900 hover:underline ml-1">
          View All Stock
        </button>
      )}
    </div>
  );
}

export function SortControls({ sortBy, onSortChange, carsPerPage, onPageSizeChange, totalPages, page, totalCars }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          <span className="font-bold text-blue-900">{totalCars.toLocaleString()}</span> vehicles found
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="hidden sm:inline">Show:</span>
          <select value={carsPerPage} onChange={(e) => onPageSizeChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-blue-500">
            {PAGE_SIZE_OPTIONS.map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="hidden sm:inline">Sort:</span>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-blue-500">
            {sortSelections.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
          </select>
        </label>
        {totalPages > 1 && (
          <span className="text-[11px] text-gray-400 hidden md:inline">p.{page}/{totalPages}</span>
        )}
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, visiblePageNumbers, onGoToPage }) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const items = [];
    const showFirst = 5;
    for (let i = 1; i <= Math.min(totalPages, showFirst); i++) items.push(i);
    if (totalPages > showFirst + 1) {
      items.push('ellipsis');
      items.push(totalPages);
    } else if (totalPages > showFirst) {
      items.push(totalPages);
    }
    return items.map((p, idx) =>
      p === 'ellipsis' ? (
        <span key={`e-${idx}`} className="px-2 text-gray-400 text-sm">&hellip;</span>
      ) : (
        <button key={p} onClick={() => { onGoToPage(p); window.scrollTo(0, 0); }}
          className={`px-3 py-2 rounded border text-sm font-medium transition ${
            p === page ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}>{p}</button>
      )
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <span className="text-sm text-gray-500 font-medium mr-2">Pages ({totalPages}):</span>
      <button onClick={() => { onGoToPage(page - 1); window.scrollTo(0, 0); }} disabled={page === 1}
        className="px-3 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 text-gray-700">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {renderPageButtons()}
      <button onClick={() => { onGoToPage(page + 1); window.scrollTo(0, 0); }} disabled={page === totalPages}
        className="px-3 py-2 rounded border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 text-gray-700">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <span className="flex items-center gap-1 text-sm ml-2">
        <span className="text-gray-500">Jump to:</span>
        <select value={page} onChange={(e) => { onGoToPage(Number(e.target.value)); window.scrollTo(0, 0); }}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500">
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </span>
    </div>
  );
}

export function CarGrid({ viewLoading, paginatedCars, allCars, skeletonCount, renderSkeletonCard, onCarClick, onRequestInvoice }) {
  if (viewLoading && allCars.length === 0) {
    return (
      <div className="flex flex-wrap -mx-2">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`skel-wrap-${i}`} className="w-1/2 sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
            {renderSkeletonCard(i)}
          </div>
        ))}
      </div>
    );
  }

  if (paginatedCars.length === 0) {
    return (
      <div className="bg-[var(--white)] border border-[var(--border-color)] rounded p-12 text-center">
        <FontAwesomeIcon icon={faSearch} className="text-5xl text-gray-200 mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No vehicles found</h3>
        <p className="text-gray-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {paginatedCars.map((car) => (
        <div key={car.id || car.ref} className="w-1/2 sm:w-1/2 lg:w-1/3 xl:w-1/4 px-2 mb-4">
          <CarCard car={car} onViewDetails={onCarClick} onRequestInvoice={onRequestInvoice} />
        </div>
      ))}
    </div>
  );
}
