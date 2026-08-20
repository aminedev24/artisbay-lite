import React, {useState} from "react";
import ImageWithLoader from "../misc/imageWithLoader";
import Link from 'next/link';
import { tanzaniaFaqs } from "./data/tanzaniaFaqs";
import LocalServicesNav from "./localServicesNav";
import Faqs from "./faqs";
const TanzainaAgent = () => {


    

    const renderAnswer = (answer, containsHtml) => {
      if (containsHtml) {
        return <p dangerouslySetInnerHTML={{ __html: answer }} />;
      } else {
        return <p>{answer}</p>;
      }
    }  

    const [showFaq, setShowFaq ] = useState(false);
  
    const handleShowFaq = () => {
      setShowFaq(!showFaq);
    }

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="namibia-agent-container">
      
      <div className="banner">
        <ImageWithLoader
            src={`/images/localServices/tanzaniabanner.png`} 
            className="banner-image"
            alt="Header image with containers and trucks"
          />
      </div>
      <h1 className="main-title header">
        Streamlined Logistics, Trusted Expertise
      </h1>
 

      <section className="intro-container px-4 py-12">
          <div className="mx-auto flex flex-col lg:flex-row items-stretch gap-8">
            <div className="w-full lg:w-1/2 border border-gray-200 p-4 flex items-center">
              <p className="text-lg text-gray-700">
                At Meridian Motors Inc., we understand that importing vehicles, tires, or parts into Namibia requires efficient and reliable clearing services. That’s why we’ve partnered with <strong>star Voyage Shippers Company Limited</strong>, a trusted clearing agent with over 10 years of experience, to offer you hassle-free logistics solutions in Dar Essalam.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <ImageWithLoader
                src="/images/localServices/smallbanner2.png"
                alt="Image of a ship and containers"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
      </section>
      
      <LocalServicesNav scrollToSection={scrollToSection} />

       {/* 
      <div className="banner why-choose-agent-section">
        <ImageWithLoader className="banner-image" alt="namibia-agent-banner" src={`/images/localServices/tanzaniaagent.png`}/>
      </div>
      */}


    <section className="agent-section">
  
          <ImageWithLoader
                src={`/images/localServices/tanzaniaagentph.png`} 
                className="banner-image agent-image agent-image h-56 sm:h-72 object-cover rounded-lg hidden md:block"
                alt="An image of a call center agent"
          />

           <ImageWithLoader
                  src={"/images/localServices/tanzania-agent-mobile4.png"}
                  alt="An image of a call center agent"
                  className="w-full object-cover rounded-lg block md:hidden"
                  // removed xs:block
          />
  
        
      </section>
 
  
      
      <section id="services" className="section-container">
        <h1 className="section-title">
          Container shipment services
        </h1>
        <div className="services">
          <h3>
          1. Consolidation Service
          </h3>
          <p>
          Our Consolidation Service allows vehicles from multiple customers to be combined into a single shared container, ensuring cost-efficient shipping and streamlined handling. This service is made possible through our collaboration with our trusted partner, <strong>StarVoyage Shippers Company Limited.</strong>
          </p>
          <h3>
          2. Customs Clearing and Documentation
          </h3>
          <p>
          • Hassle-free declaration and customs clearing.
          <br/>
          • Preparation of duty, permits, and all import paperwork for your goods.
          </p>
          <h3>
          3. Nationwide Delivery
          </h3>
          <p>
          • Efficient delivery to major cities, including Dar Essalam, Arusha and beyond.
          <br/>
          • Border deliveries to DR-Congo, Zambia, Malawi, Uganda, Zimbabwe.
          </p>
          <h3>
          4. Consignment Management
          </h3>
          <p>
          From unloading at the port to final delivery, we manage your goods every step of the way.
          </p>
        </div>
      </section>
      {/*
      
      */}


      <section id="packages" className="package-section">
        <div className="package-container">
          <div className="title text-2xl sm:text-3xl lg:text-5xl font-bold">
            <h1>A Whole Package of Premium Services!</h1> 
            <ImageWithLoader alt="Decorative chevrons" src="/images/localServices/arrowscopy.png" />
          </div>
          <div className="list">
            <div className="list-item">
              <strong>Reliable Clearing Agent:</strong> With over a decade of experience, StarVoyage Shippers 
              Company Limited ensures smooth customs clearance and dependable service.
            </div>
            <div className="list-item">
              <strong>Trusted Partner:</strong> Our long-standing partnership guarantees your goods are handled with care and expertise.
            </div>
            <div className="list-item">
              <strong>Bonded Warehouse:</strong> Safe and secure storage facilities for your consignments while clearing processes are completed.
            </div>
          </div>
        </div>
      </section>
   
     

      <section className="w-full py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 bg-white rounded-lg shadow-md">
          
          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              We are your Partner for Stress-Free Imports
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              With <strong className="font-semibold text-gray-800">Meridian Motors Inc.</strong> and <strong className="font-semibold text-gray-800">StarVoyage Shippers Company Limited.</strong>, you can rest assured that your goods are in safe hands. We take care of the paperwork, customs processes, and transportation so you can focus on your business.
              <strong className="font-semibold text-gray-800 block mt-3">
                Get started today!
              </strong>
            </p>
          </div>
          
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <ImageWithLoader
              src="/images/localServices/partner.png"
              alt="Image of a handshake and a ship with containers"
              className="w-full max-w-md h-64 object-contain rounded-lg shadow-md"
              height="200"
            />
          </div>
          
        </div>
      </section>
      

    <section id="contact-section" className="contact-section-wrapper">
    <section className="contact-section-container">
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
  
              
    </section>


    </section>

    <Faqs faqs={tanzaniaFaqs} />
  
  </div>
  );
};

export default TanzainaAgent;
