import { useState, useEffect, useMemo ,useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import HowToBuy               from '../../components/help/howtobuy';
import CompanyProfile         from '../../components/help/companyProfile';
import TermsAndConditions     from '../../components/help/terms';
import AntiSocialForcesPolicy from '../../components/help/asf';
import PaypalInfo             from '../../components/help/paypal';
import PaymentMethods         from '../../components/help/paymentMethods';
import AuctionLanding         from '../../components/help/auction';
import TelegraphicTransfer    from '../../components/help/telegraphicTransfer';
import PrivacyPolicy          from '../../components/help/privacy';
import FAQComponent           from '../../components/help/faq';
import AutomatedInvoice       from '../../components/help/automatedInvoice';
import WisePaymentInstructions from '../../components/help/wise';
import MachineryService       from '../../components/help/machinery';

import ImageWithLoader        from '../../components/misc/imageWithLoader';
import useCheckScreenSize     from '../../components/utilities/screenSize';

import { ChevronsDownIcon } from 'lucide-react';

// ---- DATA: Only use serializable values (no JSX or React elements!) ----
const topics = {
  help: [
    { name: "help", slug: 'help', content: "All you need to know about us", image: `/images/helpheader.png` },
    { name: 'About Us', slug: 'about-us', component: 'CompanyProfile', image: '/images/helpheader.png' },
    { name: 'Frequently Asked Questions', slug: 'frequently-asked-questions', component: 'FAQComponent', image: '/images/FAQ.png' },
    { name: 'Automated Invoice', slug: 'automated-invoice', component: 'AutomatedInvoice', image: '/images/invoicegenerator.png' },
    { name: 'Terms and conditions', slug: 'terms-and-conditions', component: 'TermsAndConditions', image: '/images/terms&conditions.png' },
    { name: 'Anti Social Force Policy', slug: 'anti-social-force-policy', component: 'AntiSocialForcesPolicy', image: '/images/asf.png' },
    { name: 'How to Buy used cars', slug: 'how-to-buy-used-cars', component: 'HowToBuy', image: '/images/howtobuyrecent2.jpeg' },
    { name: 'Auction', slug: 'auction', component: 'AuctionLanding', image: '/images/auction.png' },
  ],
  buying: [
    { name: 'About payment', slug: 'about-payment', component: 'PaymentMethods', image: '/images/aboutpaymentrecent.jpeg' },
    { name: 'Wise Banking', slug: 'wise-banking', component: 'WisePaymentInstructions', image: '/images/wisebanner.png' },
    { name: 'PayPal', slug: 'paypal', component: 'PaypalInfo', image: '/images/paypalbannerrecent.jpeg' },
    { name: 'Telegraphic Transfer', slug: 'telegraphic-transfer', component: 'TelegraphicTransfer', image: '/images/telegraphictransferrecent.jpeg' },
    { name: 'Privacy policy', slug: 'privacy-policy', component: 'PrivacyPolicy', image: '/images/privacybanner.png' },
    { name: 'Machinery', slug: 'machinery', component: 'MachineryService', image: '/images/machinery-banner.png' },
  ]
};
// ------------------------------------------------------------------------

// Metadata definitions per topic
const topicMeta = {
  help: {
    title: 'Meridian Motors Help Center | Meridian Motors Inc.',
    description: 'Find out how to buy, company profile, FAQs, and more.',
    keywords: 'Meridian Motors, help, company profile, FAQs'
  },
  'how-to-buy-used-cars': {
    title: 'How to Buy Used Cars | Meridian Motors Inc.',
    description: 'Step-by-step guide on purchasing used cars from Japanese auctions via Meridian Motors.',
    keywords: 'buy used cars, Meridian Motors, Japanese auctions, how to buy'
  },
  'about-us': {
    title: 'About Us  | Meridian Motors Inc. ',
    description: 'Learn about Meridian Motors’ mission, history, and the team behind our car-buying platform.',
    keywords: 'Meridian Motors, company profile, about us'
  },
  // add other topics as needed
};

const topicComponents = {
  CompanyProfile,
  FAQComponent,
  AutomatedInvoice,
  TermsAndConditions,
  AntiSocialForcesPolicy,
  HowToBuy,
  AuctionLanding,
  PaymentMethods,
  WisePaymentInstructions,
  PaypalInfo,
  TelegraphicTransfer,
  PrivacyPolicy,
  MachineryService,
};

export default function HelpPage({ initialSlug }) {
  const router = useRouter();
  const { topic: topicParam, isReady } = router.query;
  const { isSmallScreen } = useCheckScreenSize();

  const helpMainContentRef = useRef(null); // Ref for help-main-content
  const [menuTop, setMenuTop] = useState(400); // Default to 520px
  const timeoutRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHamburger, setShowHamburger] = useState(false); // Always hide initially on small screens
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const DEBUG = process.env.NODE_ENV === 'development'
    ? true
    : false;

 const handleScroll = useCallback(() => {
  if (!isSmallScreen) {
    DEBUG && console.log('[handleScroll] Skipped: Not a small screen');
    return;
  }

  if (typeof window === 'undefined') {
    console.error('[handleScroll] Error: window is undefined');
    return;
  }

  const currentScrollY = window.scrollY;
  DEBUG && console.log(`[handleScroll] currentScrollY: ${currentScrollY}, lastScrollY: ${lastScrollY}, showHamburger: ${showHamburger}, menuTop: ${menuTop}`);

  // Get help-main-content's original position, default to 520px
  const helpMainContentTop = helpMainContentRef.current ? helpMainContentRef.current.offsetTop : 430;
  DEBUG && console.log(`[handleScroll] helpMainContentTop: ${helpMainContentTop}`);

  // Show when scrolling down past 50px or scrolling up
  if ((currentScrollY > lastScrollY && currentScrollY > 50) || currentScrollY < lastScrollY) {
    DEBUG && console.log(`[handleScroll] Showing hamburger (scrolling ${currentScrollY > lastScrollY ? 'down past 50px' : 'up'})`);
    setShowHamburger(true);
    // Set top position to stop at 520px or helpMainContentTop
    const newMenuTop = Math.max(480, helpMainContentTop);
    setMenuTop(newMenuTop);
    DEBUG && console.log(`[handleScroll] Updated menuTop: ${newMenuTop}`);
  } else {
    DEBUG && console.log('[handleScroll] No state change (same scroll position or within 50px)');
  }

  setLastScrollY(currentScrollY);
  DEBUG && console.log(`[handleScroll] Updated lastScrollY: ${currentScrollY}`);

  // Clear previous timeout
  if (timeoutRef.current) {
    DEBUG && console.log('[handleScroll] Clearing previous timeout:', timeoutRef.current);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  // Hide after 2 seconds of no scrolling
  timeoutRef.current = setTimeout(() => {
    if (isSmallScreen && window.scrollY > 50 && showHamburger) {
      DEBUG && console.log('[handleScroll] Timeout triggered, hiding hamburger (scrollY > 50)');
      setShowHamburger(false);
      // Keep menuTop at stop position when hiding
      setMenuTop(Math.max(430, helpMainContentTop));
      DEBUG && console.log(`[handleScroll] Timeout updated menuTop: ${Math.max(430, helpMainContentTop)}`);
    } else {
      DEBUG && console.log(`[handleScroll] Timeout skipped (not small screen, scrollY <= 50, or menu already hidden)`);
    }
    timeoutRef.current = null;
  }, 2000);
  DEBUG && console.log(`[handleScroll] Set new timeout: ${timeoutRef.current}`);
}, [isSmallScreen, lastScrollY, helpMainContentRef, showHamburger]);

  // Set up scroll listener
  useEffect(() => {
    DEBUG && console.log(`[useEffect] isSmallScreen: ${isSmallScreen}, setting up scroll listener`);
    
    if (typeof window === 'undefined') {
      console.error('[useEffect] Error: window is undefined during setup');
      return () => {};
    }

    if (isSmallScreen) {
      DEBUG && console.log('[useEffect] Adding scroll event listener');
      window.addEventListener('scroll', handleScroll);
    } else {
      DEBUG && console.log('[useEffect] Not small screen, showing hamburger by default');
      setShowHamburger(true); // Always show on desktop
    }

    return () => {
      DEBUG && console.log('[useEffect] Cleaning up scroll event listener');
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        DEBUG && console.log('[useEffect] Clearing timeout during cleanup:', scrollTimeout);
        clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, isSmallScreen, scrollTimeout]);

  const allTopics = useMemo(
    () => [...topics.help, ...topics.buying],
    []
  );

  // Initialize selectedTopic from URL param or initialSlug
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const slug = (initialSlug || topicParam || 'help').toString().toLowerCase();
    return allTopics.find(t => t.slug === slug) || allTopics.find(t => t.slug === 'help');
  });

  const [isSidebarOpen, setSidebarOpen]  = useState(false);
  const [isHovered, setIsHovered]        = useState(false);
  const [styles, setStyles]              = useState({});
  const [lastActivity, setLastActivity]  = useState(0);

  useEffect(() => {
    if (!isReady && !initialSlug) return;
    const slug = (topicParam || initialSlug || 'help').toString().toLowerCase();
    setSelectedTopic(
      allTopics.find(t => t.slug === slug) ||
      allTopics.find(t => t.slug === 'help')
    );
  }, [isReady, topicParam, initialSlug, allTopics, router]);

  // Meta
  const meta = topicMeta[selectedTopic.slug] || {
    title: `${selectedTopic.name} | Meridian Motors Inc.`,
    description: `Learn more about ${selectedTopic.name} at Meridian Motors Inc.`,
    keywords: `${selectedTopic.name.toLowerCase()} | Meridian Motors Inc.`
  };

  // Auto-close sidebar 5s after last topic click (resets on each click)
  useEffect(() => {
    if (isSidebarOpen && !isHovered) {
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSidebarOpen, isHovered, lastActivity]);

  // Recompute arrow styles when sidebar toggles
  useEffect(() => {
    setTimeout(() => {
      setStyles({
        width: isSidebarOpen ? '70%' : 'auto',
        alignItems: isSidebarOpen ? 'center' : 'stretch',
        flexDirection: isSidebarOpen ? 'column' : 'column',
        backgroundColor: !isSidebarOpen ? 'var(--primary-color)' : 'transparent',
        padding: !isSidebarOpen ? '10px' : '0px',
        display: 'flex',
        transformOrigin: 'left center',
        flex: isSidebarOpen ? '1' : '',
        position: 'relative',
        left:!isSidebarOpen ? '50px': ''
      });
    }, 10);
  }, [isSidebarOpen]);

  // Scroll to top when topic changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicParam]);

  const handleTopicChange = topic => {
    setSelectedTopic(topic);
    router.push(`/help/${topic.slug}`);
    setLastActivity(Date.now());
  };

  return (
    <>
     <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={selectedTopic.image} />
      </Head>
    <div className="max-w-6xl mx-auto md:px-0 ">
      {selectedTopic.image && (
        <ImageWithLoader
          src={selectedTopic.image}
          className="topic-image"
          alt={selectedTopic.name}
        />
      )}

      <div
        className={`help-main-content ${
          selectedTopic.slug === 'help'
            ? 'help-lp'
            : ''
        }`}
        ref={helpMainContentRef}
      >
        {/* ─────────────── Sidebar ─────────────── */}
        <div
          className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`sidebar-header ${!isSidebarOpen ? '' : ''}`}>
          
              {isSidebarOpen ? (
                <div className="help-mobile-menu">
                  <h1
                    onClick={() => {
                      !isSidebarOpen
                        ? setSidebarOpen(!isSidebarOpen)
                        : handleTopicChange(topics.help[0]);
                    }}
                  >
                    HELP
                  </h1>
                  <i
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="fas fa-times"
                  ></i>
                </div>
              ) : (
                <h1 
                    className={`help-mobile-menu help-header text-2xl ${!isSidebarOpen ? 'oriented' : ''}`}
                    style={{
                    position: 'fixed', // Use fixed to ensure it stays in viewport
                    top: `${menuTop}px`,
                    right: showHamburger ? '20px' : '-60px', // Slide off-screen to the right
                    transition: 'right 0.3s ease-in-out', // Smooth slide transition
                    zIndex: 1000, // Ensure it’s above other elements
                    opacity: showHamburger ? 1 : 0, // Optional: fade effect
                    writingMode: !isSidebarOpen ? 'tb-rl' : '',
                    fontSize:'20px'

                  }}
                  onClick={() => setSidebarOpen(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                HELP
                </h1>
              )}
            
              <div
                style={styles}
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="arrow-icon-container"
              >
                <h1
                  onClick={() =>
                    !isSidebarOpen
                      ? setSidebarOpen(!isSidebarOpen)
                      : handleTopicChange(topics.help[0])
                  }
                  className={`help-header text-2xl ${!isSidebarOpen ? 'oriented' : ''}`}
                  style={{
                    color: !isSidebarOpen ? '#fff' : '#1da1f2',
                    writingMode: !isSidebarOpen ? 'tb-rl' : '',
                    letterSpacing: !isSidebarOpen ? '10px' : '',
                    
                  }}
                >
                  HELP
                  {isSidebarOpen && (

                    <div></div>
                  )}
                  <ChevronsDownIcon style={{ rotate: '', color: 'var(--accent-color)',verticalAlign:'baseline' }} />

                </h1>
              </div>
            
          </div>

            {isSidebarOpen && (
              <div className="sidebar-menu">
               {allTopics.map((topic, idx) => (
                  topic.slug !== 'help' && (
                    <button
                      key={idx}
                      onClick={() => handleTopicChange(topic)}
                      className={selectedTopic.slug === topic.slug ? 'active' : ''}
                    >
                      {topic.name}
                    </button>
                  )
                ))}
              </div>
            )}
        </div>

        {/* ─────────────── Content Area ─────────────── */}
        <div
          className={`content-area ${
          !isSidebarOpen && selectedTopic.name === 'help' ? 'collapsed' : 'open'
          }`}
          >
          <h1
          className={
            `
            text-2xl
            ${selectedTopic.name === 'our commitment to Sustainability'
              ? 'content header help-header'
              : 'content-header'}
              `
          }
          >
          {selectedTopic.slug === 'help' ? '' : selectedTopic.name}
          </h1>
          {selectedTopic.component
          ? (() => {
              const Comp = topicComponents[selectedTopic.component];
              return Comp ? <Comp /> : null;
            })()
          : selectedTopic.content && (
              selectedTopic.slug === 'help'
                ? <h1 className="help-main-heading">{selectedTopic.content}</h1>
                : <div>{selectedTopic.content}</div>
            )
          }
        </div>
      </div>
    </div>
    </>
  );
}

export async function getStaticPaths() {
  const allTopics = [
    'help',
    'how-to-buy-used-cars',
    'about-us',
    'frequently-asked-questions',
    'automated-invoice',
    'terms-and-conditions',
    'anti-social-force-policy',
    'auction',
    'about-payment',
    'wise-banking',
    'paypal',
    'telegraphic-transfer',
    'privacy-policy',
    'machinery'
  ];
  
  return {
    paths: allTopics.map(topic => ({ params: { topic } })),
    fallback: false // or 'blocking' if you want to handle new topics
  };
}

export async function getStaticProps({ params }) {
  const topicSlug = params.topic;
  // Only pass serializable data!
  return {
    props: {
      initialSlug: topicSlug,
    },
  };
}