// components/AdminPanel.js
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Import your admin components
import Dashboard from '../admin/Dashboard';
import AdminUserList from '../dataFetch/getUsers';
import AccountancyForm from '../forms/accountancyForm2';
import AdminInvoiceForm from '../sales/adminInvoiceForm';
import CarForm from '../forms/AddCarsForm';
import AdminDepositsTable from '../dataFetch/adminDepositTable';
import AdminSoldCars from '../dataFetch/adminSoldCars';
import AdminInvoices  from '../dataFetch/adminFetchInoices'; 

// Icon imports
import {
  Squares2X2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TruckIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const adminComponentMap = {
  dashboard: Dashboard,
  customers: AdminUserList,
  income: AccountancyForm,
  'commercial-invoice': AdminInvoiceForm,
  'car-management': CarForm, // Use CarForm for this key
  deposits: AdminDepositsTable,
  'sold-cars': AdminSoldCars, // Keep this to view sold cars, not a form
  'customers-invoices': AdminInvoices 
};

const AdminPanel = ({ user, initialActiveSection }) => {
  const router = useRouter();
  const [activeAdminContent, setActiveAdminContent] = useState(initialActiveSection || 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (initialActiveSection && initialActiveSection !== activeAdminContent) {
      setActiveAdminContent(initialActiveSection);
    }
  }, [initialActiveSection]);

  const adminMenuItems = useMemo(() => [
    { key: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
    { key: 'customers', label: 'Customers List', icon: UsersIcon },
    { key: 'income', label: 'Income Form', icon: CurrencyDollarIcon },
    { key: 'commercial-invoice', label: 'Commercial Invoice Form', icon: DocumentTextIcon },
    { key: 'car-management', label: 'Vehicle Management form', icon: TruckIcon },
    { key: 'deposits', label: 'Customer Deposits List', icon: CreditCardIcon },
    { key: 'sold-cars', label: 'Sold Cars List', icon: CheckCircleIcon },
    { key: 'customers-invoices', label: 'Customers Invoices List', icon: DocumentTextIcon }
  ], []);

  const handleMenuClick = (itemKey) => {
    setActiveAdminContent(itemKey);
    router.push(`/admin/${itemKey}`);
    setIsSidebarOpen(false);
  };

  const ActiveAdminComponent = adminComponentMap[activeAdminContent];

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 flex justify-between items-center z-30 h-14 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-bold">AB</div>
          <span className="text-sm font-semibold text-indigo-200">Admin Panel</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-700 focus:outline-none transition-colors">
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0
        lg:sticky lg:top-0
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        z-50
        ${isSidebarOpen ? 'w-72 max-w-xs' : 'w-64'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white
        shadow-2xl shadow-black/30
        transition-all duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Mobile close */}
        <button className="lg:hidden absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors" onClick={() => setIsSidebarOpen(false)}>
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0">
              AB
            </div>
            {!isCollapsed && <span className="text-sm font-semibold text-indigo-200 whitespace-nowrap">Admin Panel</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none transition-colors" aria-label={isCollapsed ? "Expand" : "Collapse"}>
            {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav label */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Navigation</span>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {adminMenuItems.map((item) => {
            const isActive = activeAdminContent === item.key;
            return (
              <Link
                key={item.key}
                href={`/admin/${item.key}`}
                onClick={(e) => { e.preventDefault(); handleMenuClick(item.key); }}
                className={`
                  flex items-center gap-3 rounded-lg transition-all duration-200 group
                  ${isCollapsed ? 'justify-center py-3' : 'py-2.5 px-3'}
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        {user && !isCollapsed && (
          <div className="px-4 py-3 border-t border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                {(user.name || user.email || 'A')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-200 truncate">{user.name || user.email}</p>
                <p className="text-[10px] text-slate-500 truncate capitalize">{user.role || 'admin'}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1
        transition-all duration-300 ease-in-out
        pt-14 lg:pt-0
        ${isSidebarOpen ? 'overflow-hidden' : ''}
        overflow-y-auto
        w-full
      `}>
        {/* Mobile header spacer */}
        <div className="lg:hidden h-14"></div>

        <div className="p-4 lg:p-8 h-full overflow-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 lg:p-6 admin-content">
            {ActiveAdminComponent && <ActiveAdminComponent user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
