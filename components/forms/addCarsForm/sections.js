import React from 'react';
import {
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  UserIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

import CurrencyField from './CurrencyField';

const TextInput = ({ label, name, type = 'text', value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-colors focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
    />
  </div>
);

const Fieldset = ({ legend, icon: Icon, children }) => (
  <fieldset className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <legend className="sr-only">{legend}</legend>
    <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
      {Icon && <Icon className="h-4 w-4 text-brand-navy" />}
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-navy">{legend}</span>
    </div>
    <div className="flex flex-col gap-4 px-5 py-5">{children}</div>
  </fieldset>
);

const Row = ({ children }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);

export const BasicInfoSection = ({
  formData,
  onChange,
  mainCurrency,
  currencies,
  onCurrencyChange,
  onPriceChange,
}) => (
  <Fieldset legend="Basic Info" icon={InformationCircleIcon}>
    <Row>
      <TextInput label="Ref No." name="refNo" value={formData.refNo} onChange={onChange} />
      <TextInput label="Make" name="make" value={formData.make} onChange={onChange} />
      <TextInput label="Model" name="model" value={formData.model} onChange={onChange} />
    </Row>
    <Row>
      <TextInput label="Category" name="category" value={formData.category} onChange={onChange} />
      <TextInput label="Color" name="color" value={formData.color} onChange={onChange} />
      <TextInput label="Year" name="year" type="number" value={formData.year} onChange={onChange} />
    </Row>
    <Row>
      <TextInput
        label="Invoice Date"
        name="invoice_date"
        type="date"
        value={formData.invoice_date}
        onChange={onChange}
      />
      <CurrencyField
        label="Price"
        name="price"
        value={formData.price}
        onValueChange={onPriceChange}
        placeholder="e.g. 15000"
        currency={mainCurrency}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Currency</label>
        <select
          value={mainCurrency}
          onChange={onCurrencyChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/15"
        >
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
      </div>
    </Row>
  </Fieldset>
);

export const SpecificationsSection = ({ formData, onChange }) => (
  <Fieldset legend="Specifications" icon={WrenchScrewdriverIcon}>
    <Row>
      <TextInput label="Dimension" name="dimension" value={formData.dimension} onChange={onChange} />
      <TextInput label="M3" name="m3" value={formData.m3} onChange={onChange} />
      <TextInput
        label="Engine Capacity"
        name="engineCapacity"
        value={formData.engineCapacity}
        onChange={onChange}
      />
    </Row>
    <Row>
      <TextInput label="Mileage" name="mileage" value={formData.mileage} onChange={onChange} />
      <TextInput label="Chassis No." name="chassisNo" value={formData.chassisNo} onChange={onChange} />
      <TextInput label="Fuel" name="fuel" value={formData.fuel} onChange={onChange} />
    </Row>
    <Row>
      <TextInput label="Transmission" name="transmission" value={formData.transmission} onChange={onChange} />
      <TextInput label="Drive" name="drive" value={formData.drive} onChange={onChange} />
      <TextInput label="Door" name="door" value={formData.door} onChange={onChange} />
    </Row>
    <Row>
      <TextInput label="Seat" name="seat" value={formData.seat} onChange={onChange} />
      <TextInput label="Stereo" name="stereo" value={formData.stereo} onChange={onChange} />
    </Row>
  </Fieldset>
);

export const ShippingSection = ({ formData, onChange }) => (
  <Fieldset legend="Shipping" icon={TruckIcon}>
    <Row>
      <TextInput label="Ship Name" name="ship_name" value={formData.ship_name} onChange={onChange} />
      <TextInput label="Ship Date" name="ship_date" type="date" value={formData.ship_date} onChange={onChange} />
      <TextInput label="Departure Port" name="departure_port" value={formData.departure_port} onChange={onChange} />
    </Row>
    <Row>
      <TextInput label="Arrival Port" name="arrival_port" value={formData.arrival_port} onChange={onChange} />
      <TextInput label="Port of Loading" name="port_of_loading" value={formData.port_of_loading} onChange={onChange} />
      <TextInput
        label="Port of Discharge"
        name="port_of_discharge"
        value={formData.port_of_discharge}
        onChange={onChange}
      />
    </Row>
    <Row>
      <TextInput label="Destination" name="destination" value={formData.destination} onChange={onChange} />
      <TextInput label="Size" name="size" value={formData.size} onChange={onChange} />
      <TextInput label="Engine Type" name="engine_type" value={formData.engine_type} onChange={onChange} />
    </Row>
  </Fieldset>
);

export const UserInfoSection = ({ formData, onChange }) => (
  <Fieldset legend="User Info" icon={UserIcon}>
    <Row>
      <TextInput label="Customer Name" name="user_name" value={formData.user_name} onChange={onChange} />
      <TextInput label="Phone" name="phone" value={formData.phone} onChange={onChange} />
      <TextInput label="Address" name="address" value={formData.address} onChange={onChange} />
    </Row>
    <Row>
      <TextInput label="Company" name="company" value={formData.company} onChange={onChange} />
    </Row>
  </Fieldset>
);

const CostSummaryRow = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
    <span className="text-sm font-medium text-slate-600">{label}</span>
    <span className={`text-base font-semibold ${highlight ? 'text-brand-orange' : 'text-brand-navy'}`}>{value}</span>
  </div>
);

export const InternalCostsSection = ({
  costs,
  onCostChange,
  mainCurrency,
  taxDisplay,
  fob,
}) => (
  <Fieldset legend="Internal Costs (Admin Only)" icon={BanknotesIcon}>
    <Row>
      <CurrencyField
        label="Buying Price"
        name="buyingPrice"
        value={costs.buyingPrice}
        onValueChange={onCostChange('buyingPrice')}
        currency={mainCurrency}
      />
      <CurrencyField
        label="Auction Fee"
        name="auctionFee"
        value={costs.auctionFee}
        onValueChange={onCostChange('auctionFee')}
        currency={mainCurrency}
      />
      <CurrencyField
        label="Transportation"
        name="transportation"
        value={costs.transportation}
        onValueChange={onCostChange('transportation')}
        currency={mainCurrency}
      />
    </Row>
    <Row>
      <CurrencyField
        label="Yard Fee"
        name="yardFee"
        value={costs.yardFee}
        onValueChange={onCostChange('yardFee')}
        currency={mainCurrency}
      />
      <CurrencyField
        label="Photos Fee"
        name="photosFee"
        value={costs.photosFee}
        onValueChange={onCostChange('photosFee')}
        currency={mainCurrency}
      />
      <CurrencyField
        label="Others Fee"
        name="othersFee"
        value={costs.othersFee}
        onValueChange={onCostChange('othersFee')}
        currency={mainCurrency}
      />
    </Row>
    <CurrencyField
      label="Service Fee"
      name="serviceFee"
      value={costs.serviceFee}
      onValueChange={onCostChange('serviceFee')}
      currency={mainCurrency}
    />

    <div className="mt-2 flex flex-col gap-2 rounded-lg bg-slate-50 p-4">
      <CostSummaryRow label="Tax (10%)" value={`${taxDisplay.toLocaleString()} ${mainCurrency}`} />
      <CostSummaryRow label="FOB (calculated)" value={`${fob.toLocaleString()} ${mainCurrency}`} highlight />
    </div>
  </Fieldset>
);

export const FreightDiscountSection = ({
  freight,
  discount,
  onFreightChange,
  onDiscountChange,
  finalValue,
  mainCurrency,
}) => (
  <Fieldset legend="Freight & Discount" icon={ReceiptPercentIcon}>
    <Row>
      <CurrencyField
        label="Freight Cost"
        name="freight"
        value={freight}
        onValueChange={onFreightChange}
        placeholder="e.g. 3000"
        currency={mainCurrency}
      />
      <CurrencyField
        label="Discount"
        name="discount"
        value={discount}
        onValueChange={onDiscountChange}
        placeholder="e.g. 300"
        currency={mainCurrency}
      />
    </Row>
    <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-navy/5 p-4">
      <span className="text-sm font-medium text-slate-700">Value After Discount &amp; Freight</span>
      <span className="text-lg font-bold text-brand-navy">
        {finalValue.toLocaleString()} {mainCurrency}
      </span>
    </div>
  </Fieldset>
);

export const ImagesSection = ({ images, onImagesChange }) => (
  <Fieldset legend="Car Images" icon={PhotoIcon}>
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-8 text-center transition-colors hover:border-brand-sky hover:bg-brand-sky/5">
      <PhotoIcon className="h-8 w-8 text-slate-400" />
      <span className="text-sm font-medium text-slate-600">Click to upload car images</span>
      <span className="text-xs text-slate-400">PNG, JPG up to several files</span>
      <input type="file" accept="image/*" multiple onChange={onImagesChange} className="hidden" />
    </label>

    {images.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            <img
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              className="h-20 w-20 object-cover"
            />
          </div>
        ))}
      </div>
    )}
  </Fieldset>
);
