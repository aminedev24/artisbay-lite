import React from 'react';
import Tooltip from '../utilities/toolTip';
import Modal from '../common/alertModal';
import useAccountancyForm from './accountancyForm2/useAccountancyForm';

const AccountancyForm = () => {
  const {
    date, setDate,
    amount, setAmount,
    remitter, setRemitter,
    country, setCountry,
    consumptionType, setConsumptionType,
    consumptionValue, setConsumptionValue,
    swiftDetails, setSwiftDetails,
    note, setNote,
    staff, setStaff,
    currencies,
    selectedCurrency, setSelectedCurrency,
    users,
    selectedUserId, setSelectedUserId,
    newUserName, setNewUserName,
    showModal, modalMessage, modalType,
    bankFees, setBankFees,
    editingCurrency, setEditingCurrency,
    conversionEdits, setConversionEdits,
    conversionRates, setConversionRates,
    editingRate, setEditingRate,
    rateEdits, setRateEdits,
    getConvertedAmount,
    handleCloseModal,
    handleSubmit,
    formatDynamicNumber,
  } = useAccountancyForm();

  return (
    <div className="accountancy-container">
      <h1>Income</h1>
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          type={modalType}
        />
      )}

      <form onSubmit={handleSubmit} className="accountancyForm">
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Amount:
          <input
            type="text"
            value={amount.toLocaleString()}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, '');
              setAmount(rawValue === '' ? '' : Number(rawValue));
            }}
            required
          />
        </label>

        <label>
          Currency:
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            required
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label>
          Bank Fees:
          <input
            type="text"
            value={bankFees.toLocaleString()}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, '');
              setBankFees(rawValue === '' ? '' : Number(rawValue));
            }}
          />
        </label>

        <div className="conversion-rates">
          <h3>Conversion Rates</h3>
          {currencies
            .filter(currency => currency !== selectedCurrency)
            .map(currency => (
              <div key={currency} className="rate-row">
                <span>{currency}:</span>
                {editingRate === currency ? (
                  <>
                    <input
                      type="number"
                      step="0.0001"
                      value={rateEdits[currency] || conversionRates[currency]}
                      onChange={(e) =>
                        setRateEdits({
                          ...rateEdits,
                          [currency]: e.target.value
                        })
                      }
                    />
                    <button
                      type="button"
                      className="px-2 py-1 text-xs rounded ml-2 bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        setConversionRates({
                          ...conversionRates,
                          [currency]: Number(rateEdits[currency])
                        });
                        setEditingRate(null);
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{conversionRates[currency]}</span>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs rounded ml-2 bg-gray-200 hover:bg-gray-300"
                      onClick={() => setEditingRate(currency)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>

        <div className="converted-values">
          <h3>Converted Amounts</h3>
          {currencies
            .filter(currency => currency !== selectedCurrency)
            .map(currency => (
              <div key={currency} className="conversion-row">
                <span>{currency}:</span>
                {editingCurrency === currency ? (
                  <>
                    <input
                      type="number"
                      value={conversionEdits[currency] || getConvertedAmount(currency)}
                      onChange={(e) =>
                        setConversionEdits({
                          ...conversionEdits,
                          [currency]: e.target.value
                        })
                      }
                    />
                    <button
                      type="button"
                      className="px-2 py-1 text-xs rounded ml-2 bg-gray-200 hover:bg-gray-300"
                      onClick={() => setEditingCurrency(null)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{formatDynamicNumber(
                      conversionEdits[currency] || getConvertedAmount(currency)
                    )}</span>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs rounded ml-2 bg-gray-200 hover:bg-gray-300"
                      onClick={() => {
                        setEditingCurrency(currency);
                        setConversionEdits({
                          ...conversionEdits,
                          [currency]: getConvertedAmount(currency).toFixed(4)
                        });
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>

        <label>
          Remitter:
          <input
            type="text"
            value={remitter}
            onChange={(e) => setRemitter(e.target.value)}
            required
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <label>
          Purpose:
          <select
            value={consumptionType}
            onChange={(e) => setConsumptionType(e.target.value)}
          >
            <option value="car">Car Purchase</option>
            <option value="guaranty">Guaranty</option>
            <option value="extra">Extra Guaranty</option>
          </select>
        </label>

        <label>
          {consumptionType === 'car' ? 'Stock ID' :
           consumptionType === 'guaranty' ? 'Guaranty Amount' : 'Extra Amount'}:
          <input
            type="text"
            value={consumptionValue}
            onChange={(e) => setConsumptionValue(e.target.value)}
            required
          />
        </label>

        <label>
          SWIFT Details:
          <Tooltip message="Payment reference that will appear on bank statement" />
          <input
            type="text"
            value={swiftDetails}
            onChange={(e) => setSwiftDetails(e.target.value)}
            required
          />
        </label>

        <label>
          Staff:
          <input
            type="text"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            required
          />
        </label>

        <label>
          Customer:
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
            <option value="new">+ New Customer</option>
          </select>
        </label>

        {selectedUserId === 'new' && (
          <label>
            New Customer Name:
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </label>
        )}

        <label>
          Notes:
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </label>

        <button type="submit" className="submit-button">
          Record Deposit
        </button>
      </form>
    </div>
  );
};

export default AccountancyForm;
