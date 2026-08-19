import React, { useState } from 'react';
import Link from 'next/link';

let DOMPurify;
if (typeof window !== 'undefined') {
  DOMPurify = require('dompurify');
}

const Faqs = ({ faqs }) => {
  const [showFaq, setShowFaq] = useState(false);

  const renderAnswer = (answer, containsHtml) => {
    if (containsHtml) {
      const clean = DOMPurify ? DOMPurify.sanitize(answer) : answer;
      return <p dangerouslySetInnerHTML={{ __html: clean }} />;
    }
    return <p>{answer}</p>;
  };

  return (
    <div id="faq-list" className="faq-list">
      <button
        className="btn show-faq-btn"
        type="button"
        onClick={() => setShowFaq(!showFaq)}
      >
        {showFaq ? "Hide FAQ" : "Show FAQ"}
      </button>
      <h1>Frequently Asked Questions (FAQ)</h1>
      {showFaq && faqs.map((faq, index) => (
        <div key={index}>
          <h4>{faq.question}</h4>
          {renderAnswer(faq.answer, faq.containsHtml)}
        </div>
      ))}
    </div>
  );
};

export default Faqs;
