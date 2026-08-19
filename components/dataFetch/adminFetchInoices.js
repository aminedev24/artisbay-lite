import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../utilities/apiBase';

const AdminInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [editForm, setEditForm] = useState({
        customer_name: '',
        email: '',
        make: '',
        model: '',
        deposit_amount: '',
        deposit_currency: 'USD'
    });

    const apiUrl = apiBaseUrl;

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`${apiUrl}/finance/invoices/adminFetchInvoices.php`, {
                withCredentials: true
            });
            setInvoices(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch invoices. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    const handleEdit = (invoice) => {
        setEditingInvoice(invoice);
        const [amount] = invoice.deposit_amount.split(' '); // Gets just the "100" part
        setEditForm({
            customer_name: invoice.customer_name,
            email: invoice.email,
            make: invoice.make,
            model: invoice.model,
            deposit_amount: amount,
            deposit_currency: invoice.deposit_currency || 'USD',
            deposit_purpose: invoice.deposit_purpose || ''
        });
    };

    const handleDelete = async (invoiceNumber) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await axios.delete(`${apiUrl}/finance/invoices/manageInvoices.php`, {
                    data: { invoice_number: invoiceNumber },
                    withCredentials: true
                });
                fetchInvoices();
            } catch (err) {
                setError('Failed to delete invoice.');
                console.error(err);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiUrl}/finance/invoices/manageInvoices.php`, {
                ...editForm,
                invoice_number: editingInvoice.invoice_number
            }, {
                withCredentials: true
            });
            setEditingInvoice(null);
            fetchInvoices();
        } catch (err) {
            setError('Failed to update invoice.');
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
        </div>
    );

    return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice Management</h2>
            
            {editingInvoice && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Invoice #{editingInvoice.invoice_number}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name:</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={editForm.customer_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Purpose:</label>
                                <input
                                    type="text"
                                    name="deposit_purpose"
                                    value={editForm.deposit_purpose}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            {editingInvoice.deposit_purpose == 'order vehicle' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Make:</label>
                                        <input
                                            type="text"
                                            name="make"
                                            value={editForm.make}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model:</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={editForm.model}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                           
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount:</label>
                                <input
                                    type="text"
                                    name="deposit_amount"
                                    value={editForm.deposit_amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency:</label>
                                <select
                                    name="deposit_currency"
                                    value={editForm.deposit_currency}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="JPY">JPY</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingInvoice(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Deposit Purpose</th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map(invoice => (
                                <tr key={invoice.invoice_number} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{invoice.customer_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{invoice.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{invoice.make || ''} {invoice.model || "N/A"} </td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{invoice.deposit_amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{new Date(invoice.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap ">{invoice.deposit_purpose}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(invoice)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.invoice_number)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInvoices;