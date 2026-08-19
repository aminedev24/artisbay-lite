import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiBaseUrl } from '../utilities/apiBase';

const AdminVerifyEmail = () => {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const apiUrl = apiBaseUrl;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('Invalid verification link.');
      return;
    }

    fetch(`${apiUrl}/auth/adminVerifyEmail.php?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setMessage('Your email has been verified!');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      })
      .catch(() => {
        setMessage('An error occurred during verification. Please try again later.');
      });
  }, []);

  return (
    <div className='verification-wrapper' style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default AdminVerifyEmail;
