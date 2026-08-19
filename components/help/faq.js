import React, { useState } from 'react';
import faqData from '../utilities/faqData.json';

const FAQComponent = () => {
  const [language, setLanguage] = useState('en'); // Default language is English
  /*
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  */

  const currentFAQ = faqData[language];

  return (
    <div className="terms-container faq-container">
      {/* Language selector with label 
      <div className="language-selector-container">
        <label htmlFor="language-selector" className="language-label">
          Select Language:
        </label>
        <select
          id="language-selector"
          className="language-selector"
          onChange={handleLanguageChange}
          value={language}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>
      */}
      {/* FAQ list */}
      <div className="faq-list">
        {currentFAQ.questions.map((item, index) => (
          <div className="faq-item" key={index}>
            <h4 className="faq-question">{item.question}</h4>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQComponent;