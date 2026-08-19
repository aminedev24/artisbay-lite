import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApiFetch } from './adminApi';
import { formatNumberWithUnit } from '../utilities/numberFormat';
import Pagination from './Pagination';

const NAVY = '#1e3a8a';

const STATUS_LABELS = {
  in_stock:  'In Stock',
  reserved:  'Under Negotiation',
  sold:      'Sold',
};

function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase().trim();
  const map = {
    reserved: 'bg-amber-100 text-amber-700 border-amber-200',
    sold: 'bg-red-100 text-red-700 border-red-200',
  };
  const cls = map[s] || 'bg-green-100 text-green-700 border-green-200';
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${cls}`}>
      {STATUS_LABELS[s] || s || '—'}
    </span>
  );
}

const DETAIL_LABELS = {
  ref_no: 'Ref No',
  year: 'Year',
  make: 'Make',
  model: 'Model',
  model_code: 'Model Code',
  body_type: 'Body Type',
  color: 'Color',
  mileage: 'Mileage',
  fuel: 'Fuel',
  transmission: 'Transmission',
  engine_capacity: 'Engine',
  drive: 'Drive',
  doors: 'Doors',
  seats: 'Seats',
  chassis: 'Chassis No',
};

function InquiryModal({ item, onClose, onDelete, deleting }) {
  const details = item.vehicle_details && typeof item.vehicle_details === 'object'
    ? item.vehicle_details
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-5 border-b border-gray-200" style={{ backgroundColor: NAVY }}>
          <div className="min-w-0">
            <h2 className="font-bebas text-xl sm:text-2xl text-white tracking-wide truncate">Vehicle Inquiry #{item.id}</h2>
            <p className="text-[10px] text-gray-300 mt-0.5 truncate">{item.created_at}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0"><i className="fas fa-times text-lg sm:text-xl" /></button>
        </div>
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Vehicle</p>
            <p className="font-extrabold text-gray-800">{item.vehicle_name || '—'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Ref: {item.vehicle_ref || '—'}</p>
            <div className="mt-2"><StatusBadge status={item.vehicle_status} /></div>
            {details && Object.keys(details).filter(k => DETAIL_LABELS[k]).length > 0 && (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(DETAIL_LABELS).map(([key, label]) => {
                  const val = String(details[key] ?? '').trim();
                  if (!val || val === 'N/A' || val === 'n/a') return null;
                  return (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-1 text-xs">
                      <dt className="text-gray-400">{label}</dt>
                      <dd className="font-semibold text-gray-700 text-right">{['mileage', 'engine_capacity'].includes(key) ? formatNumberWithUnit(val) : val}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
            <p className="font-bold text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
            <p className="text-xs text-gray-500">{item.phone || ''}{item.phone && item.country ? ' · ' : ''}{item.country || ''}{item.city ? `, ${item.city}` : ''}</p>
            {item.address && <p className="text-xs text-gray-500">{item.address}</p>}
          </div>
          {item.message && (
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl border border-gray-200 p-3">{item.message}</p>
            </div>
          )}
          {item.page_url && (
            <p className="text-[10px] text-gray-400">
              Source: <a href={item.page_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{item.page_url}</a>
            </p>
          )}
          <div className="flex gap-2 sm:gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition">Close</button>
            <button onClick={() => onDelete(item.id)} disabled={deleting} className="flex-1 text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70" style={{ backgroundColor: '#dc2626' }}>
              {deleting ? <i className="fas fa-spinner animate-spin" /> : <i className="fas fa-trash" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Inquiries({ showMessage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [detailItem, setDetailItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async (q) => {
    setLoading(true);
    const result = await adminApiFetch('inquiries/getVehicleInquiries.php');
    let list = Array.isArray(result.inquiries) ? result.inquiries : [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(v =>
        (v.name || '').toLowerCase().includes(s) ||
        (v.email || '').toLowerCase().includes(s) ||
        (v.vehicle_ref || '').toLowerCase().includes(s) ||
        (v.vehicle_name || '').toLowerCase().includes(s));
    }
    setItems(list);
    setPage(1);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSearch = (e) => { e.preventDefault(); fetchItems(search); };

  const handleDelete = async (id) => {
    setDeleting(true);
    const result = await adminApiFetch('inquiries/getVehicleInquiries.php', {
      method: 'POST',
      body: { action: 'delete', id },
    });
    setDeleting(false);
    if (result?.status === 'success') {
      showMessage('Inquiry deleted', 'success');
      setDetailItem(null);
      fetchItems(search);
    } else {
      showMessage(result?.message || 'Delete failed', 'error');
    }
  };

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [items.length, itemsPerPage, page, totalPages]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-2 sm:p-4">
          <p className="text-base sm:text-2xl font-extrabold text-gray-800">{items.length}</p>
          <p className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mt-0.5 sm:mt-1">Total Inquiries</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-2 sm:p-4">
          <p className="text-base sm:text-2xl font-extrabold text-gray-800">{items.filter(v => String(v.vehicle_status || '').toLowerCase() === 'reserved').length}</p>
          <p className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-amber-600 mt-0.5 sm:mt-1">Under Negotiation</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-2 sm:p-4 col-span-2 sm:col-span-1">
          <p className="text-base sm:text-2xl font-extrabold text-gray-800">{items.filter(v => String(v.vehicle_status || '').toLowerCase().startsWith('sold')).length}</p>
          <p className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-red-600 mt-0.5 sm:mt-1">Sold Vehicles</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-1 sm:gap-2 w-full sm:flex-1 sm:min-w-0">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, ref…" className="flex-1 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none min-w-0" />
          <button type="submit" className="text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition" style={{ backgroundColor: NAVY }}><i className="fas fa-search sm:hidden" /><span className="hidden sm:inline">Search</span></button>
        </form>
        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }} className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:border-primary">
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 sm:py-16"><i className="fas fa-circle-notch animate-spin text-xl sm:text-2xl text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 sm:py-12 text-gray-400">
          <i className="fas fa-inbox text-3xl sm:text-4xl mb-2 sm:mb-3 block" />
          <p className="font-bold text-sm sm:text-base">No vehicle inquiries yet</p>
          <p className="text-xs mt-1">Inquiries from the vehicle details page will appear here.</p>
        </div>
      ) : (
        <>
          <div className="md2:hidden space-y-3">
            {pagedItems.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{r.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{r.email}</p>
                  </div>
                  <StatusBadge status={r.vehicle_status} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate flex-1 min-w-0 mr-2">{r.vehicle_name || '—'}</span>
                  <span className="text-gray-400 text-[10px] whitespace-nowrap">#{r.id} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">Ref {r.vehicle_ref || '—'}</span>
                  <button onClick={() => setDetailItem(r)} className="text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-primary/30 hover:bg-primary/5 transition">View</button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md2:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="py-3 text-left pl-2">#</th>
                  <th className="py-3 text-left">Customer</th>
                  <th className="py-3 text-left">Vehicle</th>
                  <th className="py-3 text-left">Ref</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left whitespace-nowrap w-px">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 pl-2 font-mono text-xs text-gray-400">#{r.id}</td>
                    <td className="py-3">
                      <p className="font-bold text-gray-800 text-sm">{r.name || '-'}</p>
                      <p className="text-[10px] text-gray-400">{r.email}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-gray-800 text-xs max-w-[200px] truncate">{r.vehicle_name || '-'}</p>
                      <p className="text-[10px] text-gray-400">{r.country || ''}{r.city ? `, ${r.city}` : ''}</p>
                    </td>
                    <td className="py-3 font-mono text-xs text-gray-500">{r.vehicle_ref}</td>
                    <td className="py-3"><StatusBadge status={r.vehicle_status} /></td>
                    <td className="py-3 text-xs text-gray-400 whitespace-nowrap">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                    <td className="py-3 pr-2 whitespace-nowrap w-px">
                      <button onClick={() => setDetailItem(r)} className="text-primary hover:text-primary/70 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary/5 transition">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {detailItem && (
        <InquiryModal item={detailItem} onClose={() => setDetailItem(null)} onDelete={handleDelete} deleting={deleting} />
      )}
    </div>
  );
}
