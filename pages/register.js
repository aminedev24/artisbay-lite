// pages/register.js
import RegisterForm from '../components/pages/register';
import Head from 'next/head';

export default function RegisterPage() {
  return (
  <>
    <Head>
      <title>Register | Meridian Motors Inc.</title>
      <meta name="description" content="Create an account with Meridian Motors Inc. to access exclusive features and manage your orders for used cars, auto parts, and more." />
      <meta name="keywords" content="register, create account, Meridian Motors Inc., used cars, auto parts, vehicle shipping" />
    </Head>
     <RegisterForm />
  </>
 

  )
}
