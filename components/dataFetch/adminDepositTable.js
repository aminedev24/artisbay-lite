import { useEffect, useMemo, useState } from "react";
import useCheckScreenSize from "../utilities/screenSize";
import EditDepositForm from "../forms/editDepositForm";
import { apiBaseUrl as apiBase } from "../utilities/apiBase";

const AdminDepositsTable = () => {
  const [deposits, setDeposits] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeposit, setEditingDeposit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSmallScreen } = useCheckScreenSize();

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiBase}/finance/deposits/adminFetchDeposits.php`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Expected array of deposits but got: " + JSON.stringify(data),
          );
        }

        const processed = data.map((deposit) => ({
          ...deposit,
          conversions:
            typeof deposit.conversions === "string"
              ? JSON.parse(deposit.conversions || "{}")
              : deposit.conversions || {},
        }));

        setDeposits(processed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const afterStart = startDate ? deposit.date >= startDate : true;
      const beforeEnd = endDate ? deposit.date <= endDate : true;
      const search = searchTerm.toLowerCase();
      const matchesSearch = searchTerm
        ? (deposit.name || "").toLowerCase().includes(search) ||
          (deposit.email || "").toLowerCase().includes(search) ||
          (deposit.phone || "").toLowerCase().includes(search) ||
          (deposit.swift_details || "").toLowerCase().includes(search) ||
          (deposit.consumption_value || "").toLowerCase().includes(search)
        : true;
      return afterStart && beforeEnd && matchesSearch;
    });
  }, [deposits, startDate, endDate, searchTerm]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  const formatAmount = (amount, currency) =>
    amount
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency || "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
      : "—";

  const consumptionDetails = (deposit) => {
    if (!deposit.consumption_type) return "Not specified";
    if (deposit.consumption_type === "car") {
      return (
        <>
          Car purchase
          <br />
          <span className="text-xs text-slate-500">
            Stock ID: {deposit.consumption_value || "N/A"}
          </span>
        </>
      );
    }
    if (deposit.consumption_type === "guaranty") {
      return `Guaranty: ${deposit.consumption_value || 0} ${
        deposit.currency || ""
      }`;
    }
    if (deposit.consumption_type === "extra") {
      return `Extra Guaranty: ${deposit.consumption_value || 0} ${
        deposit.currency || ""
      }`;
    }
    return deposit.consumption_type;
  };

  const renderConversions = (deposit) => {
    const conversions = deposit.conversions || {};
    const entries = Object.entries(conversions);
    if (!entries.length) return "N/A";
    return entries.map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong>{" "}
        {Number(value).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}
      </div>
    ));
  };

  const renderDesktopTable = () => (
    <div className="overflow-x-auto">
      <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80">
        <table className="w-full min-w-[1024px] border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-xs uppercase tracking-[0.35em] text-white">
              <th className="px-5 py-4 text-left  text-xs">Date</th>
              <th className="px-5 py-4 text-left  text-xs">Amount</th>
              <th className="px-5 py-4 text-left  text-xs">Consumption</th>
              <th className="px-5 py-4 text-left  text-xs">Staff</th>
              <th className="px-5 py-4 text-left  text-xs">Swift Details</th>
              <th className="px-5 py-4 text-left text-xs" >Exchange</th>
              <th className="px-5 py-4 text-left text-xs">Note</th>
              <th className="px-5 py-4 text-left text-xs">Balance</th>
              <th className="px-5 py-4 text-center text-xs">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.length ? (
              filteredDeposits.map((deposit, idx) => (
                <tr
                  key={deposit.id}
                  className={`transition hover:-translate-y-0.5 hover:bg-slate-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-5 py-4 text-slate-700 text-xs">{deposit.date}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800 text-xs">
                    {formatAmount(deposit.amount, deposit.currency)}
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-xs">
                    {consumptionDetails(deposit)}
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-xs">
                    {deposit.staff || "Not specified"}
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-xs">
                    {deposit.swift_details || "Not specified"}
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-xs">
                    {renderConversions(deposit)}
                  </td>
                  <td className="px-5 py-4 text-slate-700 whitespace-pre-wrap text-xs">
                    {deposit.note || "—"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800 text-xs">
                    {formatAmount(deposit.leftover, deposit.currency)}
                  </td>
                  <td className="px-5 py-4 text-center text-xs">
                    <button
                      className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.03]"
                      onClick={() => setEditingDeposit(deposit)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-6 text-center text-slate-500 text-xs"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMobileCards = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {filteredDeposits.length ? (
        filteredDeposits.map((deposit) => (
          <div
            key={deposit.id}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-lg shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {deposit.date}
              </p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {deposit.currency}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              {formatAmount(deposit.amount, deposit.currency)}
            </h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-500">
                  Consumption:
                </span>{" "}
                {consumptionDetails(deposit)}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Staff:</span>{" "}
                {deposit.staff || "Not specified"}
              </p>
              <p>
                <span className="font-semibold text-slate-500">
                  Swift Details:
                </span>{" "}
                {deposit.swift_details || "Not specified"}
              </p>
              <p>
                <span className="font-semibold text-slate-500">
                  Exchange:
                </span>{" "}
                {renderConversions(deposit)}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Note:</span>{" "}
                {deposit.note || "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Balance:</span>{" "}
                {formatAmount(deposit.leftover, deposit.currency)}
              </p>
            </div>
            <button
              className="mt-4 w-full rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
              onClick={() => setEditingDeposit(deposit)}
            >
              Edit
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-500">No records found.</p>
      )}
    </div>
  );

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Admin Deposits
          </h1>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-lg shadow-slate-200/60 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner shadow-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner shadow-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, email, phone..."
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner shadow-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={clearFilters}
            className="w-full rounded-full bg-gradient-to-r from-slate-200 to-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm transition hover:scale-[1.02]"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-500">Loading deposits...</p>
      ) : !isSmallScreen ? (
        renderDesktopTable()
      ) : (
        renderMobileCards()
      )}

      {editingDeposit && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content add-customer">
            <button
              className="absolute right-4 top-4 rounded-full bg-rose-500 px-2 py-1 text-sm font-semibold text-white"
              onClick={() => setEditingDeposit(null)}
            >
              Close
            </button>
            <EditDepositForm
              deposit={editingDeposit}
              onSave={(updated) => {
                const next = deposits.map((d) =>
                  d.id === updated.id ? updated : d,
                );
                setDeposits(next);
                setEditingDeposit(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepositsTable;
