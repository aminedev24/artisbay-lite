import React from 'react';

const ArtisbayOverview = () => {
  return (
    <div className='overview'>
       
      {<h2 className='header'>Overview</h2>}
      {/*<img src={`${process.env.PUBLIC_URL}/images/companyProfile2.jpg`} alt={'company-profile'} className="topic-image" />*/}

      <p>
        Artisbay Lite Inc. was founded in December 2024 in Tokyo by a group of passionate online automotive enthusiasts. The company is a unique blend of experienced, older-generation individuals and young, modern tech fans. This fusion brings together the wisdom and knowledge of the older generation with the innovation and courage of the youth, creating a dynamic balance that drives the company forward.
      </p>
      <p>
        Though new to the online automotive space, Artisbay Lite’s founders have over 40 years of experience in customer service from different sectors. This deep-rooted expertise in serving customers is now being channeled into the automotive market, ensuring that clients receive high-quality service backed by decades of trust and reliability.
      </p>
    </div>
  );
};

export default ArtisbayOverview;
