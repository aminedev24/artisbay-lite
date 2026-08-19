// pages/login.js
import Login from '../components/pages/login';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Artisbay Lite Inc.</title>
        <meta name="description" content="Login to your Artisbay Lite Inc. account to access your profile, manage orders, and more." />
        <meta name="keywords" content="login, user account, Artisbay Lite Inc., used cars, auto parts, vehicle shipping" />
      </Head>
      <Login />

    </>
  )
}
