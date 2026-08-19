import { useState, useEffect } from 'react';
import { adminApiFetch } from './adminApi';

export default function CustomerManagement({ showMessage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiFetch('users/getUsers.php').then(r => {
      if (r?.status === 'success') setUsers(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-400"><i className="fas fa-spinner animate-spin" /></div>;

  return (
    <div className="space-y-2">
      <h3 className="font-bebas text-lg text-primary">Customer Management</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.filter(u => u.role === 'customer').map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.full_name || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{u.email || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{u.phone || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{u.country || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
