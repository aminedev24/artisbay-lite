// profile2.js
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'; // Changed from 'next/navigation' to 'next/router'
import useCheckScreenSize from '../../components/utilities/screenSize';
import Settings from '../../components/misc/settings';
import Privacy from '../../components/help/privacy';
import TermsConditions from '../../components/help/terms';
import AntiSocialPolicy from '../../components/help/asf';
import BankInformation from '../../components/help/bankInfo';
import SalesAgreement from '../../components/sales/salesAgreement';
import InquiryList from '../../components/dataFetch/fetchIquiries';
import InvoiceList from '../../components/dataFetch/fetchInvoices';
import SavedVehicles from '../../components/dataFetch/fetchSavedVehicles';
import MyReservations from '../../components/dataFetch/fetchMyReservations';
import MyOrders from '../../components/dataFetch/fetchMyOrders';
import DepositsTable from '../../components/dataFetch/fetchDeposits';
import { useUser } from "../../components/user/userContext";
import Link from 'next/link';
import UserHomepage from '../../components/user/userHomepage';
import Calander from '../../components/misc/calander';
import useAgreementStatus from '../../components/utilities/agreementStatus';
import Modal from "../../components/common/alertModal";
import { apiBaseUrl } from '../../components/utilities/apiBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faGear, faHeart, faCalendarCheck, faTruck, faEnvelope,
  faFileInvoice, faCoins, faUserShield, faFileLines,
  faGavel, faFileSignature, faShieldHalved,
  faRightFromBracket, faBars, faXmark, faCheck,
} from "@fortawesome/free-solid-svg-icons";
// Admin-specific components are no longer directly imported here as they will be in AdminPanel.js

const apiUrl = apiBaseUrl;

const menuIcons = {
  'my-account': faUser,
  settings: faGear,
  'saved-vehicles': faHeart,
  'my-reservations': faCalendarCheck,
  'my-orders': faTruck,
  'vehicle-inquiries': faEnvelope,
  'invoices-list': faFileInvoice,
  accountancy: faCoins,
  privacy: faUserShield,
  terms: faFileLines,
  'anti-social-policy': faGavel,
  'sales-contract': faFileSignature,
  'admin-panel': faShieldHalved,
};

const ProfilePage = ({ initialSection = '' }) => {

  const [userr, setUserr] = useState(null);
  const { user, logout } = useUser();
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
      { key: 'saved-vehicles', label: 'Saved Vehicles', component: SavedVehicles },
      { key: 'my-reservations', label: 'My Reservations', component: MyReservations },
      { key: 'my-orders', label: 'My Orders', component: MyOrders },
      { key: 'vehicle-inquiries', label: 'Vehicle Inquiries', component: InquiryList },
      { key: 'invoices-list', label: 'Invoices List', component: InvoiceList },
      { key: 'accountancy', label: 'Accountancy', component: DepositsTable },
      { key: 'privacy', label: 'Privacy', component: Privacy },
      { key: 'terms', label: 'Terms & Conditions', component: TermsConditions },
      { key: 'anti-social-policy', label: 'Anti-Social Forces Policy', component: AntiSocialPolicy },
      { key: 'sales-contract', label: 'Sales Contract', component: SalesAgreement },
    ];

    // Add a link to the admin panel ONLY if the user is an admin
    if (user?.role === 'admin') {
      items.push({ key: 'admin-panel', label: 'Admin Panel', path: '/admin/customers' }); // Link to default admin page
    }

    return items;
  }, [user]); // Re-calculate if user changes

  const sectionStr = Array.isArray(section)
  ? section[0]
  : section || "";

 


  const initialActive = initialSection || (sectionStr && menuItems.some(item => item.key === sectionStr.toLowerCase())
  ? sectionStr.toLowerCase()
  : "");
  
  const [activeContent, setActiveContent] = useState(initialActive || initialSection);


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
      if (user.role === 'admin' && !menuItems.some(item => item.key === sectionStr.toLowerCase())) {
        // If it's not a profile route, redirect to admin panel
        if (!router.pathname.startsWith('/admin')) { // Check if the current route is not already an admin route
             router.push('/admin/customers'); // Default admin view
        }
      } else if (user.role !== 'admin' && !menuItems.some(item => item.key === sectionStr.toLowerCase())) {
        // For regular users, if the section is not in their menu, redirect to settings
        router.push('/profile/settings');
        setActiveContent('settings');
      } else {
        setActiveContent(sectionStr.toLowerCase());
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

  const ActiveComponent = menuItems.find(item => item.key === activeContent)?.component || UserHomepage;
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

  const activeItem = menuItems.find(item => item.key === activeContent) || menuItems[0];
  const displayName = userr.full_name || userr.name || '';
  const initials = (displayName.trim().split(/\s+/).map(w => w[0]).join('') || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="profile-wrapper profile-wrapper max-w-[70rem] mx-auto md:px-0 block w-full">
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          type={modalType}
        />
      )}
      <div className="profile-container">
        {showSidebar && (
          <div className="profile-mobile-overlay" onClick={() => setShowSidebar(false)} />
        )}
        <div className={`profile-sidebar${showSidebar ? ' profile-sidebar-open' : ''}`}>
          <div className="profile-sidebar-user">
            <div className="psu-avatar">{initials}</div>
            <div className="psu-info">
              <div className="psu-name">
                {displayName}
                {String(userr.is_verified) === '1' && (
                  <span className="psu-verified" title="Verified account">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              </div>
              <div className="psu-email">{userr.email}</div>
            </div>
            <button className="psu-logout" onClick={logout} title="Sign out">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
          <nav className="profile-sidebar-menus">
            {user?.role === 'admin' && (
              <Link
                href="/admin/customers"
                className={`profile-admin-link${router.pathname.startsWith('/admin') ? ' active' : ''}`}
              >
                <FontAwesomeIcon icon={faShieldHalved} className="menu-item-icon" />
                <span>Admin Panel</span>
              </Link>
            )}
            <ul>
              {menuItems.filter(item => item.key !== 'admin-panel').map((item) => {
                const Icon = menuIcons[item.key];

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
                    <FontAwesomeIcon icon={Icon} className="menu-item-icon" />
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
            <div className="amount">
              <p><strong>Total Guaranty: </strong>{userr.total_by_currency?.JPY?.guaranty || "0 JPY"}</p>
              <p><strong>Total Extra Guaranty: </strong>{userr.total_by_currency?.JPY?.extra_guaranty || "0 JPY"}</p>
            </div>
            <Calander />
          </nav>
        </div>
        <div className="profile-content" style={style}>
          <div className="profile-content-header">
            <div className="profile-mobile-menu">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={showSidebar ? faXmark : faBars} />
              </button>
            </div>
            <span className="profile-content-crumb">Profile</span>
            <h2 className="profile-content-title">{activeItem.label}</h2>
          </div>
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
          />
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const sections = [
    'my-account',
    'settings', 
    'saved-vehicles',
    'my-reservations',
    'my-orders',
    'vehicle-inquiries',
    'invoices-list',
    'accountancy',
    'privacy',
    'terms',
    'anti-social-policy',
    'sales-contract'
  ];

  const paths = [
    { params: { section: [] } }, // /profile/
    ...sections.map(section => ({
      params: { 
        section: [section] 
      }
    }))
  ];

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { section } = params;
  const sectionStr = Array.isArray(section) ? section[0] || '' : section || '';

  return {
    props: {
      initialSection: sectionStr
    }
  };

}

export default ProfilePage;


