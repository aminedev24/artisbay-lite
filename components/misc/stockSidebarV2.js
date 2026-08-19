// stockSidebarV2.js
// Left "Shop by" filter sidebar — adapted from Ichinomiya's Sidebar, reduced to
// Make / Body / Price panels and rebranded to Artisbay Lite. Counts are computed from
// the live stock (passed in), not from a static stock.json. Clicking an active
// row toggles it off.
import React from "react";

const Panel = ({ title, count, children }) => (
  <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center gap-2 bg-[#1e3a8a] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
      {title}
      {count != null && <span className="ml-auto text-[10px] opacity-70">{count}</span>}
    </div>
    <div className="max-h-72 overflow-y-auto">{children}</div>
  </div>
);

const Row = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between border-b border-gray-100 px-3.5 py-1.5 text-xs transition last:border-b-0 ${
      active
        ? "bg-[#1e3a8a]/10 font-semibold text-[#1e3a8a]"
        : "text-gray-600 hover:bg-blue-50 hover:text-[#1e3a8a]"
    }`}
  >
    {children}
  </button>
);

const StockSidebarV2 = ({
  makes = [],
  bodyTypes = [],
  priceOptions = [],
  selected = {},
  onQuickFilter,
}) => {
  const toggle = (key, value) => {
    const current = selected[key] || "";
    onQuickFilter(key, current === String(value) ? null : value);
  };

  const isPriceActive = (o) => {
    const [min, max] = String(o.value).split("-");
    return (
      (min ? selected.minPrice === min : !selected.minPrice) &&
      (max ? selected.maxPrice === max : !selected.maxPrice)
    );
  };

  const togglePrice = (o) => {
    if (!o.value) {
      onQuickFilter("minPrice", null);
      onQuickFilter("maxPrice", null);
      return;
    }
    if (isPriceActive(o)) {
      onQuickFilter("minPrice", null);
      onQuickFilter("maxPrice", null);
      return;
    }
    const [min, max] = String(o.value).split("-");
    onQuickFilter("minPrice", min || null);
    onQuickFilter("maxPrice", max || null);
  };

  return (
    <aside className="hidden w-[230px] shrink-0 lg:block">
      <div className="sticky top-4">
        <Panel title="Shop by Make" count={makes.length}>
          {makes.map((m) => (
            <Row
              key={m.name}
              active={(selected.make || "") === m.name}
              onClick={() => toggle("make", m.name)}
            >
              <span className="truncate">{m.name}</span>
              <span className="ml-2 text-[11px] font-bold text-gray-400">{m.count}</span>
            </Row>
          ))}
        </Panel>

        <Panel title="Shop by Body" count={bodyTypes.length}>
          {bodyTypes.map((b) => (
            <Row
              key={b.name}
              active={(selected.bodyType || "") === b.name}
              onClick={() => toggle("bodyType", b.name)}
            >
              <span className="truncate">{b.name}</span>
              <span className="ml-2 text-[11px] font-bold text-gray-400">{b.count}</span>
            </Row>
          ))}
        </Panel>

        <Panel title="Shop by Budget">
          {priceOptions
            .filter((o) => o.value)
            .map((o) => (
              <Row
                key={o.value}
                active={isPriceActive(o)}
                onClick={() => togglePrice(o)}
              >
                <span>{o.label}</span>
                <span className="ml-2 text-[11px] font-bold text-gray-300">›</span>
              </Row>
            ))}
        </Panel>
      </div>
    </aside>
  );
};

export default StockSidebarV2;
