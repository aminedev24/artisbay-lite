import React from 'react';

import CreatableSelect from 'react-select/creatable';

import Modal from '../common/alertModal';

import { CURRENCIES } from './addCarsForm/constants';
import { useCarFormState } from './addCarsForm/useCarFormState';
import {
  BasicInfoSection,
  SpecificationsSection,
  ShippingSection,
  UserInfoSection,
  InternalCostsSection,
  FreightDiscountSection,
  ImagesSection,
} from './addCarsForm/sections';

const CarForm = () => {
  const {
    images,
    showModal,
    modalMessage,
    modalType,
    carType,
    setCarType,
    costs,
    freight,
    discount,
    mainCurrency,
    setMainCurrency,
    userOptions,
    selectedUser,
    setSelectedUser,
    formData,
    fob,
    finalValue,
    handleChange,
    handleSubmit,
    onCostChange,
    populateForm,
    handleImagesChange,
    setFreight,
    setDiscount,
    setFormData,
    taxDisplay,
    setShowModal,
  } = useCarFormState();

  return (
    <div className="mx-auto max-w-5xl">
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} type={modalType} />
      )}

      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900">Vehicle Management</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700">Insertion Type</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {[
                { value: 'sold', label: 'Sold' },
                { value: 'stock', label: 'In Stock' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCarType(option.value)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    carType === option.value
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-brand-navy'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-[240px] flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">User / Customer</label>
            <CreatableSelect
              isClearable
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select or type user"
            />
          </div>
        </div>

        <BasicInfoSection
          formData={formData}
          onChange={handleChange}
          mainCurrency={mainCurrency}
          currencies={CURRENCIES}
          onCurrencyChange={(e) => setMainCurrency(e.target.value)}
          onPriceChange={(val) => setFormData((prev) => ({ ...prev, price: val }))}
        />

        <SpecificationsSection formData={formData} onChange={handleChange} />

        <ShippingSection formData={formData} onChange={handleChange} />

        <UserInfoSection formData={formData} onChange={handleChange} />

        {carType === 'stock' && (
          <InternalCostsSection
            costs={costs}
            onCostChange={onCostChange}
            mainCurrency={mainCurrency}
            taxDisplay={taxDisplay}
            fob={fob}
          />
        )}

        <FreightDiscountSection
          freight={freight}
          discount={discount}
          onFreightChange={setFreight}
          onDiscountChange={setDiscount}
          finalValue={finalValue}
          mainCurrency={mainCurrency}
        />

        <ImagesSection images={images} onImagesChange={handleImagesChange} />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={populateForm}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-navy hover:text-brand-navy"
          >
            Populate with Sample Data
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-hover"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
