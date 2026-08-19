import React from "react";
import { API_BASE } from "../constants";
import { normalizeImagePath } from "../utils";

const BASIC_FIELDS = [
  { label: "Ref No", name: "ref_no", type: "text" },
  { label: "Make", name: "make", type: "text" },
  { label: "Model", name: "model", type: "text" },
  { label: "Year", name: "year", type: "text" },
  { label: "Invoice Date", name: "invoice_date", type: "date" },
  { label: "Price", name: "price", type: "text" },
  { label: "Currency", name: "currency", type: "text" },
];

const TECHNICAL_FIELDS = [
  { label: "Size", name: "size" },
  { label: "Category", name: "category" },
  { label: "Color", name: "color" },
  { label: "Dimension", name: "dimension" },
  { label: "M3", name: "m3" },
  { label: "Engine Capacity", name: "engine_capacity" },
  { label: "Mileage", name: "mileage" },
  { label: "Chassis No", name: "chassis_no" },
  { label: "Fuel", name: "fuel" },
  { label: "Door", name: "door" },
  { label: "Seat", name: "seat" },
];

const SHIPPING_FIELDS = [
  { label: "Ship Name", name: "ship_name" },
  { label: "Departure Port", name: "departure_port" },
  { label: "Arrival Port", name: "arrival_port" },
  { label: "Freight", name: "freight" },
  { label: "Discount", name: "discount" },
  { label: "Booking Ref", name: "booking_ref" },
];

const FIELD_SECTIONS = [
  { title: "Basic Info", fields: BASIC_FIELDS, columns: 2 },
  { title: "Technical Specs", fields: TECHNICAL_FIELDS, columns: 3 },
  { title: "Shipping Details", fields: SHIPPING_FIELDS, columns: 2 },
];

const getColumnClasses = (columns) => {
  if (columns === 1) return "grid-cols-1";
  if (columns === 3) return "sm:grid-cols-2 xl:grid-cols-3";
  return "sm:grid-cols-2";
};

const renderInput = (field, value, onChange) => (
  <div key={field.name}>
    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
      {field.label}
    </label>
    <input
      type={field.type || "text"}
      name={field.name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

const renderFieldSection = ({ title, fields, columns }, data, onChange) => (
  <section
    key={title}
    className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-inner shadow-slate-100"
  >
    <div className="mb-4 flex items-center justify-between">
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
        {fields.length} fields
      </span>
    </div>
    <div className={`grid gap-4 ${getColumnClasses(columns)}`}>
      {fields.map((field) =>
        renderInput(field, data[field.name], onChange),
      )}
    </div>
  </section>
);

const EditSoldCarModal = ({
  editFormData,
  editingCar,
  fileInputRef,
  onClose,
  onInputChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
}) => {
  if (!editingCar) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-gradient-to-br from-white via-white to-slate-50 shadow-2xl sm:w-[95vw] lg:w-[92vw] xl:w-[88vw]">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-8 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Editing #{editingCar}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {editFormData.make} {editFormData.model}
              </h3>
              <p className="text-sm text-slate-500">
                {editFormData.ref_no} · {editFormData.year}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                {FIELD_SECTIONS.map((section) =>
                  renderFieldSection(section, editFormData, onInputChange),
                )}
              </div>

              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-5 shadow-inner shadow-slate-100">
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-slate-800">
                    Image Gallery
                  </h4>
                  <p className="text-xs text-slate-500">
                    Upload up to 10 photos to showcase this car.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {(editFormData.image_urls || []).map((img, index) => {
                    const isExisting = typeof img === "string";
                    const normalizedPath = isExisting
                      ? normalizeImagePath(img)
                      : img.preview;
                    const usesAbsolutePath =
                      (normalizedPath || "").startsWith("http") ||
                      (normalizedPath || "").startsWith("data:") ||
                      (normalizedPath || "").startsWith("blob:");
                    const src =
                      isExisting && !usesAbsolutePath
                        ? `${API_BASE}/${normalizedPath}`
                        : normalizedPath;

                    return (
                      <div
                        key={`${src}-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow"
                      >
                        <img
                          src={src}
                          alt="car"
                          className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveImage(index)}
                          className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-gradient-to-r from-slate-50 to-white px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-600 shadow-inner shadow-white transition hover:border-blue-400 hover:from-white hover:to-blue-50 hover:text-blue-500"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                    +
                  </span>
                  Add Images
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-8 py-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Last updated today
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-600/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSoldCarModal;
