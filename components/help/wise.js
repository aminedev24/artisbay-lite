import React from 'react';

const WisePaymentInstructions = () => {
  return (
    <div className='terms-container'>
      <h3>Payment via Wise</h3>
      <p>Sending Money to Meridian Motors via Wise</p>
      <p>Wise is a convenient option for sending money to Meridian Motors. It offers low fees, fast transfers, and real exchange rates, making it a practical solution for international payments.</p>
      <h3>How to Use Wise:</h3>
      <ol>
        <li>Create an Account: If you’re new to Wise, visit <a target="_blank" rel="noreferrer" href='https://wise.com/invite/ihpc/hamidim?utm_source=ios-pill-hp-copylink&utm_medium=invite&utm_campaign=&utm_content=&referralCode=hamidim' className='cta-link'>Wise’s website </a> and sign up for an account.</li>
        <li>Enter Payment Details: Add Meridian Motors Inc. as the recipient. You’ll need our bank details, including the account number, SWIFT/BIC code, and other relevant information provided in your invoice.</li>
        <li>Enter the Amount: Specify the amount you want to transfer, and Wise will show the exact fees and exchange rate upfront.</li>
        <li>Make the Payment: Fund the transfer using your bank account, debit card, or other available payment methods.</li>
        <li>Confirm and Track: Review all details before confirming. Once sent, you can track the status of your transfer online or through the Wise app.</li>
      </ol>
      <p>Ready to get an invoice? <a className='cta-link' href="/invoice-generator">Click here</a>.</p>
      <p>Need more help from us? <a className='cta-link' href="/contact">Contact us</a>.</p>
    </div>
  );
};

export default WisePaymentInstructions;
