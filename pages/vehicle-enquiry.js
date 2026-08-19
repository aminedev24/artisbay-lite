// pages/vehicle-inquiry.js
import InquiryForm from '../components/vehicles/vehiculeEnquiry';
import Head from 'next/head';

export default function VehicleInquiryPage() {
  return (
  <>
    <Head>
      <title>Vehicle Inquiry | Artisbay Lite Inc.</title>
      <meta name="description" content="Inquire about our used vehicles at Artisbay Lite Inc." />
      <meta name="keywords" content="vehicle inquiry, used cars, Artisbay Lite Inc." />
    </Head>
    <InquiryForm />
  </>
  )
}
