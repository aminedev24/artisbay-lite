import React from 'react';
import ArtisbayOverview from './overview';
import Link from 'next/link';
import useCheckScreenSize from '../utilities/screenSize';
//import ImageWithLoader from '../misc/imageWithLoader';

const CompanyProfile = (selectedTopic) => {
 // const { isSmallScreen , isPortrait} = useCheckScreenSize();
  //onsole.log(isPortrait)
  const companyDetails = {
    name: "Artisbay Lite Inc.",
    founded: "November 2024",
    address: "Cross Gate, 7th Floor, 1-101-1 Sakuragicho, Naka-ku, Yokohama, Kanagawa, Japan",
    mainBusiness: "An online-based platform for the sale and export of used vehicles and auto parts.",
    annualSales: "5,216,002 JPY As of April 2025",
    url: "https://artisbay.com",
    registeredinJapan: "Under the Yokohama Legal Affairs Bureau",
    email: 'contact@artisbay.com',
    business: 'Export and import of used vehicles, automotive spare parts, and related products.',
    secondHandDelear: 'From Kanagawa Prefectural Public Safety Commission No: 452520017544',
    licenceOfSecondHandDealer: '452520017544',
    exportingArea: 'Africa, Asia, Europe, Oceania',
    bankInformation: 'Sumishin sbi net bank',
    director: 'Sato Yumiko'
  };

  return (
    <div className="company-profile-wrapper">
      <ArtisbayOverview />
      {/*<img src={`${process.env.PUBLIC_URL}/images/companyProfile.jpg`} alt={'company-profile'} className="topic-image" />*/}
     
      <div className="terms-container">
      <h2>Head Office</h2>
      <table className="bank-info-table">
        <tbody>
            <tr>
                <th>Company Name</th>
                <td>{companyDetails.name}</td>
            </tr>
            <tr>
                <th>Founded</th>
                <td>{companyDetails.founded}</td>
            </tr>
            <tr>
                <th>Address</th>
                <td>{companyDetails.address}</td>
            </tr>
            <tr>
                <th>Bank</th>
                <td>{companyDetails.bankInformation} <Link href='/help/artisbayInc/bank-information' className='cta-link'>(details)</Link></td>
            </tr>
            <tr>
                <th>Business</th>
                <td className="align-top">
                  <p style={{padding: '0'}} className="max-w-[30rem] leading-relaxed sm:max-w-[37rem] sm:text-base">
                    {companyDetails.business}
                  </p>
                </td>
            </tr>

            <tr>
                <th>Exporting Area</th>
                <td>{companyDetails.exportingArea}</td>
            </tr>

            <tr>
                <th>Annual Sales</th>
                <td>{companyDetails.annualSales}</td>
            </tr>
            <tr>
                <th>URL</th>
                <td>{companyDetails.url}</td>
            </tr>
            <tr>
                <th>Registered</th>
                <td>{companyDetails.registeredinJapan}</td>
            </tr>
            <tr>
                <th>Secondhand Dealer</th>
                <td>{companyDetails.secondHandDelear}</td>
            </tr>
           
            <tr>
                <th>Director</th>
                <td>{companyDetails.director}</td>
            </tr>

            <tr>
                <th>Email</th>
                <td>{companyDetails.email}</td>
            </tr>
      
        </tbody>
    </table>

    {/* Banner Section */}
    <div className='location-banner'>
      
    </div>

    <div id='whyChooseArtisbay' className="why-choose-container">
      <h2 className="content-title">Why Choose Artisbay Lite Inc.?</h2>
      <p className="text-content">
        Artisbay Lite Inc. combines over <strong>40 years</strong> of customer
        service expertise with a passion for the automotive industry and modern
        technology.
      </p>
      <p className="text-content">
        With Artisbay Lite Inc., you receive reliable, professional service built on
        trust, integrity, and attention to detail.
      </p>
    </div>


    <div className="location-container w-full">
      <h2>Location</h2>
      <iframe
        title='map'
        allowFullScreen=""
        width="100%"
        height="450"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        className="w-full map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.9924179146467!2d139.63034839999998!3d35.450845099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185c5f01732dd3%3A0xaf83a870969f2375!2z5riL6LC35biC44OH44O844Or!5e0!3m2!1sen!2sjp!4v1616149200000!5m2!1sen!2sjp"
      >
      </iframe>
    </div>      
        


      </div>
    </div>
  );
};

export default CompanyProfile;
