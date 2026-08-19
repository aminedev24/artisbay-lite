import React from "react";
import CreatableSelect from "react-select/creatable";

const CARD_BASE_CLASS =
  "line-item-card grid grid-cols-1 gap-3 rounded-lg border border-gray-300 p-4 mb-6";
const CARD_VARIANTS = {
  muted: "bg-slate-50",
  white: "bg-white",
};
const CARD_LAYOUTS = {
  default: "md:grid-cols-2 xl:grid-cols-3",
  pricing: "md:grid-cols-2 xl:grid-cols-4",
};
const SPEC_FIELDS = [
  { key: "cc", label: "CC", placeholder: "CC" },
  { key: "door", label: "Door", placeholder: "Door" },
  { key: "seat", label: "Seat", placeholder: "Seat" },
  { key: "shift", label: "Shift", placeholder: "Shift" },
  {
    key: "mileage",
    label: "Mileage",
    placeholder: "Mileage (e.g., 45,000 km)",
  },
  { key: "fuelType", label: "Fuel Type", placeholder: "Fuel (e.g., Petrol)" },
];

const LabeledInput = ({ label, ...inputProps }) => (
  <div className="form-group">
    <label>{label}</label>
    <input {...inputProps} />
  </div>
);

const LineItemSection = ({
  title,
  items,
  renderFields,
  variant = "muted",
  layout = "default",
  wrapperClassName = "",
}) => {
  const variantClass = CARD_VARIANTS[variant] || CARD_VARIANTS.muted;
  const layoutClass = CARD_LAYOUTS[layout] || CARD_LAYOUTS.default;
  const wrapperClass = ["line-items-panel space-y-4", wrapperClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      <h3 className="panel-title">{title}</h3>
      {items.map((item, index) => (
        <div
          key={`${title}-${index}`}
          className={`${CARD_BASE_CLASS} ${variantClass} ${layoutClass}`}
        >
          {renderFields(item, index)}
        </div>
      ))}
    </div>
  );
};

const LineItemPanels = ({
  lineItems,
  makeOptions,
  getModelOptions,
  selectClassNames,
  menuPortalTarget,
  handleLineItemChange,
  handleMakeSelectChange,
  handleMakeCreate,
  handleModelSelectChange,
  handleModelCreate,
  currency,
  removeLineItem,
  toTitleCase,
}) => {
  const items = Array.isArray(lineItems) ? lineItems : [];

  const renderIdentificationFields = (item, index) => {
    const modelOptions = getModelOptions(item.makerCarName);
    const selectedMakeOption =
      makeOptions.find((opt) => opt.value === item.makerCarName) ||
      (item.makerCarName
        ? {
            value: item.makerCarName,
            label: toTitleCase(item.makerCarName),
          }
        : null);
    const selectedModelOption =
      modelOptions.find((opt) => opt.value === item.model) ||
      (item.model
        ? { value: item.model, label: toTitleCase(item.model) }
        : null);

    return (
      <>
        <LabeledInput
          label="Ref No."
          type="text"
          value={item.refNo}
          onChange={(e) =>
            handleLineItemChange(index, "refNo", e.target.value)
          }
          placeholder="Ref No."
          required
        />
        <div className="form-group">
          <label>Make</label>
          <CreatableSelect
            value={selectedMakeOption}
            onChange={(selectedOption) =>
              handleMakeSelectChange(index, selectedOption)
            }
            onCreateOption={(inputValue) =>
              handleMakeCreate(index, inputValue)
            }
            options={makeOptions}
            placeholder="Select or type make"
            noOptionsMessage={() =>
              makeOptions.length ? "Press enter to add" : "Loading makes..."
            }
            className="w-full text-sm"
            classNames={selectClassNames}
            menuPortalTarget={menuPortalTarget}
            isClearable
          />
        </div>
        <div className="form-group">
          <label>Model</label>
          <CreatableSelect
            value={selectedModelOption}
            onChange={(selectedOption) =>
              handleModelSelectChange(index, selectedOption)
            }
            onCreateOption={(inputValue) =>
              handleModelCreate(index, item.makerCarName, inputValue)
            }
            options={modelOptions}
            placeholder={
              item.makerCarName ? "Select or type model" : "Select make first"
            }
            isDisabled={!item.makerCarName}
            noOptionsMessage={() => {
              if (!item.makerCarName) return "Select a make first";
              return modelOptions.length
                ? "Press enter to add"
                : "Loading models...";
            }}
            className="w-full text-sm"
            classNames={selectClassNames}
            menuPortalTarget={menuPortalTarget}
            isClearable
          />
        </div>
        <LabeledInput
          label="Chassis No."
          type="text"
          value={item.chassisNo}
          onChange={(e) =>
            handleLineItemChange(index, "chassisNo", e.target.value)
          }
          placeholder="Chassis No"
          required
        />
      </>
    );
  };

  const renderSpecsFields = (item, index) =>
    SPEC_FIELDS.map(({ key, label, placeholder }) => (
      <LabeledInput
        key={`${key}-${index}`}
        label={label}
        type="text"
        value={item[key]}
        onChange={(e) => handleLineItemChange(index, key, e.target.value)}
        placeholder={placeholder}
      />
    ));

  const renderPricingFields = (item, index) => (
    <>
      <LabeledInput
        label={`Unit Price (${currency})`}
        type="number"
        value={item.unitPrice}
        onChange={(e) =>
          handleLineItemChange(index, "unitPrice", e.target.value)
        }
        step="0.01"
        min="0"
        required
      />
      <LabeledInput
        label="Freight"
        type="number"
        value={item.freight}
        onChange={(e) =>
          handleLineItemChange(index, "freight", e.target.value)
        }
        step="0.01"
        min="0"
        required
      />
      <LabeledInput
        label="Insurance"
        type="number"
        value={item.insurance}
        onChange={(e) =>
          handleLineItemChange(index, "insurance", e.target.value)
        }
        step="0.01"
        min="0"
        required
      />
      <LabeledInput
        label="Amount"
        type="number"
        value={item.amount}
        readOnly
      />
      <div className="form-group flex items-end justify-end">
        <button
          type="button"
          onClick={() => removeLineItem(index)}
          className="remove-btn"
        >
          Remove
        </button>
      </div>
    </>
  );

  return (
    <div className="line-items-split-3">
      <LineItemSection
        title="Vehicle Identification"
        items={items}
        renderFields={renderIdentificationFields}
        variant="muted"
        wrapperClassName="id-panel"
      />
      <LineItemSection
        title="Vehicle Specs"
        items={items}
        renderFields={renderSpecsFields}
        variant="muted"
        wrapperClassName="specs-panel"
      />
      <LineItemSection
        title="Pricing"
        items={items}
        renderFields={renderPricingFields}
        variant="white"
        layout="pricing"
        wrapperClassName="pricing-panel"
      />
    </div>
  );
};

export default LineItemPanels;
