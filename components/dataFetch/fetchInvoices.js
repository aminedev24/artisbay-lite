import { apiBaseUrl } from '../utilities/apiBase';
import { formatNumber } from '../utilities/numberFormat';
import React, { useState, useEffect } from "react";
import DataPagination from '../common/dataPagination';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [invoiceNumberFilter, setInvoiceNumberFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [paymentPurposeFilter, setPaymentPurposeFilter] = useState("");

  const apiUrl = apiBaseUrl;

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/finance/invoices/fetchInvoices.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const sortedData = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setInvoices(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceNumberMatch = (invoice.invoice_number || '')
      .toLowerCase()
      .includes(invoiceNumberFilter.toLowerCase());
    const descriptionMatch = (invoice.description || '')
      .toLowerCase()
      .includes(descriptionFilter.toLowerCase());
    const dateMatch = (invoice.created_at || '')
      .toLowerCase()
      .includes(dateFilter.toLowerCase());
    const paymentPurposeMatch = (invoice.deposit_purpose || '')
      .toLowerCase()
      .includes(paymentPurposeFilter.toLowerCase());
    return invoiceNumberMatch && descriptionMatch && dateMatch && paymentPurposeMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  const clearFilters = () => {
    setInvoiceNumberFilter("");
    setDescriptionFilter("");
    setDateFilter("");
    setPaymentPurposeFilter("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="profile-wrapper" style={{ alignItems: "center" }}>
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  const invoiceHeaders = [
    "Invoice Number",
    "Amount",
    "Date",
    "Payment Purpose",
    "Vehicle Description",
  ];

  return (
    <div>
      <p className="data-count">
        Showing {currentInvoices.length} of {filteredInvoices.length} invoice
        {filteredInvoices.length === 1 ? '' : 's'}
      </p>

      <div className="data-filter-bar">
        <div className="form-group">
          <label htmlFor="filterNumber">Invoice number</label>
          <input
            id="filterNumber"
            type="text"
            placeholder="e.g. INV-001"
            value={invoiceNumberFilter}
            onChange={(e) => {
              setInvoiceNumberFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="byDescription">Description</label>
          <input
            id="byDescription"
            type="text"
            placeholder="Search description"
            value={descriptionFilter}
            onChange={(e) => {
              setDescriptionFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="byDate">Date</label>
          <input
            id="byDate"
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="byPurpose">Payment purpose</label>
          <input
            id="byPurpose"
            type="text"
            placeholder="Search purpose"
            value={paymentPurposeFilter}
            onChange={(e) => {
              setPaymentPurposeFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button className="filter-reset-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="table-scroll">
        <table className="profile-table">
          <thead>
            <tr>
              {invoiceHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice, index) => (
                <tr key={`${invoice.invoice_number || invoice.id}-${index}`}>
                  <td>{invoice.invoice_number || '—'}</td>
                  <td>
                    {formatNumber(invoice.deposit_amount)}
                    {invoice.deposit_currency &&
                    !String(invoice.deposit_amount)
                      .toLowerCase()
                      .includes(String(invoice.deposit_currency).toLowerCase())
                      ? ` ${invoice.deposit_currency}`
                      : ''}
                  </td>
                  <td>{formatDate(invoice.created_at)}</td>
                  <td>{invoice.deposit_purpose || '—'}</td>
                  <td>
                    {[invoice.make, invoice.model].filter(Boolean).join(' ') ||
                      invoice.vehicle_description ||
                      "not specified"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="5">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DataPagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InvoiceList;
