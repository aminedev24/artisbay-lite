import { useEffect, useState } from "react";
import EditDepositForm from "../forms/editDepositForm";
import { apiBaseUrl } from '../utilities/apiBase';

export default function DepositsTable() {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editing, setEditing] = useState(null);


  // API URL setup
  const apiUrl = apiBaseUrl;

  useEffect(() => {
    fetch(`${apiUrl}/finance/deposits/fetchDeposits.php`, {
      method: "GET",
      credentials: "include", // Ensures cookies are sent with the request
    })
      .then((response) => response.json())
      .then((data) => {
        setDeposits(data);
        setFilteredDeposits(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [apiUrl]);

  // Filter deposits based on date range
  const filterDeposits = () => {
    let filtered = deposits;

    if (startDate) {
      filtered = filtered.filter(deposit => deposit.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(deposit => deposit.date <= endDate);
    }

    setFilteredDeposits(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredDeposits(deposits);
  };

  return (
    <div className="p-4">

      {/* Filter Inputs */}
      <div className="filter-container">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
          placeholder="End Date"
        />
      
        <button
          onClick={filterDeposits}
          className="filter-button search"
        >
          Search
        </button>
        <button
          onClick={clearFilters}
          className="filter-button clear"
        >
          Clear
        </button>
      </div>

      {/* Deposits Table */}
      <table className="deposits-table w-full border-collapse border border-gray-300 text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Consumption</th>
            <th className="border p-2">Staff</th>
            <th className="border p-2">Swift Details</th>
            <th className="border p-2">Exchange Currency</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Balance</th>
            
            
          </tr>
        </thead>
        <tbody>
          {filteredDeposits.length > 0 ? (
            filteredDeposits.map((deposit) => (
              <tr key={deposit.id} className="border">
                <td className="border p-2">{deposit.date}</td>
                <td className="border p-2">
                  {Number(deposit.amount).toLocaleString()} {deposit.currency}
                </td>
                <td className="border p-2">
                  {deposit.consumption_type || 'not specified'}
                  <br />
                  {deposit.consumption_type === 'car'
                    ? `(Stock ID: ${deposit.consumption_value})`
                    : deposit.consumption_type === 'guaranty'
                    ? `(Guaranty: ${deposit.consumption_value} ${deposit.currency})`
                    : deposit.consumption_type === 'extra'
                    ? `(Extra Guaranty: ${deposit.consumption_value} ${deposit.currency})`
                    : ''}
                </td>
                <td className="border p-2">{deposit.staff || 'not specified'}</td>
                <td className="border p-2">{deposit.swift_details || 'not specified'}</td>
                <td className="border p-2">
                  {deposit.conversions ? (
                    // Parse the JSON string if it wasn't decoded on the server
                    Object.entries(JSON.parse(deposit.conversions)).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {Number(value).toLocaleString().substr(0,5)}
                      </div>
                    ))
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{whiteSpace: 'pre-wrap'}}>{deposit.note}</td>
                <td className="border p-2">
                  {deposit.leftover} {deposit.currency || 'not specified'}
                </td>
             
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}