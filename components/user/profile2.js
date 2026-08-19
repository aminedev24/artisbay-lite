// profile2.js
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'; // Changed from 'next/navigation' to 'next/router'
import useCheckScreenSize from '../utilities/screenSize';
import Settings from '../misc/settings';
import Privacy from '../help/privacy';
import TermsConditions from '../help/terms';
import AntiSocialPolicy from '../help/asf';
import BankInformation from '../help/bankInfo';
import SalesAgreement from '../sales/salesAgreement';
import InquiryList from '../dataFetch/fetchIquiries';
import TireOrderList from '../dataFetch/submittedTireOrders';
import InvoiceList from '../dataFetch/fetchInvoices';
import FetchSavedCars from '../dataFetch/fetchSavedCars';
import DepositsTable from '../dataFetch/fetchDeposits';
import { useUser } from "./userContext";
import Link from 'next/link';
import UserHomepage from './userHomepage';
import Calander from '../misc/calander';
import useAgreementStatus from '../utilities/agreementStatus';
import Modal from "../common/alertModal";
import { apiBaseUrl } from '../utilities/apiBase';
// Admin-specific components are no longer directly imported here as they will be in AdminPanel.js

const apiUrl = apiBaseUrl;

const ProfilePage = () => {
  const [userr, setUserr] = useState(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(true);
  const [agreementType, setAgreementType] = useState('');
  const router = useRouter(); // Initialize useRouter
  const { section } = router.query || {}; // Get dynamic segment from router.query
  const { isSmallScreen } = useCheckScreenSize();
  const [showSidebar, setShowSidebar] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  
  const [suppressHighlight, setSuppressHighlight] = useState({});

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const showAlert = (message, type = "alert") => {
    setTimeout(() => {
      setModalMessage(message);
      setModalType(type);
      setShowModal(true);
    }, 1000);
  };

  const agreementMapping = useMemo(() => ({
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    'anti-social-policy': 'Anti-Social Forces Policy',
  }), []);

  const agreementNames = useMemo(() => Object.values(agreementMapping), [agreementMapping]);

  const { statuses, loading: statusLoading, error: statusError } = useAgreementStatus(agreementNames, apiUrl);
  const allAgreed = Object.values(statuses).every(status => status === true);

  const allowedKeys = ['terms', 'privacy', 'anti-social-policy'];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    company: '',
    address: ''
  });

  const menuItems = useMemo(() => {
    let items = [
      { key: 'my-account', label: 'My Account', component: UserHomepage },
      { key: 'settings', label: 'Settings', component: Settings },
      { key: 'vehicle-inquiries', label: 'Vehicle Inquiries', component: InquiryList },
      { key: 'submitted-tire-orders', label: 'Submitted Tire Orders', component: TireOrderList },
      { key: 'invoices-list', label: 'Invoices List', component: InvoiceList },
      { key: 'accountancy', label: 'Accountancy', component: DepositsTable },
      { key: 'privacy', label: 'Privacy', component: Privacy },
      { key: 'terms', label: 'Terms & Conditions', component: TermsConditions },
      { key: 'anti-social-policy', label: 'Anti-Social Forces Policy', component: AntiSocialPolicy },
      { key: 'sales-contract', label: 'Sales Contract', component: SalesAgreement },
      { key: 'cutting-and-dismantling-logs', label: 'Cutting & Dismantling Logs', component: FetchSavedCars },
    ];

    // Add a link to the admin panel ONLY if the user is an admin
    if (user?.role === 'admin') {
      items.push({ key: 'admin-panel', label: 'Admin Panel', path: '/admin/customers' }); // Link to default admin page
    }

    return items;
  }, [user]); // Re-calculate if user changes

  const initialActive = section && menuItems.some(item => item.key === section.toLowerCase())
    ? section.toLowerCase()
    : 'my-account';
  const [activeContent, setActiveContent] = useState(initialActive);

  useEffect(() => {
    const allowedRoutes = ['terms', 'privacy', 'anti-social-policy'];
    if (!user?.isImpersonating && user?.role !== 'admin' && !allAgreed && !allowedRoutes.includes(activeContent)) {
      router.push(`/profile/anti-social-policy`);
      setActiveContent('anti-social-policy');
    }
  }, [allAgreed, activeContent, router, user]);

  useEffect(() => {
    switch (activeContent) {
      case 'terms':
        setAgreementType('Terms & Conditions');
        break;
      case 'privacy':
        setAgreementType('Privacy Policy');
        break;
      case 'anti-social-policy':
        setAgreementType('Anti-Social Forces Policy');
        break;
      case 'sales-contract':
        setAgreementType('Sales Agreement');
        break;
      default:
        setAgreementType('');
    }
  }, [activeContent]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/profile.php`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setUserr(data);
        setFormData({
          name: data.full_name,
          country: data.country,
          company: data.company,
          address: data.address
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  useEffect(() => {
    if (!loading && !userr) {
      router.push("/login");
    }
  }, [loading, userr, router]);

  useEffect(() => {
    if (user && section) {
      // If the user is an admin and tries to access a non-admin section directly
      // or if a regular user tries to access an invalid section.
      if (user.role === 'admin' && !menuItems.some(item => item.key === section.toLowerCase())) {
        // If it's not a profile route, redirect to admin panel
        if (!router.pathname.startsWith('/admin')) { // Check if the current route is not already an admin route
             router.push('/admin'); // Default admin view
        }
      } else if (user.role !== 'admin' && !menuItems.some(item => item.key === section.toLowerCase())) {
        // For regular users, if the section is not in their menu, redirect to settings
        router.push('/profile/settings');
        setActiveContent('settings');
      } else {
        setActiveContent(section.toLowerCase());
      }
    }
  }, [section, router, user, menuItems]);


  const handleMenuClick = (item) => {
    // If it's the admin panel link, handle redirection differently
    if (item.key === 'admin-panel') {
      router.push(item.path);
      setShowSidebar(false); // Close sidebar on mobile
      return; // Stop further processing
    }

    if (!user?.isImpersonating && user?.role !== 'admin' && !allAgreed && !allowedKeys.includes(item.key)) {
      showAlert('Please accept all required agreements first.');
      
      const newSuppress = {};
      menuItems.forEach(menuItem => {
        const agreementName = agreementMapping[menuItem.key];
        if (agreementName && statuses[agreementName] === false) {
          newSuppress[menuItem.key] = true;
        }
      });
      setSuppressHighlight(newSuppress);
      
      setTimeout(() => {
        setSuppressHighlight({});
      }, 3000);
      
      router.push(`/profile/anti-social-policy`);
      setActiveContent('anti-social-policy');
    
      return;
    }
    setActiveContent(item.key);
    setShowSidebar(false);
    router.push(`/profile/${item.key}`);
  };

  if (loading) {
    return (
      <div className="profile-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!userr) return null;

  // The conditional rendering for AdminPanel is now handled by the Pages Router directly
  // via pages/admin/index.js and pages/admin/[adminSection].js.
  // This ProfilePage component is now solely for user profile views.

  const ActiveComponent = menuItems.find(item => item.key === activeContent)?.component || Settings;
  const isSpecialContent = isSmallScreen && (
    activeContent === 'terms' ||
    activeContent === 'privacy' ||
    activeContent === 'sales-contract' ||
    activeContent === 'anti-social-policy'
  );
  const isSpecialContent2 = (
    activeContent === 'terms' ||
    activeContent === 'privacy' ||
    activeContent === 'sales-contract' ||
    activeContent === 'anti-social-policy'
  );

  const style = {
    height: isSpecialContent ? '70dvh' : '',
    padding: isSpecialContent2 && activeContent !== 'my-account' ? '0' : '',
  };

  return (
    <div className="profile-wrapper max-w-6xl mx-auto md:px-0">
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          type={modalType}
        />
      )}
      <div className="profile-container">
        <div className="profile-mobile-menu">
          <button
            className={showSidebar ? 'fa fa-times' : 'fa fa-bars'}
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? 'Close menu' : 'Open menu'}
            aria-expanded={showSidebar}
          ></button>
        </div>

        {showSidebar && (
          <div className="profile-mobile-overlay" onClick={() => setShowSidebar(false)} />
        )}

        <div className={`profile-sidebar${showSidebar ? ' profile-sidebar-open' : ''}`}>
          <div className="profile-sidebar-header">
            <h2>MENU</h2>
          </div>
          <div className={`profile-sidebar-menus`}>

            <ul>
              {menuItems.map((item) => {
                // For the admin panel link, render a Next.js Link component
                if (item.key === 'admin-panel') {
                  const isActiveAdmin = router.pathname.startsWith('/admin');
                  return (
                    <li key={item.key} className="menu-item" style={{ cursor: 'pointer' }}>
                      <Link
                        href={item.path}
                        className={`block py-2 px-4 rounded-lg transition duration-200 ${
                          isActiveAdmin ? 'active' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const agreementName = agreementMapping[item.key];
                const highlight =
                  agreementName &&
                  statuses[agreementName] === false &&
                  !suppressHighlight[item.key];
                
                return (
                  <li
                    key={item.key}
                    onClick={() => handleMenuClick(item)}
                    className={`menu-item ${activeContent === item.key ? 'active' : ''} ${highlight ? 'highlight' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
            <div className="amount">
              <p><strong>Total Guaranty: </strong>{userr.total_by_currency?.JPY?.guaranty || "0 JPY"}</p>
              <p><strong>Total Extra Guaranty: </strong>{userr.total_by_currency?.JPY?.extra_guaranty || "0 JPY"}</p>
            </div>
            <Calander />
          </div>
        </div>
        <div className="profile-content" style={style}>
          <ActiveComponent
            user={userr}
            setUser={setUserr}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            userProfile={userProfile}
            agreementType={agreementType}
            setSuppressHighlight={setSuppressHighlight}
            showSidebar={showSidebar}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
