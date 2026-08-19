import React from 'react';
//import '../../css/layout/footer.css';
import Link from 'next/link';
import ImageWithLoader from '../misc/imageWithLoader';

const Footer = () => {


 return (
    <div className="footer-container">
      <div className="footer-upper">
        <div className="footer-inner">
          <Link href='/' aria-label="Go to homepage">
            <ImageWithLoader className='logo-img footer-logo' alt="Artisbay Lite Inc. logo"  src={ `/images/logo3new.png`} />
          </Link>
          <div className="info">
            <h4>
              Artisbay Lite Inc.
            </h4>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
              Artisbay Lite Inc. is an online-based platform for the sale and export of used vehicles, connecting Japanese suppliers with global buyers.
            </p>
            <p>
                email: <a href="mailto:contact@artisbay.com">contact@artisbay.com</a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Artisbay Lite Inc. All Rights Reserved.</p>
      </div>
   </div>
  );
};

export default Footer;
