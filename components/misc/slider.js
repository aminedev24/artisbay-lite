import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import getConfig from 'next/config';
import { useUser } from "../user/userContext";
import ImageWithLoader from './imageWithLoader';

const { publicRuntimeConfig } = getConfig() || {};
const basePath = publicRuntimeConfig?.basePath || "";
const withBasePath = (src) => (src.startsWith("/") ? `${basePath}${src}` : src);

const MediaSlider = () => {
  const settings = {
    infinite: true,
    fade: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: false,
    pauseOnFocus: false,
  };

  const { user, logout } = useUser();

  const logoutHandler = () => {
    logout();
  };

  const mediaItems = [
    {
      src: `/images/freightersailing.jpeg`,
      link: '/stock-list',
      side: 'left',
      tag: 'Used Car Export',
      headline: ['Japanese Quality,', 'Delivered Worldwide'],
      sub: 'Premium used cars shipped to your port — transparent pricing, every step.',
      cta: 'Browse Stock',
    },
    {
      src: `/images/head-office.jpg`,
      link: '/help/about-us',
      side: 'left',
      tag: 'Based in Japan',
      headline: ['Sourced Directly', "from Japan's Top Auctions"],
      sub: 'Decades of local expertise. Your trusted gateway to the Japanese auto market.',
      cta: 'About Us',
      imgPosition: 'center bottom',
    },
    {
      src: `/images/overview.jpg`,
      link: '/register',
      side: 'left',
      tag: 'Join Meridian Motors',
      headline: ['Investing in', 'Each Other'],
      sub: 'No membership fees. No hidden costs. Grow your business with a trusted partner.',
      cta: 'Register Free',
    },
    {
      src: `/images/localServices/namibia-port-banner.png`,
      link: '/local-services/Namibia/Walvisbay/',
      side: 'left',
      flag: '🇳🇦',
      tag: 'Walvis Bay · Namibia',
      headline: ['Clearing & Forwarding', 'Services in Namibia'],
      sub: 'Container consolidation · Duty-free handling · Nationwide delivery',
      cta: 'Our Namibia Agent',
      imgPosition: 'center bottom',
      imgScale: 1.15,
    },
    {
      src: `/images/localServices/tanzania-port-banner.png`,
      link: '/local-services/Tanzania/Dar-Essalam/',
      side: 'left',
      flag: '🇹🇿',
      tag: 'Dar es Salaam · Tanzania',
      headline: ['Clearing & Forwarding', 'Services in Tanzania'],
      sub: 'Container consolidation · Duty-free handling · East & Central Africa coverage',
      cta: 'Our Tanzania Agent',
      imgPosition: 'center bottom',
      imgScale: 1.15,
    },
  ];

  return (
    <div className="slider-container sm:mb-1 md:m-auto">
      <div className="slider image-slider-section">
        <Slider {...settings}>
          {mediaItems.map((item, index) => (
            <div key={index}>
              <Link href={item.link}>
                <div className={`ab-slide ab-slide--${item.side}`}>
                  <img
                    src={withBasePath(item.src)}
                    alt={item.tag}
                    className="ab-slide-img"
                    style={{
                      objectPosition: item.imgPosition || 'center',
                      ...(item.imgScale ? { transform: `scale(${item.imgScale})`, transformOrigin: 'center center' } : {}),
                    }}
                  />
                  <div className="ab-overlay">
                    <div className="ab-text">
                      <span className="ab-tag">
                        {item.flag && <span className="ab-flag">{item.flag}</span>}
                        {item.tag}
                      </span>
                      <h2 className="ab-headline">
                        {item.headline.map((line, i) => (
                          <span key={i}>{line}{i < item.headline.length - 1 && <br />}</span>
                        ))}
                      </h2>
                      <p className="ab-sub">{item.sub}</p>
                      <span className="ab-cta">{item.cta} &rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <div className="right-image register-banner">
        {!user ? (
          <>
            <div className="register-banner">
              <ImageWithLoader alt='register-now' src={`/images/homepage/register0b2.png`} />
              <Link href='/login'><button className="sign-in-btn">sign in</button></Link>
              <Link href='/register'><button className="register-btn">register</button></Link>
            </div>
          </>
        ) : (
          <>
            <div className="welcome-banner">
              <ImageWithLoader alt="" src={`/images/homepage/register1.png`} />
              <button onClick={logoutHandler} className="contact-btn">Logout</button>
              <Link href='/profile'><button className="profile-btn">profile</button></Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaSlider;
