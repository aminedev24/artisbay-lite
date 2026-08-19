import React from 'react';
import Link  from 'next/link';

const ArtisbayInfo = () => {
  return (
    <div className='whyChoose'>
      {/*<img style={{ maxHeight : 'unset' }} src={`${process.env.PUBLIC_URL}/images/whychooseus2.jpeg`} alt={'company-profile'} className="topic-image" />*/}

      <div>
        <h4>1. Expertise and Experience</h4>
        <p>
          With a team of automotive enthusiasts blending over 40 years of customer service experience with modern technology, Artisbay Lite Inc. brings a deep understanding of both the industry and the needs of today’s buyers. Quality and trust matter to us, and we deliver both with every transaction.
        </p>
      </div>
      <div>
        <h4>2. High-Quality Products</h4>
        <p>
          We specialize in providing high-quality used vehicles, carefully selected to match our customers’ exact criteria. For used tires, each one is thoroughly inspected and graded to meet our rigorous standards, ensuring confidence in both safety and performance. When it comes to used parts, we maximize value by stripping vehicles and allowing you to choose precisely what you need, so you don’t miss out on any valuable components.
        </p>
      </div>
      <div>
        <h4>3. Customized Services for Every Need</h4>
        <p>
          Artisbay Lite Inc. offers a tailored experience—from vehicle selection directly from Japanese auctions to a full range of customized dismantling, packing, and shipping options. We go the extra mile to accommodate specific customer requirements, ensuring every detail is handled with care.
        </p>
      </div>
      <div>
        <h4>4. Transparent Process with Full Documentation</h4>        
        <p>
          Transparency is at the core of our operations. We provide detailed photo and video documentation at each stage of the loading and shipping process, so you know exactly what you’re receiving. This openness builds trust and gives you peace of mind.
        </p>
      </div>
      <div>
        <h4>5. Environmental Responsibility</h4>
        <p>
          We deeply care about the environmental impact of our industry and encourage sustainable practices. By offering high-quality used products, we help extend the life of valuable materials, reduce waste, and make responsible recycling easier for our customers.
        </p>
      </div>
      <div>
        <h4>6. Reliable and Professional Service</h4>
        <p>
          Our commitment to professionalism and respect for every customer is reflected in the service we provide. From smooth communication to reliable delivery, we’re dedicated to making each interaction with Artisbay Lite Inc. a positive and dependable experience.
        </p>
      </div>
      <p>
        Choose Artisbay Lite Inc. for quality you can trust, transparency you can rely on, and a customer experience built on respect and integrity. We look forward to serving you!
      </p>
      <div className='cta-container'> 
        <p className='cta-text'>Have any questions? We're here to help!</p> 
        <button className='cta-btn'>
          <Link href='/contact'>Contact Us</Link> 
        </button>
      </div>

    </div>
  );
};

export default ArtisbayInfo;
