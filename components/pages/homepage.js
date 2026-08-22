import React, { useRef, useEffect } from "react";
import InventoryConsole from "./inventoryConsole";
import ImageWithLoader from "../misc/imageWithLoader";
import Link from "next/link";
import CarList from "../dataFetch/fetchStock";
import Button from "../common/Button";
import Section from "../common/Section";

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
  const infoCards = [
    { imgSrc: `/images/howToBuy.png`, link: "/help/how-to-buy-used-cars", alt: "How to Buy" },
    { imgSrc: `/images/Thumbnails/payment.png`, link: "/help/about-payment", alt: "How to Pay" },
    { imgSrc: `/images/Thumbnails/auction.png`, link: "/help/auction", alt: "Auctions" },
    { imgSrc: `/images/Thumbnails/about-us.png`, link: "/help/about-us", alt: "About Us" },
    { imgSrc: `/images/Thumbnails/machinery.png`, link: "/help/machinery", alt: "Machinery" },
    { imgSrc: `/images/Thumbnails/feedback.svg`, link: "/feedback", alt: "Feedback" },
  ];

  return (
    <div className="layout">
   
      <div className="">
        <InventoryConsole />

         {/* Info Cards     */}
        <section className="px-4 mt-0 pt-1 md:pt-4 lg:pt-6">
          <h1 className="text-sm md:text-2xl lg:text-4xl font-bold text-center leading-none my-0 py-0 mb-1 md:mb-4 lg:mb-10 text-brand-orange">Learn More About Us</h1>
          <ThumbnailCarousel cards={infoCards} />
        </section>

        <CarList />

        {/* Auction CTA */}
        <Section tone="muted" className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Prefer to Bid Yourself?</h2>
          <p className="max-w-xl mx-auto text-gray-700 mb-6">
            Join our live Japanese auction platform and buy straight from the source.
          </p>
          <Button variant="primary" href="/help/auction">Explore Auctions</Button>
        </Section>

        {/* Feedback CTA */}
        <Section tone="navy" className="mx-auto text-center">
          <div className="text-5xl font-black leading-none text-white">4.9</div>
          <div className="flex justify-center gap-1 my-2 mb-2">
            {Array.from({length:5}).map((_,i)=>(
              <i key={i} className="fas fa-star text-brand-orange text-xl" />
            ))}
          </div>
          <p className="opacity-75 text-sm mb-5">Rated by our customers worldwide</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Happy with our service?</h2>
          <p className="opacity-80 max-w-md mx-auto mb-6">Share your experience and help others discover Meridian Motors Inc.</p>
          <Button variant="accent" href="/feedback">Leave a Review</Button>
        </Section>

        {/* Why Choose Us */}
        <Section className="mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-8">Why Choose Us?</h1>
          <div className="flex flex-col gap-8 items-center">
            <div className="w-full">
              <div className="relative w-full">
                <ImageWithLoader
                  src={`/images/whychooseushome-mobile.png`}
                  className="banner w-full h-auto md:hidden transition-transform duration-300 group-hover:scale-105"
                  alt="Why Choose Us banner mobile"
                />
                <Link href="/help/about-us/#whyChooseUs">
                  <span
                    className="absolute inset-0 block cursor-pointer md:hidden"
                    aria-label="Read more about why to choose Meridian Motors"
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
              <Button variant="accent" href="/help/about-us/#whyChooseUs" className="!px-6 !py-2">
                Read More
              </Button>
            </div>
          </div>
        </Section>

        {/* Contact CTA */}
        <Section className="container mx-auto text-center rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Need Help?</h2>
          <p className="text-lg mb-6">Contact us today and let us help you import your next car with ease!</p>
          <Button variant="primary" href="/contact">Contact Us</Button>
        </Section>
      </div>
    </div>
  );
}

export default HomePage;
