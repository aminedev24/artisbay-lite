import React, {useState} from 'react';
//import './Artisbay Lite.css'; // Import the CSS file
import Contact from '../forms/contact';
function SellInArtisbay() {
  const [sell, setSell] = useState(true)
  return (
    <div className="terms-container">
      <h4 className="heading">Join Artisbay Lite Inc. and Expand Your Reach to Global Markets</h4>

      <p className="description">
        Artisbay Lite Inc. offers local Japanese small-size car dealers the opportunity to grow their business by connecting with international buyers for used cars, trucks, buses, and machinery. With our streamlined process and reliable shipping solutions, we enable dealers to reach key markets, including Dar es Salaam Port in Tanzania and Walvis Bay Port in Namibia.
      </p>

      <div className="why-choose-artisbay">
        <h4>Why Choose Artisbay Lite Inc.?</h4>
        <ul>
          <li>Strategic Shipping Ports:</li>
          <ul>
            <li>Dar es Salaam Port (Tanzania): A major hub connecting to DR Congo, Burundi, and Malawi, providing seamless access to Central and East African markets.</li>
            <li>Walvis Bay Port (Namibia): Preferred by customers in Botswana, Zimbabwe, Zambia, and DR Congo, thanks to lower shipping costs, customs, and VAT. DR Congo customers especially value this route, as it allows vehicles to be collected directly at the border for reduced expenses.</li>
          </ul>
          <li>No Membership Fees: Sell first, and pay our service fees only after your vehicles are sold - no upfront costs.</li>
          <li>Extensive Customer Network: Tap into our established database of global buyers with strong demand in African markets.</li>
          <li>Targeted Marketing: We promote your stock through Google Ads, Facebook, and other platforms to reach serious buyers effectively.</li>
        </ul>
      </div>

      <div className="how-to-get-started">
        <h4>How to Get Started?</h4>
        <ol>
          <li>Submit Your Details: Fill out the contact form on our website with your information.</li>
          <li>Agreement Signing: Once approved, we'll finalize the agreement.</li>
          <li>Share Stock Information: Provide detailed photos, specifications, and your desired FOB prices for vehicles or machinery.</li>
        </ol>
        <p>We Handle the Rest:</p>
        <ul>
          <li>We market your inventory to targeted buyers.</li>
          <li>Once a sale is made, we coordinate vehicle handling, logistics, and shipping to the buyer's preferred port.</li>
        </ul>
      </div>

      <p className="partner-call-to-action">
        Partner with Artisbay Lite Inc. Today! Artisbay Lite Inc. empowers local Japanese car dealers to expand their reach and connect with a global market. With trusted shipping to Dar es Salaam and Walvis Bay, cost-effective logistics, and targeted marketing, you'll have everything you need to grow your business - without any upfront fees.
      </p>

      <Contact sell={sell} setSell={setSell} />

      
    </div>
  );
}

export default SellInArtisbay;