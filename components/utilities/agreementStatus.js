// useAgreementStatus.js
import { useState, useEffect, useRef } from 'react';

const useAgreementStatus = (agreementTypes, apiUrl) => {
  // Normalize to an array
  const types = Array.isArray(agreementTypes) ? agreementTypes : [agreementTypes];
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchStatuses = async () => {
      try {
        const results = await Promise.all(
          types.map(async (type) => {
            const response = await fetch(
              `${apiUrl}/customers/checkAgreement.php?agreementType=${encodeURIComponent(type)}`,
              { method: 'GET', credentials: 'include', signal: controller.signal }
            );
            const data = await response.json();
            return { type, status: data.already_agreed === true };
          })
        );
        if (isMountedRef.current) {
          const statusObj = results.reduce((acc, { type, status }) => {
            acc[type] = status;
            return acc;
          }, {});
          setStatuses(statusObj);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMountedRef.current) {
          setError(err.message);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchStatuses();

    return () => {
      controller.abort(new DOMException('Component unmounted', 'AbortError'));
      isMountedRef.current = false;
    };
  }, [agreementTypes, apiUrl]);

  // If only one type was passed, return a single boolean.
  if (!Array.isArray(agreementTypes)) {
    return { alreadyAgreed: statuses[agreementTypes] || false, loading, error };
  }

  // Otherwise, return the full statuses object.
  return { statuses, loading, error };
};

export default useAgreementStatus;
