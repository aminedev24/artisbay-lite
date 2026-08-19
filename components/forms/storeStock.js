import React from 'react';
import Modal from '../common/alertModal';
import CreatableSelect from 'react-select/creatable';
import useStoreStockForm from './storeStock/useStoreStockForm';

const storeStockForm = () => {
  const {
    images,
    handleImageChange,
    formData,
    handleChange,
    freight, setFreight,
    discount, setDiscount,
    discountTitle, setDiscountTitle,
    mainCurrency, setMainCurrency,
    currencies,
    userOptions, selectedUser, setSelectedUser,
    carPrice,
    finalValue,
    handleSubmit,
    populateForm,
    showModal, modalMessage, modalType,
    handleCloseModal,
  } = useStoreStockForm();

  const renderInput = (label, name) => (
    <div className="car-form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="car-form-container">
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          type={modalType}
        />
      )}
      <h2>Car Information Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="car-form-group">
          <label htmlFor="user">User / Customer</label>
          <CreatableSelect
            id="user"
            isClearable
            options={userOptions}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder="Select or type user/customer"
            formatCreateLabel={inputValue => `Add new user: "${inputValue}"`}
          />
        </div>
        <fieldset className="car-fieldset">
          <legend>Basic Info</legend>
          <div className="car-form-row">
            {renderInput('Ref No.', 'refNo')}
            {renderInput('Make', 'make')}
            {renderInput('Model', 'model')}
          </div>
          <div className="car-form-row">
            {renderInput('Price', 'price')}
            {renderInput('Category', 'category')}
            {renderInput('Color', 'color')}
            <div className="car-form-group">
              <label htmlFor="mainCurrency">Currency</label>
              <select
                id="mainCurrency"
                value={mainCurrency}
                onChange={e => setMainCurrency(e.target.value)}
                className="styled-select"
              >
                {currencies.map(cur => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="car-fieldset">
          <legend>Specifications</legend>
          <div className="car-form-row">
            {renderInput('Year', 'year')}
            {renderInput('Dimension (L*W*H)', 'dimension')}
            {renderInput('M3', 'm3')}
          </div>
          <div className="car-form-row">
            {renderInput('Engine Capacity', 'engineCapacity')}
            {renderInput('Mileage', 'mileage')}
            {renderInput('Chassis No.', 'chassisNo')}
          </div>
        </fieldset>

        <fieldset className="car-fieldset">
          <legend>Features</legend>
          <div className="car-form-row">
            {renderInput('Fuel', 'fuel')}
            {renderInput('Door', 'door')}
            {renderInput('Seat', 'seat')}
          </div>
          <div className="car-form-row">
            {renderInput('Transmission', 'transmission')}
            {renderInput('Drive', 'drive')}
            {renderInput('Stereo', 'stereo')}
          </div>
        </fieldset>

        <fieldset className="car-fieldset">
          <legend>Shipping & Extra Info</legend>
          <div className="car-form-row">
            {renderInput('Port of Discharge', 'port_of_discharge')}
            {renderInput('Port of Loading', 'port_of_loading')}
            {renderInput('Size', 'size')}
            {renderInput('Engine Type', 'engine_type')}
          </div>
          <div className="car-form-row">
            {renderInput('Ship Name', 'ship_name')}
            <div className="car-form-group">
              <label htmlFor="ship_date">Ship Date</label>
              <input
                type="date"
                id="ship_date"
                name="ship_date"
                value={formData.ship_date}
                onChange={handleChange}
              />
            </div>
            {renderInput('Arrival Port', 'arrival_port')}
            {renderInput('Destination', 'destination')}
            {renderInput('Departure Port', 'departure_port')}
            {renderInput('Address', 'address')}
            {renderInput('Phone', 'phone')}
            {renderInput('Company', 'company')}
          </div>
        </fieldset>

        <div className="car-form-group image-upload-group">
          <label htmlFor="images">Car Images</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview-container">
            {images.length > 0 &&
              images.map((img, index) => (
                <div className="image-thumb" key={index}>
                  <img src={URL.createObjectURL(img)} alt={`preview-${index}`} />
                </div>
              ))}
          </div>
        </div>

        <div className="car-form-group">
          <label htmlFor="freight">Freight Cost</label>
          <input
            type="number"
            id="freight"
            name="freight"
            value={freight}
            onChange={e => setFreight(e.target.value)}
            placeholder="e.g. 3000"
          />
        </div>

        <div className="car-form-group">
          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            placeholder="e.g. 300"
          />
          <input
            style={{display: 'none'}}
            type="text"
            id="discountTitle"
            name="discountTitle"
            value={discountTitle}
            onChange={e => setDiscountTitle(e.target.value)}
            placeholder="Discount Title (e.g. Special Offer)"
          />
        </div>

        <div className="car-value-summary">
          <div className="car-form-group">
            <label>Original Car Value:</label>
            <span className="car-value">{carPrice.toLocaleString()} {mainCurrency}</span>
          </div>
          <div className="car-form-group">
            <label>Value After Discount & Freight:</label>
            <span className="car-value final">{finalValue.toLocaleString()} {mainCurrency}</span>
          </div>
        </div>

        <button type="button" onClick={populateForm} className="populate-btn">
          Populate with Sample Data
        </button>

        <button type="submit" className="car-submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default storeStockForm;
