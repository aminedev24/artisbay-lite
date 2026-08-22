import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { useCompare, MAX_COMPARE } from "../vehicles/useCompare";
import CompareModal from "./compareModal";

const CompareTray = () => {
  const { items, count, removeFromCompare, clearCompare } = useCompare();
  const [modalOpen, setModalOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/20 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy">
            <FontAwesomeIcon icon={faScaleBalanced} className="h-3.5 w-3.5" />
            Compare ({count}/{MAX_COMPARE})
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
            {items.map((car) => (
              <div
                key={car.ref}
                className="flex items-center gap-1.5 border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-semibold text-brand-charcoal"
              >
                <span className="max-w-[120px] truncate">
                  {car.make} {car.model}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(car.ref)}
                  aria-label={`Remove ${car.make} ${car.model} from compare`}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={count < 2}
              className="bg-brand-navy px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
              title={count < 2 ? "Add at least 2 vehicles to compare" : undefined}
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
      {modalOpen && <CompareModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default CompareTray;
