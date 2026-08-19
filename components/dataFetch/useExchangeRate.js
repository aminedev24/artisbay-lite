// hooks/useExchangeRate.js
import { useState, useEffect } from 'react';
import { apiBaseUrl } from '../utilities/apiBase';

const useExchangeRate = () => {
  const [usdToYenRate, setUsdToYenRate] = useState(155.00); // Default value (matches pricing rate)

  const apiUrl = apiBaseUrl;
  const isLocalDev =
    process.env.NODE_ENV === "development" && apiUrl.includes("localhost/artisbay-next/server");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(new DOMException('Rate fetch timeout', 'AbortError')), 1200);
        const response = await fetch(`${apiUrl}/finance/rates.php`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        if (data.usdToYen) {
          setUsdToYenRate(parseFloat(data.usdToYen));
        } else {
          if (!isLocalDev) {
            console.error("Error fetching rate:", data.error);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !isLocalDev) {
          console.error("Error fetching rate:", error);
        }
      }
    };

    fetchRate();
  }, [apiUrl]);

  return { usdToYenRate, setUsdToYenRate };
};

export default useExchangeRate;