import { apiBaseUrl } from '../utilities/apiBase';
import React, { useEffect, useState } from "react";
import DataPagination from '../common/dataPagination';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const InquiryList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const apiUrl = apiBaseUrl;

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/customers/getInqueries.php`, {
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
        setVehicles(Array.isArray(data) ? data : []);
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

  const totalPages = Math.max(1, Math.ceil(vehicles.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safePage * itemsPerPage;
  const currentVehicles = vehicles.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p className="data-count">
        {vehicles.length} vehicle {vehicles.length === 1 ? 'inquiry' : 'inquiries'}
      </p>
      <div className="table-scroll">
        <table className="profile-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Ref No</th>
              <th>Status</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle, index) => (
                <tr key={`${vehicle.created_at}-${index}`}>
                  <td>{vehicle.vehicle_name || '—'}</td>
                  <td>{vehicle.vehicle_ref || '—'}</td>
                  <td>{vehicle.vehicle_status || '—'}</td>
                  <td>{(vehicle.message || '—').length > 100 ? `${vehicle.message.slice(0, 100)}…` : vehicle.message || '—'}</td>
                  <td>{formatDate(vehicle.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="5">No vehicle inquiries found.</td>
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

export default InquiryList;
