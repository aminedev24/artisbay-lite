// fetchMyOrders.js — "My Orders" tab on the customer profile.
// Shows the purchase history: reservations that progressed past the hold
// stage (payment received, shipped, delivered, cancelled, expired).

import { useEffect, useState } from "react";
import { apiBaseUrl } from "../utilities/apiBase";

const STATUS_COLORS = {
  payment_received: "bg-blue-100 text-blue-700 border-blue-200",
  ordered:          "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped:          "bg-orange-100 text-orange-700 border-orange-200",
  delivered:        "bg-green-100 text-green-700 border-green-200",
  cancelled:        "bg-red-100 text-red-700 border-red-200",
  expired:          "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_LABELS = {
  payment_received: "Payment Received",
  ordered:          "Ordered",
  shipped:          "Shipped",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
  expired:          "Expired",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${STATUS_COLORS[status] || STATUS_COLORS.expired}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/inventory/cars/fetchMyReservations.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch orders");
        return response.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <i className="fas fa-circle-notch animate-spin text-2xl text-[var(--primary-color)]" />
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-sm text-red-600">Error: {error}</p>;
  }

  return (
    <div>
      <p className="mb-6 text-sm text-[var(--grey-text)]">Your vehicle purchase history.</p>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-white py-16 text-center">
          <i className="fas fa-shipping-fast mb-3 block text-4xl text-gray-300" />
          <p className="font-bold text-[var(--text-color)]">No orders yet</p>
          <p className="mt-1 text-sm text-[var(--grey-text)]">
            Your purchase history will appear here once you have placed an order.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--grey-text)]">
                <th className="py-3 pl-4 text-left">Vehicle</th>
                <th className="py-3 text-left">Ref</th>
                <th className="py-3 text-right">Total</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 pr-4 text-left">Order date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 pl-4">
                    <p className="font-bold text-[var(--text-color)]">
                      {[r.year, r.make, r.model].filter(Boolean).join(" ") || r.vehicle_ref || "-"}
                    </p>
                    {r.destination_country && (
                      <p className="text-[10px] text-[var(--grey-text)]">Dest: {r.destination_country}</p>
                    )}
                  </td>
                  <td className="py-3 font-mono text-xs text-[var(--grey-text)]">{r.vehicle_ref}</td>
                  <td className="py-3 text-right font-extrabold text-[var(--text-color)]">
                    {r.currency || "USD"} {Number(r.price || 0).toLocaleString("en-US")}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-xs text-[var(--grey-text)]">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString("en-US") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
