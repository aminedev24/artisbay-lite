import React from "react";
import CreatableSelect from "react-select/creatable";

import CountryList from "../../utilities/countryList";
import Tooltip from "../../utilities/toolTip";

export const AuthPrompt = ({ user, onLogin, onRegister }) => {
  if (user) return null;

  return (
    <div className="login-note">
      <span>Log in for a quick auto-fill.</span>
      <button type="button" onClick={onLogin}>
        Log In
      </button>
      <button type="button" onClick={onRegister}>
        Register
      </button>
    </div>
  );
};

export const UserInfoSection = ({
  formData,
  onChange,
  phoneCode,
  isDataLoaded,
  user,
}) => (
  <div className="form-section">
    <h3>Your Information</h3>
    <div className="form-group">
      <div className="half-width">
        <label htmlFor="fullName">
          Full Name<span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder="Full name"
          required
        />
      </div>
      <div className="half-width">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={onChange}
          placeholder="Company"
        />
      </div>
    </div>
    <div className="form-group">
      <div className="half-width">
        <label htmlFor="country">
          Country<span className="required-star">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={onChange}
          required
        >
          <option value="">Select Country</option>
          {CountryList()
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((country) => (
              <option key={country.label} value={country.label}>
                {country.label}
              </option>
            ))}
        </select>
      </div>
      <div className="half-width">
        <label htmlFor="phone">
          Phone<span className="required-star">*</span>
        </label>
        <div className="phone-number-group">
          {phoneCode && <span className="phone-code">{phoneCode}</span>}
          <input
            type="tel"
            id="phone"
            name="phone"
            className={phoneCode ? "shrink" : ""}
            value={formData.phone}
            onChange={onChange}
            placeholder="Phone number"
            required
            readOnly={isDataLoaded && user && user.role !== "admin"}
          />
        </div>
      </div>
    </div>
    <div className="form-group">
      <div className="half-width">
        <label htmlFor="address">
          Address<span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Address"
          required
        />
      </div>
      <div className="half-width">
        <label htmlFor="email">
          E-mail<span className="required-star">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="E-mail"
          required
          readOnly={isDataLoaded && user && user.role !== "admin"}
        />
      </div>
    </div>
  </div>
);

