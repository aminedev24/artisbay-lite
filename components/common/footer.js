import React from 'react';
//import '../../css/layout/footer.css';
import Link from 'next/link';
import ImageWithLoader from '../misc/imageWithLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faClipboardList, faShip } from '@fortawesome/free-solid-svg-icons';
import helpLinks from './helpLinks';

const trustBadges = [
  { icon: faShieldAlt, text: 'Pre-export inspection available' },
  { icon: faClipboardList, text: 'Export documents handled end to end' },
  { icon: faShip, text: 'Worldwide RoRo / container shipping' },
];

const Footer = () => {


 return (
    <div className="footer-container">
      <div className="footer-upper">
        <div className="footer-inner">
          <Link href='/' aria-label="Go to homepage">
            <ImageWithLoader className='logo-img footer-logo' alt="Meridian Motors Inc. logo"  src={ `/images/logo-meridian.svg`} />
          </Link>
          <div className="info">
            <h4>
              Meridian Motors Inc.
            </h4>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
              Meridian Motors Inc. is an online-based platform for the sale and export of used vehicles, connecting Japanese suppliers with global buyers.
            </p>
         
          </div>
          <div className="footer-sitemap">
            <h4>Quick Links</h4>
            <ul>
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-trust">
            <h4>Why Ship With Us</h4>
            <ul>
              {trustBadges.map((badge) => (
                <li key={badge.text}>
                  <FontAwesomeIcon icon={badge.icon} className="footer-trust-icon" />
                  <span>{badge.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Meridian Motors Inc. All Rights Reserved.</p>
      </div>
   </div>
  );
};

export default Footer;
