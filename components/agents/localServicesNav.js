import React from 'react';
import ImageWithLoader from "../misc/imageWithLoader";
import Link from 'next/link';

const LocalServicesNav = ({ scrollToSection }) => {
  return (
    <div className="agent-nav flex flex-wrap items-center justify-center gap-4 px-4 py-4 sm:gap-6 lg:gap-8">
      <button
        className="shrink-0 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
        onClick={() => scrollToSection('contact-section')}
        aria-label="Contact section"
      >
        <ImageWithLoader
          className="nav-icon mx-auto h-14 w-20 object-contain sm:h-20 sm:w-32 lg:h-28 lg:w-40"
          src="/images/localServices/agenticon.png"
          alt="contact icon"
        />
      </button>
      <button
        className="shrink-0 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
        onClick={() => scrollToSection('services')}
        aria-label="Services section"
      >
        <ImageWithLoader
          className="nav-icon mx-auto h-14 w-20 object-contain sm:h-20 sm:w-32 lg:h-28 lg:w-40"
          src="/images/localServices/servicesicon.png"
          alt="services icon"
        />
      </button>
      <button
        className="shrink-0 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
        onClick={() => scrollToSection('packages')}
        aria-label="Packages section"
      >
        <ImageWithLoader
          className="nav-icon mx-auto h-14 w-20 object-contain sm:h-20 sm:w-32 lg:h-28 lg:w-40"
          src="/images/localServices/stockicon.png"
          alt="packages icon"
        />
      </button>
      <Link
        href="/help/artisbayInc/auction"
        className="shrink-0 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
        aria-label="Auction help"
      >
        <ImageWithLoader
          className="nav-icon mx-auto h-14 w-20 object-contain sm:h-20 sm:w-32 lg:h-28 lg:w-40"
          src="/images/localServices/auctionicon.png"
          alt="auction icon"
        />
      </Link>
      <button
        className="shrink-0 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
        onClick={() => scrollToSection('faq-list')}
        aria-label="FAQ section"
      >
        <ImageWithLoader
          className="nav-icon mx-auto h-14 w-20 object-contain sm:h-20 sm:w-32 lg:h-28 lg:w-40"
          src="/images/localServices/faqicon.png"
          alt="FAQ icon"
        />
      </button>
    </div>
  );
};

export default LocalServicesNav;
