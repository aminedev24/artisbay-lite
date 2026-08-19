import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  TruckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { apiBaseUrl, apiInventory } from '../utilities/apiBase';

const QUICK_LINKS = [
  { key: 'customers', label: 'Customers List', icon: UsersIcon, description: 'View and manage registered customers' },
  { key: 'income', label: 'Income Form', icon: CurrencyDollarIcon, description: 'Record incoming revenue' },
  { key: 'commercial-invoice', label: 'Commercial Invoice Form', icon: DocumentTextIcon, description: 'Create a commercial invoice' },
  { key: 'car-management', label: 'Vehicle Management', icon: TruckIcon, description: 'Add or update vehicle listings' },
  { key: 'deposits', label: 'Customer Deposits', icon: CreditCardIcon, description: 'Track customer deposit payments' },
  { key: 'sold-cars', label: 'Sold Cars List', icon: CheckCircleIcon, description: 'Browse completed vehicle sales' },
  { key: 'customers-invoices', label: 'Customers Invoices', icon: DocumentTextIcon, description: 'Review issued customer invoices' },
];

const StatCard = ({ label, value, loading, icon: Icon, colorClass, href }) => (
  <Link
    href={`/admin/${href}`}
    className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
  >
    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{loading ? '—' : value}</p>
    </div>
  </Link>
);

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({ customers: null, soldCars: null, deposits: null, invoices: null });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const results = await Promise.allSettled([
        fetch(`${apiBaseUrl}/users/getUsers.php`).then((res) => res.json()),
        fetch(`${apiInventory}/cars/fetchAllSoldCars.php`, { credentials: 'include' }).then((res) => res.json()),
        fetch(`${apiBaseUrl}/finance/deposits/adminFetchDeposits.php`, { credentials: 'include' }).then((res) => res.json()),
        fetch(`${apiBaseUrl}/finance/invoices/adminFetchInvoices.php`, { credentials: 'include' }).then((res) => res.json()),
      ]);

      if (!isMounted) return;

      const [usersRes, soldCarsRes, depositsRes, invoicesRes] = results;

      const customers =
        usersRes.status === 'fulfilled' && usersRes.value?.status === 'success'
          ? usersRes.value.data.length
          : null;

      const soldCars =
        soldCarsRes.status === 'fulfilled' && soldCarsRes.value?.success
          ? soldCarsRes.value.data.length
          : null;

      const deposits =
        depositsRes.status === 'fulfilled' && Array.isArray(depositsRes.value)
          ? depositsRes.value.length
          : null;

      const invoicesData =
        invoicesRes.status === 'fulfilled' && Array.isArray(invoicesRes.value) ? invoicesRes.value : [];

      setStats({ customers, soldCars, deposits, invoices: invoicesData.length });
      setRecentInvoices(
        [...invoicesData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      );
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s a snapshot of what&apos;s happening across the business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Customers"
          value={stats.customers}
          loading={loading}
          icon={UsersIcon}
          colorClass="bg-brand-navy/10 text-brand-navy"
          href="customers"
        />
        <StatCard
          label="Sold Cars"
          value={stats.soldCars}
          loading={loading}
          icon={TruckIcon}
          colorClass="bg-brand-sky/10 text-brand-sky"
          href="sold-cars"
        />
        <StatCard
          label="Customer Deposits"
          value={stats.deposits}
          loading={loading}
          icon={CreditCardIcon}
          colorClass="bg-brand-orange/10 text-brand-orange"
          href="deposits"
        />
        <StatCard
          label="Customer Invoices"
          value={stats.invoices}
          loading={loading}
          icon={DocumentTextIcon}
          colorClass="bg-emerald-100 text-emerald-600"
          href="customers-invoices"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">Recent Invoices</h2>
            <Link
              href="/admin/customers-invoices"
              className="flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-brand-orange"
            >
              View all
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Loading recent activity...</p>
          ) : recentInvoices.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No invoices yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentInvoices.map((invoice) => (
                <li key={invoice.invoice_number} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{invoice.customer_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {invoice.make || ''} {invoice.model || ''}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-brand-navy">{invoice.deposit_amount}</p>
                    <p className="text-xs text-slate-400">
                      {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-navy">Quick Links</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {QUICK_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={`/admin/${link.key}`}
                  className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                >
                  <link.icon className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-brand-navy" />
                  <span className="truncate text-sm font-medium text-slate-700 group-hover:text-brand-navy">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
