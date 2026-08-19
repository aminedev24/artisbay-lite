import React from "react";

const SoldCarFilters = ({
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClear,
}) => (
  <div className="mb-6 grid gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-lg shadow-slate-200/60 md:grid-cols-4">
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Search
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Ref, make, model..."
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Start Date
      </label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        End Date
      </label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div className="flex items-end">
      <button
        onClick={onClear}
        className="w-full rounded-full bg-gradient-to-r from-slate-200 to-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:scale-[1.02]"
      >
        Clear
      </button>
    </div>
  </div>
);

export default SoldCarFilters;
