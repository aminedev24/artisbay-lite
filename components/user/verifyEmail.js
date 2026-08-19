import { useEffect, useState } from "react";
import { apiBaseUrl } from '../utilities/apiBase';

const ALLOWED_REDIRECTS = ['/dashboard', '/profile', '/home', '/'];

const VerifyEmail = () => {
  const [status, setStatus] = useState({ loading: true, message: "" });

  const apiUrl = apiBaseUrl;

    useEffect(() => {
        const params = new URLSearchParams(
          window.location.search || window.location.hash.split("?")[1]
        );
        const token = params.get("token");

        if (!token) {
          setStatus({ loading: false, message: "Invalid verification link." });
          return;
        }

        const requestUrl = `${apiUrl}/auth/verify-email.php?token=${encodeURIComponent(token)}`;

        fetch(requestUrl)
          .then((res) => res.json())
          .then((data) => {
            setStatus({ loading: false, message: data.message });

            if (data.success && data.redirect) {
              // Only allow relative redirects to known safe paths
              const redirect = data.redirect;
              const isAllowed = ALLOWED_REDIRECTS.includes(redirect) ||
                (redirect.startsWith('/') && !redirect.startsWith('//'));
              if (isAllowed) {
                window.location.href = redirect;
              } else {
                window.location.href = '/';
              }
            }
          })
          .catch(() => {
            setStatus({ loading: false, message: "An error occurred. Please try again." });
          });
      }, []);


  return (
    <div className="verify-email-container">
      <h2 className="verify-email-title">Email Verification</h2>
      {status.loading ? (
        <p className="verify-email-message">Verifying...</p>
      ) : (
        <p className={`verify-email-message ${status.message?.includes("success") ? "verify-email-success" : "verify-email-error"}`}>
          {status.message || 'Verification failed.'}
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
