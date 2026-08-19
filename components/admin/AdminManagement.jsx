import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApiFetch } from './adminApi';
import Pagination from './Pagination';
const NAVY = '#1e3a8a';
const SKY = '#1da1f2';
const ORANGE = '#f1892b';

const ROLE_BADGES = {
  admin: `text-white border-0`,
  sales: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

export default function AdminManagement({ showMessage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'sales' });
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const result = await adminApiFetch('users/getUsers.php');
    if (result?.status === 'success' && Array.isArray(result.data)) {
      setItems(result.data.filter(u => u.role === 'admin' || u.role === 'sales'));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) return;
    const result = await adminApiFetch('users/addUser.php', {
      method: 'POST',
      body: { ...form, password: Math.random().toString(36).slice(2, 12) },
    });
    if (result?.status === 'success') {
      showMessage('Account created', 'success');
      setShowCreate(false);
      setForm({ full_name: '', email: '', role: 'sales' });
      fetchItems();
    } else {
      showMessage(result?.message || 'Failed to create', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this staff account?')) return;
    const result = await adminApiFetch('users/deleteUser.php', { method: 'POST', body: { id } });
    if (result?.status === 'success') { showMessage('Deleted', 'success'); fetchItems(); }
    else showMessage(result?.message || 'Failed to delete', 'error');
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        <h3 className="font-bebas text-xl md:text-2xl tracking-wide" style={{ color: NAVY }}>Staff Management</h3>
        <button onClick={() => setShowCreate(true)} className="text-white px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase hover:opacity-90 transition flex items-center gap-1" style={{ backgroundColor: NAVY }}>
          <i className="fas fa-plus" /> Add Staff
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>Add Staff</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Full Name *</label>
                <input type="text" required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#d1d5db' }} />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" style={{ borderColor: '#d1d5db' }}>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">{form.role === 'admin' ? 'Full access to all features' : 'Can reserve, manage customers, send invoices'}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-lg py-2 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 text-white font-bold text-sm rounded-lg py-2 hover:opacity-90 transition" style={{ backgroundColor: NAVY }}>Create Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

{loading ? (
        <div className="flex justify-center py-12"><i className="fas fa-circle-notch animate-spin text-2xl" style={{ color: NAVY }} /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 sm:py-12 text-gray-400">
          <i className="fas fa-shield-alt text-3xl sm:text-4xl mb-2 sm:mb-3 block" />
          <p className="font-bold text-sm sm:text-base">No staff accounts</p>
        </div>
      ) : (
        <>
          <div className="md2:hidden space-y-3 p-4">
            {pagedItems.map((u) => (
              <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{u.full_name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border text-white" style={u.role === 'admin' ? { backgroundColor: NAVY, border: 'none' } : { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{u.role === 'admin' ? 'Admin' : 'Sales'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400">{u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}</span>
                  <div className="flex gap-1.5 items-center shrink-0">
                    <button onClick={() => setDetailItem(u)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition" title="Details"><i className="fas fa-eye text-sm" /></button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition" title="Delete"><i className="fas fa-trash-alt text-sm" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md2:block overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Created</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap w-px">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedItems.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-900">{u.full_name}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600">{u.email}</td>
<td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border text-white" style={u.role === 'admin' ? { backgroundColor: NAVY, border: 'none' } : { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{u.role === 'admin' ? 'Admin' : 'Sales'}</span>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap w-px">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setDetailItem(u)} className="text-gray-400 hover:text-gray-600 transition" title="Details"><i className="fas fa-eye text-sm" /></button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition" title="Delete"><i className="fas fa-trash-alt text-sm" /></button>
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>Staff Details</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg" style={{ backgroundColor: NAVY }}>{detailItem.full_name?.[0]?.toUpperCase() || '?'}</div>
                <div>
                  <p className="font-bold text-gray-900">{detailItem.full_name}</p>
                  <p className="text-xs text-gray-500">{detailItem.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Role</span><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border text-white" style={detailItem.role === 'admin' ? { backgroundColor: NAVY, border: 'none' } : { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{detailItem.role === 'admin' ? 'Admin' : 'Sales'}</span></div>
                {detailItem.created_at && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Created</span><p className="text-gray-700">{new Date(detailItem.created_at).toLocaleDateString()}</p></div>}
                {detailItem.phone && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Phone</span><p className="text-gray-700">{detailItem.phone}</p></div>}
                {detailItem.country && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Country</span><p className="text-gray-700">{detailItem.country}</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
