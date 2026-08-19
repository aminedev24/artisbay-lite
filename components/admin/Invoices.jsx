import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApiFetch } from './adminApi';
import { formatNumberWithUnit } from '../utilities/numberFormat';
import Pagination from './Pagination';
const NAVY = '#1e3a8a';
const SKY = '#1da1f2';
const ORANGE = '#f1892b';

const STATUS_STYLES = {
  paid: 'bg-green-50 border-green-200 text-green-700',
  sent: 'bg-blue-50 border-blue-200 text-blue-700',
  cancelled: 'bg-red-50 border-red-200 text-red-700',
  draft: 'bg-gray-50 border-gray-200 text-gray-500',
};

const STATUS_ICONS = {
  paid: 'fa-check-circle',
  sent: 'fa-paper-plane',
  cancelled: 'fa-times-circle',
  draft: 'fa-file',
};

// DB stores deposit_amount as a display string like "2,000 USD" or "2000 USD".
// Parse out the numeric part so we never render NaN, and keep the currency.
const parseAmount = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const str = String(value).trim();
  const match = str.match(/^(-?[\d,.]+)\s*([A-Za-z€£¥$]*)$/);
  if (!match) return str;
  const num = Number(match[1].replace(/,/g, ''));
  if (Number.isNaN(num)) return str;
  const currency = match[2] || '';
  return { num, currency };
};

const amountLabel = (inv) => {
  const parsed = parseAmount(inv.deposit_amount);
  if (!parsed) return inv.deposit_currency || '—';
  if (typeof parsed === 'string') return parsed;
  return `${parsed.currency || inv.deposit_currency || ''} ${parsed.num.toLocaleString()}`.trim();
};

const vehicleLabel = (inv) => {
  const make = inv.make || '';
  const model = inv.model || '';
  const desc = inv.vehicle_description || '';
  return [make, model].filter(Boolean).join(' ') || desc || '—';
};

function StatusBadge({ inv }) {
  const status = inv.status || 'draft';
  return (
    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
      <i className={`fas ${STATUS_ICONS[status] || 'fa-file'}`} />
      {status}
    </span>
  );
}

