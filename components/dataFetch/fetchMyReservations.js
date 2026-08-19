// fetchMyReservations.js — "My Reservations" tab on the customer profile.
// Shows active holds (reserved / under negotiation) on vehicles the user has
// started a purchase for.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiBaseUrl } from "../utilities/apiBase";

const STATUS_COLORS = {
  reserved:        "bg-amber-100 text-amber-700 border-amber-200",
  pending_payment: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUS_LABELS = {
  reserved:        "Reserved",
  pending_payment: "Under Negotiation",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${STATUS_COLORS[status] || STATUS_COLORS.reserved}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

const MyReservations = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/inventory/cars/fetchMyReservations.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch reservations");
        return response.json();
      })
      .then((data) => {
        setReservations(Array.isArray(data.reservations) ? data.reservations : []);
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
      <p className="mb-6 text-sm text-[var(--grey-text)]">Vehicles currently held for you.</p>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-white py-16 text-center">
          <i className="fas fa-calendar-check mb-3 block text-4xl text-gray-300" />
          <p className="font-bold text-[var(--text-color)]">No active reservations</p>
          <p className="mt-1 text-sm text-[var(--grey-text)]">
            Reservations appear here once our team holds a vehicle for you.
          </p>
          <button
            onClick={() => router.push("/stock-list")}
            className="mt-4 rounded-md bg-[var(--accent-color)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--accent-color-hover)]"
          >
            Browse stock
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--grey-text)]">
                <th className="py-3 pl-4 text-left">Vehicle</th>
                <th className="py-3 text-left">Ref</th>
                <th className="py-3 text-right">Agreed</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 pr-4 text-left">Held until</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 pl-4">
                    <button
                      onClick={() => router.push(`/vehicle/${encodeURIComponent(String(r.vehicle_ref || ""))}`)}
                      className="font-bold text-[var(--primary-color)] hover:underline"
                    >
                      {[r.year, r.make, r.model].filter(Boolean).join(" ") || r.vehicle_ref || "-"}
                    </button>
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
                    {r.expires_at ? new Date(r.expires_at).toLocaleDateString("en-US") : "-"}
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

export default MyReservations;
