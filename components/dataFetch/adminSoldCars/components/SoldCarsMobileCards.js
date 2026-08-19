import React from "react";
import SoldCarThumbnails from "./SoldCarThumbnails";

const SoldCarsMobileCards = ({
  cars,
  expandedCar,
  onToggleExpand,
  onEdit,
  onSelectImage,
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {cars.length ? (
      cars.map((car) => (
        <div
          key={car.id}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-lg shadow-slate-200/60"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {car.ref_no}
            </p>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
              {car.currency}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {car.make} {car.model}
          </h3>
          <p className="text-sm text-slate-500">
            {car.year} - {car.invoice_date || "N/A"}
          </p>
          <div className="mt-3">
            <SoldCarThumbnails
              images={car.image_urls}
              onSelectImage={onSelectImage}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onToggleExpand(car)}
              className="flex-1 rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold uppercase text-slate-700 transition hover:bg-slate-300"
            >
              {expandedCar === car.id ? "Hide" : "Details"}
            </button>
            <button
              onClick={() => onEdit(car)}
              className="flex-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              Edit
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-slate-500">No sold cars found.</p>
    )}
  </div>
);

export default SoldCarsMobileCards;
