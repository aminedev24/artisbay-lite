import React, { useEffect, useState } from 'react';

import { sanitizeCurrencyInput } from './helpers';

const CurrencyField = ({
  label,
  name,
  value,
  onValueChange,
  placeholder = '',
  readOnly = false,
  currency,
}) => {
  const [displayValue, setDisplayValue] = useState(() => (value ?? '').toString());

  useEffect(() => {
    setDisplayValue((value ?? '').toString());
  }, [value]);

  const handleInputChange = (e) => {
    if (readOnly) return;
    const next = sanitizeCurrencyInput(e.target.value);
    setDisplayValue(next);
    onValueChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div
        className={`flex items-center overflow-hidden rounded-lg border transition-colors focus-within:border-brand-navy focus-within:ring-2 focus-within:ring-brand-navy/15 ${
          readOnly ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'
        }`}
      >
        <span className="border-r border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-brand-navy">
          {currency}
        </span>
        <input
          type="text"
          inputMode="decimal"
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none ${
            readOnly ? 'cursor-not-allowed text-slate-500' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default CurrencyField;
