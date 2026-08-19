//"use client";
import React, { useState, useEffect, useRef } from "react";
//import Stocklist from "../misc/stockList";
import carData from "../vehicles/carData";
//import styles from "@/css/pages/homepage.module.css";
//import '../../styles/custom/pages/homepage.css';
import SearchForm from "../misc/searchContainer";
import MediaSlider from "../misc/slider";
import Makestypes from "../utilities/makestypes";
import ImageWithLoader from "../misc/imageWithLoader";
import Link from "next/link";
import CarList from "../dataFetch/fetchStock";
//import Image from 'next/image';



// A simple spinner component (you can also extract this to its own file)
const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

function ThumbnailCarousel({ cards }) {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const s = useRef({
    pos: 0, paused: false, touching: false, dragging: false,
    prevX: 0, velocity: 0, dragDist: 0, raf: null, momentumRaf: null,
  });

  const SPEED = 0.1;
  const doubled = [...cards, ...cards];

  // Auto-scroll loop
  useEffect(() => {
    const track = trackRef.current;
    const st = s.current;
    const step = () => {
      if (!st.paused && !st.touching && !st.dragging) {
        const half = track.scrollWidth / 2;
        st.pos -= SPEED;
        if (st.pos <= -half) st.pos += half;
        track.style.transform = `translateX(${st.pos}px)`;
      }
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, []);

  // Touch move (non-passive so we can preventDefault)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const st = s.current;
    const onTouchMove = (e) => {
      if (!st.touching) return;
      const x = e.touches[0].clientX;
      const delta = x - st.prevX;
      st.velocity = delta;
      st.prevX = x;
      const half = track.scrollWidth / 2;
      st.pos += delta;
      while (st.pos > 0) st.pos -= half;
      while (st.pos <= -half) st.pos += half;
      track.style.transform = `translateX(${st.pos}px)`;
      e.preventDefault();
    };
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => wrapper.removeEventListener('touchmove', onTouchMove);
  }, []);

  // Mouse drag — mousemove/mouseup on document so drag works outside the wrapper
  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    const st = s.current;

    const coast = () => {
      let vel = st.velocity;
      const run = () => {
        vel *= 0.95;
        if (Math.abs(vel) < 0.3) { st.paused = false; return; }
        const half = track.scrollWidth / 2;
        st.pos += vel;
        while (st.pos > 0) st.pos -= half;
        while (st.pos <= -half) st.pos += half;
        track.style.transform = `translateX(${st.pos}px)`;
        st.momentumRaf = requestAnimationFrame(run);
      };
      st.momentumRaf = requestAnimationFrame(run);
    };

    const onMouseMove = (e) => {
      if (!st.dragging) return;
      const delta = e.clientX - st.prevX;
      st.velocity = delta;
      st.prevX = e.clientX;
      st.dragDist += Math.abs(delta);
      const half = track.scrollWidth / 2;
      st.pos += delta;
      while (st.pos > 0) st.pos -= half;
      while (st.pos <= -half) st.pos += half;
      track.style.transform = `translateX(${st.pos}px)`;
    };

    const onMouseUp = () => {
      if (!st.dragging) return;
      st.dragging = false;
      wrapper.style.cursor = 'grab';
      coast();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onMouseEnter = () => { if (!s.current.dragging) s.current.paused = true; };
  const onMouseLeave = () => { if (!s.current.dragging) s.current.paused = false; };

  const onMouseDown = (e) => {
    const st = s.current;
    st.dragging = true;
    st.paused = true;
    st.prevX = e.clientX;
    st.velocity = 0;
    st.dragDist = 0;
    cancelAnimationFrame(st.momentumRaf);
    wrapperRef.current.style.cursor = 'grabbing';
    e.preventDefault();
  };

  // Suppress link navigation when the user actually dragged
  const onClickCapture = (e) => {
    if (s.current.dragDist > 6) {
      e.preventDefault();
      e.stopPropagation();
      s.current.dragDist = 0;
    }
  };

  const onTouchStart = (e) => {
    const st = s.current;
    st.touching = true;
    st.paused = true;
    cancelAnimationFrame(st.momentumRaf);
    st.prevX = e.touches[0].clientX;
    st.velocity = 0;
  };

  const onTouchEnd = () => {
    const track = trackRef.current;
    const st = s.current;
    st.touching = false;
    let vel = st.velocity;
    const coast = () => {
      vel *= 0.95;
      if (Math.abs(vel) < 0.3) { st.paused = false; return; }
      const half = track.scrollWidth / 2;
      st.pos += vel;
      while (st.pos > 0) st.pos -= half;
      while (st.pos <= -half) st.pos += half;
      track.style.transform = `translateX(${st.pos}px)`;
      st.momentumRaf = requestAnimationFrame(coast);
    };
    st.momentumRaf = requestAnimationFrame(coast);
  };

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden select-none"
      style={{ cursor: 'grab' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClickCapture={onClickCapture}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex gap-2 will-change-transform">
        {doubled.map((card, i) => (
          <Link key={i} href={card.link} className="group shrink-0 w-[28vw] md:w-44 lg:w-52" draggable={false}>
            <div className="bg-white shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <ImageWithLoader src={card.imgSrc} alt={card.alt} useWrapper={false} className="w-full h-16 md:h-auto object-cover" />
              <div className="p-1 md:p-3 lg:p-5 text-center">
                <p className="text-xs leading-tight md:text-sm lg:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{card.alt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [, setCars] = useState([]);
  /*
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    location: "",
    searchTerm: "",
  });
  */
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setCars(carData);
      setIsLoading(false);
    }, 2000);
  }, []);

    const infoCards = [
    { imgSrc: `/images/howToBuy.png`, link: "/help/artisbayInc/how-to-buy-used-cars", alt: "How to Buy" },
    { imgSrc: `/images/Thumbnails/payment.png`, link: "/help/artisbayInc/about-payment", alt: "How to Pay" },
    { imgSrc: `/images/Thumbnails/auction.png`, link: "/help/artisbayInc/auction", alt: "Auctions" },
    { imgSrc: `/images/Thumbnails/about-us.png`, link: "/help/artisbayInc/about-us", alt: "About Us" },
    { imgSrc: `/images/Thumbnails/machinery.png`, link: "/help/artisbayInc/machinery", alt: "Machinery" },
    { imgSrc: `/images/Thumbnails/feedback.svg`, link: "/feedback", alt: "Feedback" },
  ];

  const links1 = [
    { text: "ABOUT US", path: "/help/artisbayInc/about-us" },
    { text: "BANK INFORMATION", path: "/help/artisbayInc/bank-information" },
    { text: "WHY ARTISBAY LITE INC", path: "/help/artisbayInc/about-us/#whyChooseArtisbay"},
    { text: "TERMS AND CONDITIONS", path: "/help/artisbayInc/terms-and-conditions" },
    { text: "ANTI SOCIAL FORCES POLICY", path: "/help/artisbayInc/anti-social-force-policy" },
    { text: "HOW TO BUY CARS ON ARTISBAY LITE INC", path: "/help/artisbayInc/how-to-buy-used-cars" },
  ];

  const links2 = [
    { text: "ABOUT PAYMENT", path: "/help/artisbayInc/about-payment" },
    { text: "PRIVACY", path: "/help/artisbayInc/privacy-policy" },
    { text: "TELEGRAPHIC TRANSFER", path: "/help/artisbayInc/telegraphic-transfer" },
  ];


  /*
  if (isLoading) {
    return <LoadingSpinner />;
  }
  */

  return (
    <div className="layout">
   
      <div className="">
        <div className="main-content">
          <div className="homepage">
            <MediaSlider />
          
           
          </div>
        </div>

         {/* Info Cards     */}
        <section className="px-4 mt-0 pt-1 md:pt-4 lg:pt-6">
          <h1 style={{color: 'var(--accent-color)'}} className="text-sm md:text-2xl lg:text-4xl font-bold text-center leading-none my-0 py-0 mb-1 md:mb-4 lg:mb-10 text-gray-800">Learn More About Us</h1>
          <ThumbnailCarousel cards={infoCards} />
        </section>

    

        {/* Stock Section  */}
          {/* Search Form  */}
        <SearchForm />

        {/* Make Types Section   */}
        <Makestypes />
      
        
        
        <CarList />
       
       <div className="usefulLinks_wrapper">

          <ImageWithLoader
              src={`/images/usefullLinksTitle.png`} 
              alt="usefullLinks" 
              className="title-img"
         
          />
          
          <div className="usefulLinks_container">
         
            {/*<img className="title-img" src={`/images/usefullLinksTitle.png`} alt="usefullLinks" />*/}
            
            <div className="links">
              <ul className="useful-links-list">
                {[...links1, ...links2].map((link, index) => (
                  <li key={index}>
                    {/* Use <Link> for internal, <a> for external if needed */}
                    <Link href={link.path}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="image-usefulLinks_container">
              
              
              <ImageWithLoader
                alt="A large signboard with the ARTISBAY LITE logo and the text 'ARTISBAY LITE INC. DESIGNED TO SERVE YOU' in front of a modern building with glass windows."
                src={`/images/companyprofile.jpg`}
              />
              
            </div>
           
          </div>
        </div>

        <div>
          <div className="banner-header-container">
            
            <div className='bordered '>
              <ImageWithLoader
                  src={`/images/paymentmethodhome3-mobile.png`}
                  className="banner w-full h-auto md:hidden transition-transform duration-300 group-hover:scale-105"
                  useWrapper={false}
                  alt="payment warning banner mobile"
               />
              <ImageWithLoader
                src={`/images/paymentmethodshome.png`}
                className="banner hidden md:block"
                useWrapper={false}
                alt='payment warning banner desktop'
              /> 
              <Link href="/help/artisbayInc/paypal">
                <button className="paypal-btn">read more</button>
              </Link>
              <Link href="/help/artisbayInc/telegraphic-transfer">
                <button className="bank-btn">read more</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback CTA */}
        <section style={{background: 'var(--primary-color)'}} className="mx-auto px-4 py-10 text-center text-white">
          <div style={{fontSize:'3rem', fontWeight:900, lineHeight:1, color:'#fff'}}>4.9</div>
          <div style={{display:'flex', justifyContent:'center', gap:'4px', margin:'6px 0 8px'}}>
            {Array.from({length:5}).map((_,i)=>(
              <i key={i} className="fas fa-star" style={{color:'var(--accent-color)', fontSize:'1.3rem'}} />
            ))}
          </div>
          <p style={{opacity:0.75, fontSize:'0.9rem', marginBottom:'1.2rem'}}>Rated by our customers worldwide</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Happy with our service?</h2>
          <p style={{opacity:0.8, maxWidth:'480px', margin:'0 auto 1.5rem'}}>Share your experience and help others discover Artisbay Lite Inc.</p>
          <Link href="/feedback">
            <button style={{background:'var(--accent-color)', color:'#fff', border:'none', padding:'0.75rem 2.5rem', borderRadius:'6px', fontWeight:700, fontSize:'1rem', cursor:'pointer'}}>
              Leave a Review
            </button>
          </Link>
        </section>

        {/* Why Choose Us */}
        <section style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'}} className="mx-auto px-4 py-12">
          <h1 className="text-3xl font-semibold text-center mb-8">Why Choose Us?</h1>
          <div className="flex flex-col gap-8 items-center">
            <div className="w-full">
              <div className="relative w-full">
                <ImageWithLoader
                  src={`/images/whychooseushome-mobile.png`}
                  className="banner w-full h-auto md:hidden transition-transform duration-300 group-hover:scale-105"
                  alt="Why Choose Us banner mobile"
                />
                <Link href="/help/artisbayInc/about-us/#whyChooseArtisbay">
                  <span
                    className="absolute inset-0 block cursor-pointer md:hidden"
                    aria-label="Read more about why to choose Artisbay Lite"
                  />
                </Link>
              </div>
              <ImageWithLoader
                src={`/images/whychooseushome.png`}
                alt="Why Choose Us banner"
                className="w-full object-cover rounded-lg shadow-md hidden md:block"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-700 mb-4 text-center font-bold" style={{maxWidth: '1200px'}}>
                With over 40 years of experience and a passion for quality, we deliver high-standard used vehicles, tires, and parts tailored to your needs. Our transparent processes and detailed documentation ensure confidence and trust in every transaction.
              </p>
              <Link
                href="/help/artisbayInc/about-us/#whyChooseArtisbay"
                className="px-6 py-2 text-white font-semibold rounded hover:bg-blue-700 transition-colors duration-300"
                style={{backgroundColor: 'var(--secondary-color)'}}
              >
                Read More
              </Link>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'}} className="container mx-auto px-4 py-12 text-center rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Need Help?</h2>
          <p className="text-lg mb-6">Contact us today and let us help you import your next car with ease!</p>
          <button style={{border: 'none'}}><Link style={{background: 'var(--primary-color)', color: '#fff'}} href="/contact" className="inline-block px-8 py-3  font-semibold rounded transition-colors duration-300">
            Contact Us
          </Link></button>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
