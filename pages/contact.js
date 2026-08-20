// pages/contact.js
import Contact from '../components/forms/contact';
import Head from 'next/head';

export default function ContactPage() {
  return (
  <>
    <Head>
      <title>Contact Us | Meridian Motors Inc.</title>
      <meta name="description" content="Get in touch with Meridian Motors Inc. for inquiries about used cars." />
      <meta name="keywords" content="contact, customer service, inquiries, Meridian Motors Inc., used cars" />
      </Head>
    <Contact />
  </>
)

}
