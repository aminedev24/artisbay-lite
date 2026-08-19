import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useUser } from '../user/userContext';
import CustomerRegistrationForm from '../forms/addCustomer';
import useCheckScreenSize from '../utilities/screenSize';
import { apiBaseUrl as apiBase } from '../utilities/apiBase';
import { PencilSquareIcon, TrashIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';

const AdminUserList = () => {
  const { setUser } = useUser();
  const { isSmallScreen } = useCheckScreenSize();
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // add-user modal
  const [editingUser, setEditingUser] = useState(null); // user being edited
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    company: ''
  });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch(`${apiBase}/users/getUsers.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const list = data.data.map((item) => ({
            ...item,
            full_name: item.full_name || item.customer_name || '—',
            email: item.email || item.email1 || '—',
            joined_date:
              item.registration_date || item.joined_date || '',
            company: item.company || '—',
          }));
          setUsers(list);
        } else {
          console.error('Error fetching users:', data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleImpersonate = async (userId) => {
    try {
      const response = await fetch(`${apiBase}/users/impersonate.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setUser(data.user);
        window.location.href = '/profile/settings';
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error('Error during impersonation:', error);
    }
  };

  // --- edit/delete helpers ---
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      country: user.country || '',
      address: user.address || '',
      company: user.company || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!editingUser) return;
    try {
      const resp = await fetch(`${apiBase}/users/updateUser.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: editingUser.id, ...formData }),
      });
      const data = await resp.json();
      if (data.status === 'success') {
        fetchUsers();
        setEditingUser(null);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Update error');
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      fetch(`${apiBase}/users/deleteUser.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.status === 'success') fetchUsers();
          else alert(d.message || 'Delete failed');
        });
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesId = searchId
          ? user.id.toString().includes(searchId)
          : true;
        const matchesName = searchName
          ? user.full_name
              ?.toLowerCase()
              ?.includes(searchName.toLowerCase())
          : true;
        const formattedDate = user.joined_date
          ? user.joined_date.substring(0, 10)
          : '';
        const matchesDate = searchDate
          ? formattedDate === searchDate
          : true;
        return matchesId && matchesName && matchesDate;
      }),
    [users, searchId, searchName, searchDate],
  );

  const customerSummary = useMemo(() => {
    const total = users.length || 0;
    const countries = new Set(users.map((u) => u.country).filter(Boolean)).size;
    const now = new Date();
    const newThisMonth = users.filter((u) => {
      const d = u.joined_date ? new Date(u.joined_date) : null;
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

    return { total, countries, newThisMonth };
  }, [users]);

  const columns = [
    { key: 'id', label: 'ID', align: 'center' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'phone',
      label: 'Phone',
      format: (value, user) => value || user?.tel1 || '—',
    },
    { key: 'country', label: 'Country' },
    {
      key: 'address',
      label: 'Address',
      format: (value) => value || 'N/A',
    },
    {
      key: 'joined_date',
      label: 'Date',
      align: 'center',
      format: (value) => (value ? value.substring(0, 10) : ''),
    },
    {
      key: 'company',
      label: 'Company',
      format: (value) => value || 'N/A',
    }
  ];

  const renderDesktopTable = () => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
      <table className="w-full min-w-[900px] border-collapse text-sm text-slate-600">
        <thead className="bg-slate-950 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold uppercase tracking-[0.15em] text-[11px]"
                style={{ textAlign: col.align || 'left' }}
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-center font-semibold uppercase tracking-[0.15em] text-[11px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length ? (
            filteredUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} transition hover:bg-slate-100`}
              >
                {columns.map((col) => {
                  const value = col.format
                    ? col.format(user[col.key], user)
                    : user[col.key] || '—';
                  return (
                    <td
                      key={col.key}
                      className="px-4 py-3 align-top text-[13px] text-slate-700"
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {value}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center text-slate-600">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => openEditModal(user)}
                      className="rounded-full p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit user"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(user.id)}
                      className="rounded-full p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete user"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleImpersonate(user.id)}
                      className="rounded-full p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                      title="Login as user"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-slate-500"
              >
                No customers match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {filteredUsers.length ? (
        filteredUsers.map((user) => (
          <article
            key={user.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customer</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{user.full_name}</h3>
                <p className="mt-1 text-sm text-slate-500">#{user.id}</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                {user.country || 'Unknown'}
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Email</p>
                <p className="mt-1 truncate">{user.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Phone</p>
                <p className="mt-1 truncate">{user.phone || user.tel1 || '—'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Joined</p>
                <p className="mt-1">{user.joined_date ? user.joined_date.substring(0, 10) : '—'}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => openEditModal(user)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition"
                title="Edit user"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => confirmDelete(user.id)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Delete user"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleImpersonate(user.id)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition"
                title="Login as user"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))
      ) : (
        <p className="text-center text-slate-500">No customers match your filters.</p>
      )}
    </div>
  );

  return (
    <div className="px-3 py-4 sm:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Customers
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:shadow-md transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-slate-100 bg-white/80 p-3 shadow shadow-slate-200/40 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Search by ID
          </label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="ID"
            className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Search by Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Name"
            className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Search by Date
          </label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading users...</p>
      ) : (
        <>{!isSmallScreen ? renderDesktopTable() : renderMobileCards()}</>
      )}

      {isModalOpen && (
        <div className="alert-modal-overlay">
          <div
            className="alert-modal-content add-customer"
            style={{
              position: 'relative',
              height: isSmallScreen ? '65dvh' : undefined,
            }}
          >
            <button
              style={modalStyles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
            <CustomerRegistrationForm onUserAdded={fetchUsers} />
          </div>
        </div>
      )}

      {/* edit modal */}
      {editingUser && (
        <div className="alert-modal-overlay">
          <div
            className="alert-modal-content add-customer"
            style={{ position: 'relative', maxWidth: '450px' }}
          >
            <button
              style={modalStyles.closeButton}
              onClick={() => setEditingUser(null)}
            >
              X
            </button>
            <h2 className="text-lg font-semibold mb-3">Edit User</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {['full_name','email','phone','country','address','company'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-xs font-medium capitalize text-slate-600">
                    {field.replace('_',' ')}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleInputChange}
                    className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1 rounded text-xs font-medium bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'var(--primary-color)',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 5,
    color: '#fff',
    borderRadius: '999px',
    width: '28px',
    height: '28px',
    lineHeight: '28px',
  },
};

export default AdminUserList;