export const PaymentDetailsSection = ({
  formData,
  onChange,
  makes,
  models,
  onMakeChange,
  handleTypingStart,
}) => (
  <div
    style={{ paddingBottom: formData.depositPurpose === "Paying My Vehicle" ? "15px" : undefined }}
    className="form-section"
  >
    <h3>Payment Details</h3>
    <div className="form-group">
      <div className="half-width">
        <label htmlFor="depositCurrency">
          Payment currency<span className="required-star">*</span>
        </label>
        <div className="input-with-addon">
          <select
            id="depositCurrency"
            name="depositCurrency"
            value={formData.depositCurrency}
            onChange={onChange}
          >
            <option value="USD">USD</option>
            <option value="JPY">JPY</option>
            <option value="EUR">EUR</option>
          </select>
          <label htmlFor="depositAmount">
            Payment Amount<span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="depositAmount"
            name="depositAmount"
            value={formData.depositAmount.toLocaleString()}
            onChange={onChange}
            placeholder="Payment amount"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="half-width">
        <label htmlFor="depositPurpose">
          Payment Purpose<span className="required-star">*</span>
        </label>
        <select
          id="depositPurpose"
          name="depositPurpose"
          value={formData.depositPurpose}
          onChange={onChange}
          required
        >
          <option value="Vehicle Purchase">Vehicle Purchase</option>
          <option value="Auto Parts Order">Auto Parts Order</option>
          <option value="Paying My Vehicle">Paying My Vehicle</option>
        </select>

        {formData.depositPurpose === "Paying My Vehicle" && (
          <>
            <label htmlFor="engineCapacity">
              Engine Capacity <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="engineCapacity"
              name="engineCapacity"
              value={formData.engineCapacity.toLocaleString()}
              onChange={onChange}
              max={6000}
              placeholder="Engine Capacity"
              required
            />
          </>
        )}
      </div>
    </div>

    {formData.depositPurpose === "Paying My Vehicle" && (
      <>
        <div className="form-group">
          <div className="half-width">
            <label htmlFor="mileage">
              Mileage <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="mileage"
              name="mileage"
              value={formData.mileage.toLocaleString()}
              onChange={onChange}
              placeholder="Mileage"
              required
            />
          </div>

          <div className="half-width">
            <label htmlFor="chasisNumber">
              Chassis Number<span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="chasisNumber"
              name="chasisNumber"
              value={formData.chasisNumber}
              onChange={onChange}
              placeholder="Chassis Number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="half-width">
            <label htmlFor="make">
              Make<span className="required-star">*</span>
            </label>
            <CreatableSelect
              id="make"
              name="make"
              options={makes.map((make) => ({
                value: make,
                label: make.charAt(0).toUpperCase() + make.slice(1),
              }))}
              placeholder="Make (any)"
              value={
                formData.make && formData.make !== "any"
                  ? {
                      value: formData.make,
                      label: formData.make.charAt(0).toUpperCase() + formData.make.slice(1),
                    }
                  : null
              }
              onChange={(selectedOption) => {
                const value = selectedOption ? selectedOption.value : "any";
                const event = { target: { name: "make", value } };
                onMakeChange(event);
                onChange(event);
              }}
              isClearable
            />
          </div>

          <div className="half-width">
            <label htmlFor="model">
              Model <span className="required-star">*</span>
            </label>
            <CreatableSelect
              id="model"
              name="model"
              options={models.map((model) => ({ value: model, label: model }))}
              placeholder="Model (any)"
              value={
                formData.model && formData.model !== "any"
                  ? { value: formData.model, label: formData.model }
                  : null
              }
              onChange={(selectedOption) =>
                onChange({
                  target: {
                    name: "model",
                    value: selectedOption ? selectedOption.value : "any",
                  },
                })
              }
              isClearable
            />
          </div>
        </div>
      </>
    )}

    {formData.depositPurpose !== "order vehicle" && (
      <div className="form-group" style={{ flexDirection: "column" }}>
        <label htmlFor="depositDescription">
          Payment Description<span className="required-star">*</span>
          <Tooltip
            onTypingStart={handleTypingStart}
            message="Please describe what you are paying for, e.g., Toyota Land Cruiser 2013"
          />
        </label>
        <textarea
          id="depositDescription"
          name="depositDescription"
          value={formData.depositDescription}
          onChange={onChange}
          placeholder="Payment description"
          required
          rows="5"
        ></textarea>
      </div>
    )}
  </div>
);

export const BankNoteSection = ({
  isEditable,
  onToggleEditable,
  formData,
  onChange,
}) => (
  <div className="input-group">
    <label id="bankNoteLabel" htmlFor="bankNote">
      Note (By The Remitter)
      <button type="button" onClick={onToggleEditable} className="edit-button">
        {isEditable ? "Save" : "Edit"}
      </button>
    </label>
    {isEditable ? (
      <textarea
        name="bankNote"
        value={formData.bankNote}
        onChange={onChange}
        placeholder="Leave Blank if not applicable"
        id="bankNoteInput"
        rows="4"
      ></textarea>
    ) : (
      <div className="bank-note-wrapper">
        <div className="bank-note-display">
          {formData.bankNote || "No note added."}
        </div>
      </div>
    )}
  </div>
);

export const SubmitSection = ({ isSubmitting, regenerate, onReset }) => (
  <div className="submit-section">
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting && <i className="fas fa-circle-notch fa-spin" aria-hidden="true" />}
      {isSubmitting ? " Generating..." : regenerate ? " Regenerate Invoice" : " Generate Invoice"}
    </button>
    {regenerate && (
      <button
        onClick={onReset}
        style={{ background: "var(--secondary-color)" }}
        type="button"
      >
        Reset Invoice
      </button>
    )}
  </div>
);
