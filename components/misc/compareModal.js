import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCompare } from "../vehicles/useCompare";
import { formatNumberWithUnit } from "../utilities/numberFormat";

const ROWS = [
  { key: "year", label: "Year" },
  { key: "mileage", label: "Mileage", format: (v) => (v ? `${formatNumberWithUnit(v)} km` : "N/A") },
  { key: "modelCode", label: "Model Code" },
  { key: "engine", label: "Engine", format: (v) => (v ? formatNumberWithUnit(v) : "N/A") },
  { key: "fuel", label: "Fuel" },
  { key: "transmission", label: "Transmission" },
  { key: "grade", label: "Grade" },
  { key: "seats", label: "Seats" },
  { key: "color", label: "Color" },
  { key: "chassis", label: "Chassis No." },
];

const CompareModal = ({ onClose }) => {
  const { items, removeFromCompare } = useCompare();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-auto bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="font-display text-lg font-bold text-brand-charcoal">Compare Vehicles</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-brand-charcoal">
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-32 border-b border-gray-200 bg-gray-50 p-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Spec
                </th>
                {items.map((car) => (
                  <th key={car.ref} className="border-b border-gray-200 p-3 text-left align-top">
                    <div className="mb-2 h-20 w-28 overflow-hidden border border-gray-200 bg-gray-100">
                      {car.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={car.image} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="font-display text-xs font-bold uppercase text-brand-charcoal">
                      {car.make} {car.model}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-gray-400">{car.ref}</div>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(car.ref)}
                      className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="odd:bg-gray-50/50">
                  <td className="border-b border-gray-100 p-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {row.label}
                  </td>
                  {items.map((car) => {
                    const raw = car[row.key];
                    const value = raw ? (row.format ? row.format(raw) : raw) : "N/A";
                    return (
                      <td key={car.ref} className="border-b border-gray-100 p-3 text-brand-charcoal">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
