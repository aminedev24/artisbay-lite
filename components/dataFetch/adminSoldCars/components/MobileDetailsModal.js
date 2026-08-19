import React from "react";
import SoldCarDetailsGrid from "./SoldCarDetailsGrid";

const MobileDetailsModal = ({ car, onClose }) => {
  if (!car) return null;

  return (
    <div className="alert-modal-overlay px-4 md:hidden">
      <div className="alert-modal-content max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {car.ref_no || "Ref N/A"}
            </p>
            <h3 className="text-base font-semibold text-slate-900">
              {car.make} {car.model}
            </h3>
          </div>
          <button
            className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <SoldCarDetailsGrid car={car} compact />
        </div>
      </div>
    </div>
  );
};

export default MobileDetailsModal;
