import React, { useState } from "react";
import ImageWithLoader from "../misc/imageWithLoader";
import Link from 'next/link';
import Faqs from "./faqs";
import { namibiaFaqs } from "./data/namibiaFaqs";
import LocalServicesNav from "./localServicesNav";

const NamibiaAgent = () => {


  const [showFaq, setShowFaq] = useState(false);

  const renderAnswer = (answer, containsHtml) => {
    if (containsHtml) {
      return <p dangerouslySetInnerHTML={{ __html: answer }} />;
    }
    return <p>{answer}</p>;
  };

  const handleShowFaq = () => {
    setShowFaq(prev => !prev);
  };

  const scrollToSection = (id) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="namibia-agent-container mx-auto max-w-7xl md:px-4">
      {/* Banner */}
      <div className="banner">
        <ImageWithLoader
          src={`/images/localServices/namibia-banner-mobile3.png`}
          className="banner-image w-full h-auto md:hidden transition-transform duration-300 group-hover:scale-105"
          useWrapper={false}
          alt="namibia banner mobile"
        />
        
        <ImageWithLoader
          src="/images/localServices/namibiabanner.png"
          className="banner-image hidden md:block w-full h-auto md:h-[27rem] transition-transform duration-300 group-hover:scale-105"
          alt="Header image with containers and trucks"
        />
        

      </div>

      {/* Main Title */}
      <h1 className="main-title">Streamlined Logistics, Trusted Expertise</h1>

   {/* Intro Section */}
      {/* Intro Section */}
      <section className="intro-container md:px-4 md:py-12">
        <div className="mx-auto flex flex-col lg:flex-row items-stretch gap-8">
          <div className="w-full lg:w-1/2 border border-gray-200 p-4 flex items-center">
            <p className="text-lg text-gray-700">
              At Meridian Motors Inc., we understand that importing vehicles, tires, or parts into Namibia requires efficient and reliable clearing services. That’s why we’ve partnered with <strong>IT Import and Export CC</strong>, a trusted clearing agent with over 10 years of experience, to offer you hassle-free logistics solutions in Walvis Bay.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <ImageWithLoader
              src="/images/localServices/smallBanner.png"
              alt="Image of a ship and containers"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Navigation Icons */}
      <LocalServicesNav scrollToSection={scrollToSection} />

      {/* Agent Section */}
      <section className="agent-section">
        <ImageWithLoader
          src="/images/localServices/namibiaagentph.png"
          className="banner-image agent-image h-56 sm:h-72 object-cover rounded-lg hidden md:block"
          alt="An image of a call center agent"
        />
        <ImageWithLoader
          src={"/images/localServices/namibiaAgent-mobile3.png"}
          alt="Header image with containers and trucks"
          className="w-full object-cover rounded-lg block md:hidden"
          // removed xs:block
        />
      </section>

      {/* Services Section */}
      <section id="services" className="section-container">
        <h1 className="section-title">Container shipment services</h1>
        <div className="services">
          <h3>1. Consolidation Service</h3>
          <p>Our Consolidation Service allows vehicles from multiple customers to be combined into a single shared container, ensuring cost-efficient shipping and streamlined handling. This service is made possible through our collaboration with our trusted partner, IT Import and Export CC.</p>
          <h3>2. Customs Clearing and Documentation</h3>
          <p>
            • Hassle-free declaration and customs clearing.<br />
            • Preparation of duty, permits, and all import paperwork for your goods.
          </p>
          <h3>3. Nationwide Delivery</h3>
          <p>
            • Efficient delivery to major cities, including Swakopmund, Windhoek, and beyond.<br />
            • Border deliveries to Botswana, Angola, and Zambia.
          </p>
          <h3>4. Consignment Management</h3>
          <p>From unloading at the port to final delivery, we manage your goods every step of the way.</p>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="package-section">
        <div className="package-container">
          <div className="title text-2xl sm:text-3xl lg:text-5xl font-bold">
            <h1>A Whole Package of Premium Services!</h1>
            <ImageWithLoader alt="Decorative chevrons" src="/images/localServices/arrowscopy.png" />
          </div>
          <div className="list">
            <p className="list-item"><p><strong>Reliable Clearing Agent:</strong> With over a decade of experience, IT Import and Export CC ensures smooth customs clearance and dependable service.</p></p>
            <p className="list-item"><p><strong>Trusted Partner:</strong> Our long-standing partnership guarantees your goods are handled with care and expertise.</p></p>
            <p className="list-item"><p><strong>Bonded Warehouse:</strong> Safe and secure storage facilities for your consignments while clearing processes are completed.</p></p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="w-full py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 bg-white rounded-lg shadow-md">
          
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              We are your Partner for Stress-Free Imports
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              With <strong className="font-semibold text-gray-800">Meridian Motors Inc.</strong> and <strong className="font-semibold text-gray-800">IT Import and Export CC</strong>, you can rest assured that your goods are in safe hands. We take care of the paperwork, customs processes, and transportation so you can focus on your business. <strong className="font-semibold text-gray-800">Get started today!</strong>
            </p>
          </div>
          
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <ImageWithLoader
              src="/images/localServices/partner.png"
              alt="Image of a handshake and a ship with containers"
              className="w-full max-w-md h-64 object-contain rounded-lg shadow-md"
            />
          </div>
          
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="contact-section-wrapper">
        <section className="">
        <ImageWithLoader
          src={"/images/localServices/contactusagent.jpg"}
          alt="Contact us placeholder"
          className="w-full object-cover rounded-lg hidden md:block"
        />
        {/* mobile image */}
        <ImageWithLoader
          src={"/images/localServices/contactagent-mobile2.png"}
          alt="Contact us placeholder"
          className="w-full object-cover rounded-lg block md:hidden"
        />
        
          <div className="contact-text-container" style={{display:'none'}}>
            <p style={{ maxWidth: '26%', position: 'relative', left: '1%' }}><strong>Efficient Consolidation & Freight Services for the Best value</strong></p>
            <p><strong>Secure Bonded Warehousing & Flexible Consignment Solutions</strong></p>
            <p style={{ maxWidth: '26%' }}><strong>Seamless Customs & Duty Handling | Stress-Free Import & Export</strong></p>
          </div>
        </section>
        <section style={{display: 'none'}} className="contact-cta-section">
          <p>For any inquiries about our services from Japan or locally in Namibia, feel free to contact us at <Link className="cta-link" href="mailto:sales@artisbay.com">sales@artisbay.com</Link>. Our team is ready to assist you.</p>
        </section>
      </section>                       

      {/* FAQ Section */}
      <Faqs faqs={namibiaFaqs} />
    </div>
  );
};

export default NamibiaAgent;
