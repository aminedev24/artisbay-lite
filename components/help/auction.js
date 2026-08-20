import React from 'react';
import Link from 'next/link';

const AuctionLanding = () => {
  return (
    <div className="terms-container space-y-8">
      <div className="">
        <h4>Source Cars from Japanese Auctions with Meridian Motors Inc.</h4>
        <p>
          At Meridian Motors Inc., we connect overseas buyers with reliable suppliers in Japan, granting you access to high-quality cars directly from auctions at exceptionally fair prices. Whether you&rsquo;re an individual buyer or a dealer, our goal is to simplify the process and maximize your value.
        </p>
      </div>
      <div className="">
        <h4>Why Choose Meridian Motors?</h4>
        <ul>
          <li>Fair and Transparent Pricing</li>
          <li>Tailored Dealer Packages</li>
          <li>Efficient Work</li>
        </ul>
      </div>
      <div className="">
        <h4>How It Works</h4>
        <ol>
          <li>Send Your Deposit</li>
          <li>Discuss Your Requirements</li>
          <li>We Secure the Car</li>
          <li>Final Payment and Shipping</li>
        </ol>
      </div>
      <div className="">
        <h4>Already Found the Car You Want? Let Us Handle the Rest</h4>
        <p>
          If you&rsquo;re already browsing auction platforms and have a specific car in mind, we can help you secure it! Simply provide us with:
        </p>
        <ul>
          <li>The lot number</li>
          <li>The make and model</li>
          <li>The auction date</li>
        </ul>
      </div>
      <div className="">
        <h4>Are you familiar with bidding by yourself?</h4>
        <p>
          Get direct access to our auctions platform and start buying straight from the source.
        </p>

        <Link href='https://auc.artisbay.com' className='bg-blue-900 text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition duration-200' target='_blank'>Subscribe to Auctions</Link>
      </div>
      <div className="">
        <h4>Service Fee</h4>
        <p>
          We charge a transparent service fee per car. Please get in touch with us to learn more about the fee structure and additional services available.
        </p>
      </div>
      <div className="">
        <h4>Exclusive Benefits</h4>
        <ul>
          <li>Flexible Payment Options</li>
          <li>Container Consolidation Services</li>
        </ul>
      </div>
      <div className="">
        <h4>Why Japanese Car Auctions?</h4>
        <p>
          Japanese car auctions, operated by major auction houses like USS, TAA, and JU, are among the most reliable and efficient markets for sourcing quality vehicles. With over <strong>45,000 vehicles listed daily</strong> across more than 190 auction houses, buyers can access a massive inventory that ranges from economy cars to luxury models.
        </p>
      </div>
      <div className="">
        <h4>Start Your Auction Journey with Meridian Motors Inc.</h4>
        <p>
          Take control of your car-sourcing experience with Meridian Motors Inc. Whether you&rsquo;re ready to buy or need assistance with the process, we&rsquo;re here to help.
        </p>
        <p>
          <strong><Link className='cta-link' href='/contact'>Contact us today</Link></strong> to discuss your needs and secure the best vehicles from Japanese auctions.
        </p>
        <p>
          Already know what you want? <Link href='/invoice-generator' className='cta-link'>Request an invoice</Link> now to make a deposit and start your purchase immediately!
        </p>
      </div>
    </div>
  );
};

export default AuctionLanding;
