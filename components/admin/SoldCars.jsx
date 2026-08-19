import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApiFetch } from './adminApi';
import { formatNumberWithUnit } from '../utilities/numberFormat';
import Pagination from './Pagination';
const NAVY = '#1e3a8a';
const SKY = '#1da1f2';
const ORANGE = '#f1892b';

export default function SoldCars({ showMessage, users: propUsers = [] }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [detailItem, setDetailItem] = useState(null);

  const fetchItems = useCallback(async (q) => {
    setLoading(true);
    const result = await adminApiFetch('inventory/cars/fetchAllSoldCars.php');
    let list = result?.data && Array.isArray(result.data) ? result.data : [];
    if (q) { const s = q.toLowerCase(); list = list.filter(v => (v.ref_no||'').toLowerCase().includes(s) || (v.make||'').toLowerCase().includes(s) || (v.model||'').toLowerCase().includes(s) || (v.user_name||'').toLowerCase().includes(s)); }
    setItems(list);
    setPage(1);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSearch = (e) => { e.preventDefault(); fetchItems(search); };

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => {
    const max = Math.max(1, Math.ceil(items.length / itemsPerPage));
    if (page > max) setPage(max);
  }, [items.length, itemsPerPage, page]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pagedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const statusClass = (status) => status === 'delivered' ? 'bg-green-50 text-green-700' : status === 'shipped' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700';

  const imageList = (v) => {
    const urls = Array.isArray(v.image_urls) ? v.image_urls : (v.image_urls ? String(v.image_urls).split(',').map(s => s.trim()).filter(Boolean) : []);
    return urls;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
<h3 className="font-bebas text-xl md:text-2xl tracking-wide" style={{ color: NAVY }}>Sold Cars</h3>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="border-2 border-gray-200 rounded-lg px-3 md:px-4 py-2 text-sm focus:outline-none w-32 md:w-48" style={{ borderColor: '#d1d5db' }} />
            <button type="submit" className="text-white px-3 md:px-4 rounded-lg hover:opacity-90 transition" style={{ backgroundColor: NAVY }}><i className="fas fa-search text-sm" /></button>
          </form>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><i className="fas fa-circle-notch animate-spin text-2xl text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="px-3 md:px-6 py-8 md:py-12 text-center text-gray-400"><i className="fas fa-car text-xl md:text-2xl mb-2 block" />No sold cars found</div>
      ) : (
        <>
          <div className="md2:hidden divide-y divide-gray-100">
            {pagedItems.map((v) => (
              <div key={v.id} className="p-3 sm:p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{v.make} {v.model}</p>
                    <p className="text-[10px] text-gray-500 font-mono">Ref {v.ref_no || '-'}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${v.shipping_status ? statusClass(v.shipping_status) : 'bg-red-50 text-red-700'}`}>{v.shipping_status || 'sold'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{v.year} · {v.mileage ? `${Number(v.mileage).toLocaleString()} km` : '-'}</span>
                  <span className="font-semibold text-gray-900">{v.currency} {Number(v.price).toLocaleString()}</span>
                </div>
                {v.user_name && <p className="text-[10px] text-gray-500"><i className="fas fa-user mr-1" />{v.user_name}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setDetailItem(v)} className="text-gray-400 hover:text-gray-600 transition text-sm p-1"><i className="fas fa-eye" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md2:block overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Ref</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Make / Model</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Year</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Buyer</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap w-px">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedItems.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-500 font-mono text-[10px] md:text-xs">{v.ref_no || '-'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="block font-semibold text-gray-900">{v.make}</span>
                      <span className="block text-[11px] text-gray-500 truncate max-w-[180px]">{v.model}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600">{v.year}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 font-semibold">{v.currency} {Number(v.price).toLocaleString()}</td>
                    <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 text-gray-500 text-xs">{v.user_name || '-'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-1.5 md:px-2 py-0.5 md:py-1 rounded ${v.shipping_status ? statusClass(v.shipping_status) : 'bg-red-50 text-red-700'}`}>{v.shipping_status || 'sold'}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap w-px">
                      <button onClick={() => setDetailItem(v)} className="text-gray-400 hover:text-gray-600 transition text-sm" title="View details"><i className="fas fa-eye" /></button>
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
        <div className="fixed top-0 bottom-0 left-0 md:left-64 right-0 z-50 bg-black/40 flex flex-col p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto resize-y min-h-[320px] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bebas text-xl" style={{ color: NAVY }}>Sold Car Details</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 border-b border-gray-100 pb-1"><h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Vehicle</h4></div>
              <div className="col-span-2"><p className="text-gray-900 font-semibold">{detailItem.make} {detailItem.model}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Ref</span><p className="text-gray-900">{detailItem.ref_no || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Year</span><p className="text-gray-900">{detailItem.year || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Chassis</span><p className="text-gray-900">{detailItem.chassis_no || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Mileage</span><p className="text-gray-900">{formatNumberWithUnit(detailItem.mileage) || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Engine</span><p className="text-gray-900">{formatNumberWithUnit(detailItem.engine_capacity) || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Transmission</span><p className="text-gray-900">{detailItem.transmission || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Fuel</span><p className="text-gray-900">{detailItem.fuel || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Color</span><p className="text-gray-900">{detailItem.color || '-'}</p></div>
              <div className="col-span-2 border-b border-gray-100 pb-1 mt-2"><h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Sale</h4></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Price</span><p className="text-gray-900 font-semibold">{detailItem.currency} {Number(detailItem.price).toLocaleString()}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Invoice Date</span><p className="text-gray-900">{detailItem.invoice_date || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Ship Date</span><p className="text-gray-900">{detailItem.ship_date || '-'}</p></div>
              <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Ship Name</span><p className="text-gray-900">{detailItem.ship_name || '-'}</p></div>
              <div className="col-span-2 border-b border-gray-100 pb-1 mt-2"><h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Buyer</h4></div>
              {detailItem.user_name && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Name</span><p className="text-gray-900">{detailItem.user_name}</p></div>}
              {detailItem.phone && <div><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Phone</span><p className="text-gray-900">{detailItem.phone}</p></div>}
              {detailItem.address && <div className="col-span-2"><span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Address</span><p className="text-gray-900">{detailItem.address}</p></div>}
              {(() => {
                const urls = imageList(detailItem);
                return urls.length > 0 ? (
                  <div className="col-span-2">
                    <span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Images</span>
                    <div className="flex flex-wrap gap-2">
                      {urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition">
                          <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.opacity='0.3'; }} />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
