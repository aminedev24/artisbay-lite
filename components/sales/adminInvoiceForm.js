import React from "react";
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import InvoicePreviewLayout from "./invoicePreview";
import LineItemPanels from "./LineItemPanels";
import Modal from "../common/alertModal";
import CountryList from "../utilities/countryList";
import useAdminInvoiceForm from "./useAdminInvoiceForm";

const AdminInvoiceForm = () => {
  const ctx = useAdminInvoiceForm();

  return (
    <form className="admin-invoice-container" onSubmit={ctx.handleSubmit}>
      <h1>Commercial Invoice</h1>

      <div className="invoice-metadata">
        <div className="form-group">
          <label>Invoice Number:</label>
          <input
            type="text"
            value={ctx.invoiceCounter}
            onChange={(e) => ctx.setInvoiceCounter(e.target.value)}
            placeholder="Enter invoice number"
            required
            disabled={ctx.isLoading}
          />
        </div>
        <div className="form-group">
          <label>Invoice Date:</label>
          <input
            type="date"
            value={ctx.invoiceDate}
            onChange={(e) => ctx.handleInvoiceDateChange(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Expiry Date:</label>
          <input
            type="date"
            value={ctx.expiryDate}
            onChange={(e) => ctx.setExpiryDate(e.target.value)}
            required
          />
        </div>
      </div>

      {ctx.isLoading && <p className="info-text">Fetching next invoice number…</p>}
      {ctx.error && <p className="error-text">{ctx.error}</p>}

      {ctx.showModal && (
        <Modal
          message={ctx.modalMessage}
          onClose={() => ctx.setShowModal(false)}
          type={ctx.modalType}
        />
      )}

      {ctx.showPreview && (
        <div className="invoice-modal-overlay">
          <div className="modal-content">
            <button className="close-btn invoice-btn" onClick={() => ctx.setShowPreview(false)}>Close</button>
            <InvoicePreviewLayout invoice={ctx.previewData} />
          </div>
        </div>
      )}

      <label style={{fontWeight: 'bold'}}>Select User:</label>
      <CreatableSelect
        options={ctx.options}
        onChange={ctx.handleSelectChange}
        placeholder="Select or type customer/user"
        className="w-full text-sm"
        classNames={ctx.selectClassNames}
        menuPortalTarget={ctx.menuPortalTarget}
        isClearable
      />

      <div className="fieldset-container">
        <fieldset className="fieldset">
          <legend>CUSTOMER</legend>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={ctx.customerName} onChange={(e) => ctx.setCustomerName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={ctx.customerAddress} onChange={(e) => ctx.setCustomerAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <div className="phone-number-group">
              {ctx.customerPhoneCode && (
                <span className="phone-code">{ctx.customerPhoneCode}</span>
              )}
              <input
                type="text"
                value={ctx.customerPhoneInputValue}
                onChange={(e) => ctx.handleCustomerPhoneInputChange(e.target.value)}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <Select
              options={CountryList()}
              value={ctx.selectedCountry}
              onChange={(option) => ctx.setSelectedCountry(option)}
              placeholder="Select a country"
            />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>BILL TO</legend>
          <div className="form-group toggle-group">
            <label>
              <input
                type="checkbox"
                checked={ctx.isBillToSameAsConsignee}
                onChange={(e) => ctx.handleBillToToggle(e.target.checked)}
              />{" "}
              Same as Consignee
            </label>
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={ctx.billToName} onChange={(e) => ctx.setBillToName(e.target.value)} required disabled={ctx.isBillToSameAsConsignee} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={ctx.billToAddress} onChange={(e) => ctx.setBillToAddress(e.target.value)} required disabled={ctx.isBillToSameAsConsignee} />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" value={ctx.billToPhone} onChange={(e) => ctx.setBillToPhone(e.target.value)} required disabled={ctx.isBillToSameAsConsignee} />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>SHIPPING INFO</legend>
          <div className="form-group">
            <label>Ship Name:</label>
            <input type="text" value={ctx.shipName} onChange={(e) => ctx.setShipName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Ocean Vessel:</label>
            <input type="text" value={ctx.oceanVessel} onChange={(e) => ctx.setOceanVessel(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Port of Loading:</label>
            <input type="text" value={ctx.portOfLoading} onChange={(e) => ctx.setPortOfLoading(e.target.value)} />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>BOOKING & DISCHARGE</legend>
          <div className="form-group">
            <label>Booking Ref:</label>
            <input type="text" value={ctx.bookingRef} onChange={(e) => ctx.setBookingRef(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Port of Discharge:</label>
            <input type="text" value={ctx.portOfDischarge} onChange={(e) => ctx.setPortOfDischarge(e.target.value)} />
          </div>
          <div className="form-group">
            <label>country of destination</label>
            <input type="text" value={ctx.destinationCountry} onChange={(e) => ctx.setDestinationCountry(e.target.value)} />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>CONSIGNEE</legend>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={ctx.consigneeName} onChange={(e) => ctx.setConsigneeName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={ctx.consigneeAddress} onChange={(e) => ctx.setConsigneeAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" value={ctx.consigneePhone} onChange={(e) => ctx.setConsigneePhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={ctx.consigneeEmail} onChange={(e) => ctx.setConsigneeEmail(e.target.value)} required />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>NOTIFY PARTIES</legend>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={ctx.notifyName} onChange={(e) => ctx.setNotifyName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={ctx.notifyAddress} onChange={(e) => ctx.setNotifyAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" value={ctx.notifyPhone} onChange={(e) => ctx.setNotifyPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={ctx.notifyEmail} onChange={(e) => ctx.setNotifyEmail(e.target.value)} required />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>IMPORTER - IF OTHER THAN CONSIGNEE</legend>
          <div className="form-group toggle-group">
            <label>
              <input
                type="checkbox"
                checked={ctx.isImporterSameAsConsignee}
                onChange={(e) => ctx.handleImporterToggle(e.target.checked)}
              />{" "}
              Same as Consignee
            </label>
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={ctx.importerName} onChange={(e) => ctx.setImporterName(e.target.value)} disabled={ctx.isImporterSameAsConsignee} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={ctx.importerAddress} onChange={(e) => ctx.setImporterAddress(e.target.value)} disabled={ctx.isImporterSameAsConsignee} />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input type="text" value={ctx.importerPhone} onChange={(e) => ctx.setImporterPhone(e.target.value)} disabled={ctx.isImporterSameAsConsignee} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={ctx.importerEmail} onChange={(e) => ctx.setImporterEmail(e.target.value)} disabled={ctx.isImporterSameAsConsignee} />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Container</legend>
          <div className="form-group container">
            <label>BL Number</label>
            <input type="text" value={ctx.blNumber} onChange={(e) => ctx.setblNumber(e.target.value)} />
          </div>
          <div className="form-group container">
            <label>Container Number:</label>
            <input type="text" value={ctx.containerNumber} onChange={(e) => ctx.setContainerNumber(e.target.value)} />
          </div>
        </fieldset>
      </div>

      <h2>Items</h2>

      <div className="form-group">
        <label>Currency:</label>
        <select value={ctx.currency} onChange={(e) => ctx.setCurrency(e.target.value)} className="currency-select">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      <LineItemPanels
        lineItems={ctx.lineItems}
        makeOptions={ctx.makeOptions}
        getModelOptions={ctx.getModelOptions}
        selectClassNames={ctx.selectClassNames}
        menuPortalTarget={ctx.menuPortalTarget}
        handleLineItemChange={ctx.handleLineItemChange}
        handleMakeSelectChange={ctx.handleMakeSelectChange}
        handleMakeCreate={ctx.handleMakeCreate}
        handleModelSelectChange={ctx.handleModelSelectChange}
        handleModelCreate={ctx.handleModelCreate}
        currency={ctx.currency}
        removeLineItem={ctx.removeLineItem}
        toTitleCase={ctx.toTitleCase}
      />

      <button style={{display: 'block'}} type="button" className="add-btn" onClick={ctx.addLineItem}>
        Add Item
      </button>

      <button type="submit" className="submit-btn">Generate Invoice</button>
      <button className="submit-btn" type="button" onClick={ctx.generateDummyInvoiceData}>Fill Invoice</button>
      <button className="submit-btn" type="button" onClick={ctx.handlePreview}>Preview Invoice</button>
    </form>
  );
};

export default AdminInvoiceForm;
