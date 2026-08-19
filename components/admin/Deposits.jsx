import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApiFetch } from './adminApi';
import Pagination from './Pagination';
const NAVY = '#1e3a8a';
const SKY = '#1da1f2';
const ORANGE = '#f1892b';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  amount: '', remitter: '', country: '', selectedCurrency: 'USD',
  consumptionType: '', consumptionValue: '', swiftDetails: '', note: '', staff: '', bankFees: '0'
};

export default function Deposits({ showMessage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchItems = useCallback(async (q) => {
    setLoading(true);
    const result = await adminApiFetch(`finance/deposits/adminFetchDeposits.php`);
    if (Array.isArray(result)) setItems(result);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setShowForm(true); };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      date: item.date || '', amount: item.amount || '', remitter: item.remitter || '',
      country: item.country || '', selectedCurrency: item.currency || 'USD',
      consumptionType: item.consumption_type || '', consumptionValue: item.consumption_value || '',
      swiftDetails: item.swift_details || '', note: item.note || '', staff: item.staff || '',
      bankFees: item.bank_fees || '0'
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editItem) {
      payload.id = editItem.id;
      const result = await adminApiFetch('finance/deposits/editDeposit.php', { method: 'POST', body: payload });
      if (result?.success) { showMessage(result.message || 'Updated', 'success'); setShowForm(false); fetchItems(); }
      else showMessage(result?.message || 'Failed to update', 'error');
    } else {
      const result = await adminApiFetch('finance/deposits/insertDeposit.php', { method: 'POST', body: payload });
      if (result?.message && !result.message.includes('Error')) { showMessage(result.message, 'success'); setShowForm(false); fetchItems(); }
      else showMessage(result?.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this deposit?')) return;
    showMessage('Delete: feature coming soon', 'error');
  };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pagedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  useEffect(() => {
    const max = Math.max(1, Math.ceil(items.length / itemsPerPage));
    if (page > max) setPage(max);
  }, [items.length, itemsPerPage, page]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
<h3 className="font-bebas text-xl md:text-2xl tracking-wide" style={{ color: NAVY }}>Income / Deposits</h3>
        <div className="flex gap-2 flex-wrap">
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
            className="border-2 border-gray-200 rounded-lg px-2 md:px-3 py-2 text-xs focus:outline-none" style={{ borderColor: '#d1d5db' }}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
          <button onClick={openCreate} className="text-white px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase hover:opacity-90 transition flex items-center gap-1" style={{ backgroundColor: NAVY }}>
            <i className="fas fa-plus" /> Add
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
<div className="flex justify-between items-center mb-4">
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>{editItem ? 'Edit Deposit' : 'Record Deposit'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Date *</label><input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Amount *</label><input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Currency</label><select name="selectedCurrency" value={form.selectedCurrency} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" style={{ borderColor: '#d1d5db' }}><option value="USD">USD</option><option value="JPY">JPY</option><option value="EUR">EUR</option></select></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Bank Fees</label><input name="bankFees" type="number" step="0.01" value={form.bankFees} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Remitter</label><input name="remitter" value={form.remitter} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Country</label><input name="country" value={form.country} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Staff</label><input name="staff" value={form.staff} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Consumption Type</label><select name="consumptionType" value={form.consumptionType} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" style={{ borderColor: '#d1d5db' }}><option value="">Select</option><option value="car_deposit">Car Deposit</option><option value="guaranty">Guaranty</option><option value="extra_guaranty">Extra Guaranty</option><option value="service">Service</option></select></div>
              <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Consumption Value</label><input name="consumptionValue" value={form.consumptionValue} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div className="col-span-2"><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">SWIFT Details</label><textarea name="swiftDetails" value={form.swiftDetails} onChange={handleChange} rows={2} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div className="col-span-2"><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Note</label><textarea name="note" value={form.note} onChange={handleChange} rows={2} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} /></div>
              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-xs font-bold uppercase text-gray-600 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="text-white px-6 py-2 rounded-lg text-xs font-bold uppercase hover:opacity-90 transition" style={{ backgroundColor: NAVY }}>{editItem ? 'Update' : 'Save'} Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

{loading ? (
        <div className="flex justify-center py-12"><i className="fas fa-circle-notch animate-spin text-2xl" style={{ color: NAVY }} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 sm:py-12 text-gray-400">
          <i className="fas fa-coins text-3xl sm:text-4xl mb-2 sm:mb-3 block" />
          <p className="font-bold text-sm sm:text-base">No deposits recorded</p>
        </div>
      ) : (
        <>
          <div className="md2:hidden space-y-3 p-4">
            {pagedItems.map((d) => (
              <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{d.remitter || d.name || '—'}</p>
                    <p className="text-[10px] text-gray-400">{d.date}</p>
                  </div>
                  <span className="font-extrabold text-gray-900 whitespace-nowrap">{d.currency} {Number(d.amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-gray-500">
                    {d.consumption_type && <span className="text-[10px] font-bold uppercase text-gray-500">{d.consumption_type.replace('_', ' ')}</span>}
                    {d.staff && <span className="text-gray-400">{d.staff}</span>}
                  </div>
                  <div className="flex gap-1.5 items-center shrink-0">
                    <button onClick={() => setDetailItem(d)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><i className="fas fa-eye text-sm" /></button>
                    <button onClick={() => openEdit(d)} style={{ color: SKY }} className="hover:opacity-80 p-1 rounded-lg transition"><i className="fas fa-edit text-sm" /></button>
                  </div>
                </div>
                {d.note && <p className="text-[10px] text-gray-400 italic truncate">{d.note}</p>}
              </div>
            ))}
          </div>
          <div className="hidden md2:block overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Remitter</th>
                  <th className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Staff</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap w-px">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedItems.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-500 whitespace-nowrap">{d.date}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-900 whitespace-nowrap">{d.currency} {Number(d.amount).toLocaleString()}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 truncate max-w-[120px]">{d.remitter || d.name || '-'}</td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4">
                      <span className="text-[10px] font-bold uppercase text-gray-500">{d.consumption_type ? d.consumption_type.replace(/_/g, ' ') : '-'}</span>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-gray-600">{d.staff || '-'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap w-px">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setDetailItem(d)} className="text-gray-400 hover:text-gray-600 transition text-sm"><i className="fas fa-eye" /></button>
                        <button onClick={() => openEdit(d)} style={{ color: SKY }} className="hover:opacity-80 transition text-sm"><i className="fas fa-edit" /></button>
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
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>Deposit Details</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Date</span><p className="text-gray-900">{detailItem.date}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Amount</span><p className="text-gray-900 font-semibold">{detailItem.currency} {Number(detailItem.amount).toLocaleString()}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Bank Fees</span><p className="text-gray-900">{detailItem.bank_fees ? Number(detailItem.bank_fees).toLocaleString() : '0'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Remitter</span><p className="text-gray-900">{detailItem.remitter || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Country</span><p className="text-gray-900">{detailItem.country || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Staff</span><p className="text-gray-900">{detailItem.staff || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Type</span><p className="text-gray-900">{detailItem.consumption_type ? detailItem.consumption_type.replace(/_/g, ' ') : '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Consumption Value</span><p className="text-gray-900">{detailItem.consumption_value ? Number(detailItem.consumption_value).toLocaleString() : '-'}</p></div>
              <div className="col-span-2"><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">SWIFT Details</span><p className="text-gray-900">{detailItem.swift_details || '-'}</p></div>
              <div className="col-span-2"><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Note</span><p className="text-gray-900">{detailItem.note || '-'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
