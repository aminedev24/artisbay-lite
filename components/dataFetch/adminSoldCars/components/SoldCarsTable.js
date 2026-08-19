import React from "react";
import SoldCarDetailsGrid from "./SoldCarDetailsGrid";
import SoldCarThumbnails from "./SoldCarThumbnails";

const SoldCarsTable = ({
  cars,
  expandedCar,
  onToggleExpand,
  onEdit,
  onSelectImage,
}) => (
  <div className="overflow-x-auto">
    <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80">
      <table className="w-full min-w-[1024px] border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 text-xs uppercase tracking-[0.35em] text-white">
            <th className="px-5 py-4 text-left">Ref No</th>
            <th className="px-5 py-4 text-left">Make / Model</th>
            <th className="px-5 py-4 text-left">Year</th>
            <th className="px-5 py-4 text-left">Invoice Date</th>
            <th className="px-5 py-4 text-left">Price</th>
            <th className="px-5 py-4 text-left">Images</th>
            <th className="px-5 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length ? (
            cars.map((car, idx) => (
              <React.Fragment key={car.id}>
                <tr
                  className={`transition hover:-translate-y-0.5 hover:bg-slate-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-5 py-4 text-slate-700">{car.ref_no}</td>
                  <td className="px-5 py-4 text-slate-800">
                    {car.make} {car.model}
                  </td>
                  <td className="px-5 py-4 text-slate-700">{car.year}</td>
                  <td className="px-5 py-4 text-slate-700">
                    {car.invoice_date || "N/A"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {car.price} {car.currency}
                  </td>
                  <td className="px-5 py-4">
                    <SoldCarThumbnails
                      images={car.image_urls}
                      onSelectImage={onSelectImage}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onToggleExpand(car)}
                        className="rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold uppercase text-slate-700 transition hover:bg-slate-300"
                      >
                        {expandedCar === car.id ? "Hide" : "Details"}
                      </button>
                      <button
                        onClick={() => onEdit(car)}
                        className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.03]"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedCar === car.id && (
                  <tr className="hidden md:table-row">
                    <td colSpan={7} className="px-5 pb-6 pt-2">
                      <SoldCarDetailsGrid car={car} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-5 py-6 text-center text-slate-500">
                No sold cars found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default SoldCarsTable;
