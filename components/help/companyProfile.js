import React from 'react';
import CompanyOverview from './overview';
import Link from 'next/link';
import useCheckScreenSize from '../utilities/screenSize';
//import ImageWithLoader from '../misc/imageWithLoader';

const CompanyProfile = (selectedTopic) => {
 // const { isSmallScreen , isPortrait} = useCheckScreenSize();
  //onsole.log(isPortrait)
  const companyDetails = {
    name: "Meridian Motors Inc.",
    url: "https://meridianmotors.com",
    email: 'contact@meridianmotors.com',
    business: 'Export and import of used vehicles, automotive spare parts, and related products.',
    exportingArea: 'Africa, Asia, Europe, Oceania',
  };

  return (
    <div className="company-profile-wrapper">
      <CompanyOverview />
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
                <th>URL</th>
                <td>{companyDetails.url}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{companyDetails.email}</td>
            </tr>

        </tbody>
    </table>

    <div id='whyChooseUs' className="why-choose-container">
      <h2 className="content-title">Why Choose Meridian Motors?</h2>
      <p className="text-content">
        Meridian Motors combines over <strong>40 years</strong> of customer
        service expertise with a passion for the automotive industry and modern
        technology.
      </p>
      <p className="text-content">
        With Meridian Motors, you receive reliable, professional service built on
        trust, integrity, and attention to detail.
      </p>
    </div>

      </div>
    </div>
  );
};

export default CompanyProfile;
