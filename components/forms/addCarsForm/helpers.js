export const sanitizeCurrencyInput = (value = '') => value.replace(/[^\d.,-]/g, '');

export const numeric = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  return cleaned === '' ? 0 : parseFloat(cleaned) || 0;
};

const COST_KEYS = ['buyingPrice', 'auctionFee', 'transportation', 'yardFee', 'photosFee', 'othersFee'];
const COST_KEYS_WITH_SERVICE = [...COST_KEYS, 'serviceFee'];

const sumCosts = (costs, keys) => keys.reduce((acc, key) => acc + numeric(costs[key]), 0);

export const buildApiUrl = () =>
  process.env.NODE_ENV === 'development'
    ? (typeof window !== 'undefined' && window.location.port && window.location.port !== '80'
        ? 'http://localhost:8080/server'
        : 'http://localhost/artisbay-next/server')
    : '/server';

export const calculateTaxDisplay = (costs) => sumCosts(costs, COST_KEYS) * 0.1;

export const calculatePayloadTax = (costs) => sumCosts(costs, COST_KEYS_WITH_SERVICE) * 0.1;

export const calculateFob = (costs) => {
  const beforeTax = sumCosts(costs, COST_KEYS_WITH_SERVICE);
  return beforeTax + beforeTax * 0.1;
};
