// pages/login.js
import Login from '../components/pages/login';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Meridian Motors Inc.</title>
        <meta name="description" content="Login to your Meridian Motors Inc. account to access your profile, manage orders, and more." />
        <meta name="keywords" content="login, user account, Meridian Motors Inc., used cars, auto parts, vehicle shipping" />
      </Head>
      <Login />

    </>
  )
}
