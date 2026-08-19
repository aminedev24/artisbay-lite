import { useState, useEffect } from 'react';
import { apiBaseUrl } from '../utilities/apiBase';

export default function EditDepositForm({ deposit, onSave, onCancel }) {
  // Initialize form data with parsed conversions and rates
  const apiUrl = apiBaseUrl;

const [formData, setFormData] = useState(() => {
  // Safely parse conversion_rates regardless of how it comes
  let rates = {};
  if (deposit.conversion_rates) {
    try {
      rates = typeof deposit.conversion_rates === 'string' 
        ? JSON.parse(deposit.conversion_rates) 
        : deposit.conversion_rates;
    } catch (e) {
      console.error("Error parsing conversion rates:", e);
    }
  }

  // Safely parse conversions
  let conversions = {};
  if (deposit.conversions) {
    try {
      conversions = typeof deposit.conversions === 'string'
        ? JSON.parse(deposit.conversions)
        : deposit.conversions;
    } catch (e) {
      console.error("Error parsing conversions:", e);
    }
  }

  return {
    ...deposit,
    conversion_rates: rates,
    conversions: conversions
  };
});

  useEffect(() => {
  console.log("Deposit data:", deposit);
}, [deposit]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

const calculateConvertedAmount = (amount, fromCurrency, targetCurrency) => {
  const rates = formData.conversion_rates;
  
  // If converting from JPY to another currency
  if (fromCurrency === 'JPY' && rates[targetCurrency]) {
    return amount / rates[targetCurrency];
  }
  
  // If converting to JPY from another currency
  if (targetCurrency === 'JPY' && rates[fromCurrency]) {
    return amount * rates[fromCurrency];
  }
  
  // If converting between two non-JPY currencies
  if (rates[fromCurrency] && rates[targetCurrency]) {
    return amount * (rates[targetCurrency] / rates[fromCurrency]);
  }

  console.warn(`Missing rate for ${fromCurrency} or ${targetCurrency}`);
  return 0;
};

  // Handle field changes
 // Updated handleChange function
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => {
    const updated = { ...prev, [name]: value };
    
    // Recalculate conversions when amount or currency changes
    if (name === 'amount' || name === 'currency') {
      const newConversions = {};
      Object.keys(updated.conversion_rates).forEach(currency => {
        if (currency !== updated.currency) {
          newConversions[currency] = calculateConvertedAmount(
            parseFloat(updated.amount) || 0,
            updated.currency,
            currency
          );
        }
      });
      updated.conversions = newConversions;
    }
    
    return updated;
  });
};

  // Handle conversion rate edits (read-only in this version)
  const handleConversionChange = (currency, value) => {
    setFormData(prev => ({
      ...prev,
      conversions: {
        ...prev.conversions,
        [currency]: parseFloat(value) || 0
      }
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/finance/deposits/editDeposit.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          swift_details: formData.swift_details,
          note: formData.note,
          staff: formData.staff,
          consumption_type: formData.consumption_type,
          consumption_value: formData.consumption_value,
          conversions: formData.conversions
        }),
        credentials: 'include'
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Update failed');
      
      onSave(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Deposit</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Swift Details</label>
                <input
                  type="text"
                  name="swift_details"
                  value={formData.swift_details || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Staff</label>
                <input
                  type="text"
                  name="staff"
                  value={formData.staff || ''}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Purpose</label>
                <select
                  name="consumption_type"
                  value={formData.consumption_type}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="car">Car</option>
                  <option value="guaranty">Guaranty</option>
                  <option value="extra">Extra Guaranty</option>
                </select>
              </div>
            </div>

            {/* Conversion Display */}
            <div className="md:col-span-2 border-t pt-4">
              <h3 className="font-medium mb-2">Conversions (Based on Original Rates)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(formData.conversion_rates || {}).map(([currency, rate]) => {
                  if (currency === formData.currency) return null;
                  return (
                    <div key={currency} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{currency}:</span>
                        <span className="text-sm text-gray-600">
                          Rate: {rate} {formData.currency}/{currency}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={formData.conversions[currency]?.toFixed(2) || ''}
                        onChange={(e) => handleConversionChange(currency, e.target.value)}
                        className="w-full border p-2 rounded bg-white"
                        readOnly // Remove this to allow manual edits
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block mb-1">Notes</label>
              <textarea
                name="note"
                value={formData.note || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}