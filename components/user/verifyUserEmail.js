import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiBaseUrl } from '../utilities/apiBase';

const UserEmailVerification = () => {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const apiUrl = apiBaseUrl;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      fetch(`${apiUrl}/users/getUserEmailVerification.php?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
           setStatus(data.status);
           setMessage(data.message);
           setTimeout(() => {
            router.push('/profile');
          }, 3000);
        })
        .catch(() => {
           setStatus("error");
           setMessage("Verification failed due to an unexpected error.");
        });
    } else {
      setStatus("error");
      setMessage("No token provided.");
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Email Verification</h1>
      {status ? (
        <div>
          <p>Status: <strong>{status}</strong></p>
          <p>{message}</p>
        </div>
      ) : (
        <p>Verifying your email...</p>
      )}
    </div>
  );
};

export default UserEmailVerification;
