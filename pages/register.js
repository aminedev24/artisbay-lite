// pages/register.js
import RegisterForm from '../components/pages/register';
import Head from 'next/head';

export default function RegisterPage() {
  return (
  <>
    <Head>
      <title>Register | Artisbay Lite Inc.</title>
      <meta name="description" content="Create an account with Artisbay Lite Inc. to access exclusive features and manage your orders for used cars, auto parts, and more." />
      <meta name="keywords" content="register, create account, Artisbay Lite Inc., used cars, auto parts, vehicle shipping" />
    </Head>
     <RegisterForm />
  </>
 

  )
}