export default function Invoices({ showMessage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const result = await adminApiFetch('finance/invoices/adminFetchInvoices.php');
    if (Array.isArray(result)) setItems(result);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (invoiceNumber) => {
    if (!confirm('Delete this invoice?')) return;
    const result = await adminApiFetch(`finance/invoices/manageInvoices.php?invoice_number=${encodeURIComponent(invoiceNumber)}`, { method: 'DELETE' });
    if (result?.success) { showMessage('Deleted', 'success'); fetchItems(); }
    else showMessage(result?.error || 'Failed to delete', 'error');
  };

  const handleRegenerate = (inv) => {
    const parsed = parseAmount(inv.deposit_amount);
    const invoiceData = {
      make:                inv.make || '',
      model:               inv.model || '',
      vehicle_ref:         inv.vehicle_ref || '',
      chasis_number:       inv.chasis_number || '',
      engine_capacity:     inv.engine_capacity || '',
      mileage:             inv.mileage || '',
      vehicle_description: inv.vehicle_description || '',
      deposit_amount:      parsed && typeof parsed === 'object' ? parsed.num : inv.deposit_amount || '',
      deposit_currency:    inv.deposit_currency || (parsed && typeof parsed === 'object' ? parsed.currency : '') || 'USD',
      deposit_purpose:     inv.deposit_purpose || 'Paying My Vehicle',
      description:         inv.description || '',
      customer_name:       inv.customer_name || '',
      email:               inv.email || '',
      invoice_number:      inv.invoice_number || '',
      created_at:          inv.created_at || '',
    };
    const payloadString = JSON.stringify(invoiceData);
    try { sessionStorage.setItem('invoiceData', payloadString); } catch {}
    try { localStorage.setItem('invoiceData', payloadString); } catch {}
    window.open('/invoice-generator?regenerate=true', '_blank', 'noopener,noreferrer');
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pagedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  useEffect(() => {
    const max = Math.max(1, Math.ceil(items.length / itemsPerPage));
    if (page > max) setPage(max);
  }, [items.length, itemsPerPage, page]);

  const openCreate = () => {
    window.open('/invoice-generator', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <h3 className="font-bebas text-xl md:text-2xl tracking-wide" style={{ color: NAVY }}>Invoices</h3>
        <div className="flex gap-2 flex-wrap">
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
            className="border-2 border-gray-200 rounded-lg px-2 md:px-3 py-2 text-xs focus:outline-none" style={{ borderColor: '#d1d5db' }}
          >
            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button onClick={openCreate}
            className="text-white px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase hover:opacity-90 transition flex items-center gap-1" style={{ backgroundColor: NAVY }}>
            <i className="fas fa-plus" /> Create
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><i className="fas fa-circle-notch animate-spin text-2xl" style={{ color: NAVY }} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 sm:py-12 text-gray-400">
          <i className="fas fa-file-invoice text-3xl sm:text-4xl mb-2 sm:mb-3 block" />
          <p className="font-bold text-sm sm:text-base">No invoices yet</p>
        </div>
      ) : (
        <>
          <div className="md2:hidden space-y-3 p-4">
            {pagedItems.map((inv) => (
              <div key={inv.invoice_number} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-bold text-gray-800">{inv.invoice_number}</p>
                    <p className="text-[10px] text-gray-400 truncate">{inv.customer_name}</p>
                  </div>
                  <StatusBadge inv={inv} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate flex-1 min-w-0 mr-2">{vehicleLabel(inv)}</span>
                  <span className="font-extrabold text-gray-900 whitespace-nowrap">{amountLabel(inv)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 truncate">{inv.email}</span>
                  <div className="flex gap-1.5 items-center shrink-0">
                    <button onClick={() => setDetailItem(inv)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition" title="Details"><i className="fas fa-eye text-sm" /></button>
                    <button onClick={() => handleRegenerate(inv)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition" title="Regenerate Invoice"><i className="fas fa-sync-alt text-sm" /></button>
                    <button onClick={() => handleDelete(inv.invoice_number)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition" title="Delete"><i className="fas fa-trash-alt text-sm" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md2:block overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Invoice #</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Vehicle</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap w-px">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedItems.map((inv) => (
                  <tr key={inv.invoice_number} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <p className="font-mono text-[10px] md:text-xs font-semibold text-gray-900">{inv.invoice_number}</p>
                      {inv.created_at && <p className="text-[9px] text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</p>}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <p className="font-semibold text-gray-900">{inv.customer_name}</p>
                      <p className="text-[10px] text-gray-400">{inv.email}</p>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-gray-600">{vehicleLabel(inv)}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-900 whitespace-nowrap">{amountLabel(inv)}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4"><StatusBadge inv={inv} /></td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap w-px">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setDetailItem(inv)} className="text-gray-400 hover:text-gray-600 transition" title="Details"><i className="fas fa-eye text-sm" /></button>
                        <button onClick={() => handleRegenerate(inv)} className="text-blue-500 hover:text-blue-700 transition" title="Regenerate Invoice"><i className="fas fa-sync-alt text-sm" /></button>
                        <button onClick={() => handleDelete(inv.invoice_number)} className="text-red-400 hover:text-red-600 transition" title="Delete"><i className="fas fa-trash-alt text-sm" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 pb-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
<div className="flex justify-between items-center mb-4">
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>Invoice Details</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Invoice #</span><p className="font-semibold font-mono">{detailItem.invoice_number}</p></div>
                <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Status</span><StatusBadge inv={detailItem} /></div>
                {detailItem.created_at && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Date</span><p>{new Date(detailItem.created_at).toLocaleDateString()}</p></div>}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><p className="font-semibold text-gray-900">{detailItem.customer_name}</p></div>
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Email</span><p className="text-gray-700">{detailItem.email || '—'}</p></div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Vehicle</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Make / Model</span><p>{vehicleLabel(detailItem)}</p></div>
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Chassis</span><p>{detailItem.chasis_number || '—'}</p></div>
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Mileage</span><p>{formatNumberWithUnit(detailItem.mileage) || '—'}</p></div>
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Engine</span><p>{formatNumberWithUnit(detailItem.engine_capacity) || '—'}</p></div>
                  {detailItem.vehicle_description && <div className="col-span-2"><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Description</span><p className="text-gray-700">{detailItem.vehicle_description}</p></div>}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Payment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Deposit</span><p className="font-semibold">{amountLabel(detailItem)}</p></div>
                  <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Purpose</span><p>{detailItem.deposit_purpose || '—'}</p></div>
                  {detailItem.description && <div className="col-span-2"><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Description</span><p className="text-gray-700">{detailItem.description}</p></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
