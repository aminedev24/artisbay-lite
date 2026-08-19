const isNativeMobile = typeof window !== 'undefined' && 
                       window.location.origin.includes('capacitor://');

const devBase = process.env.NEXT_PUBLIC_DEV_API || 'http://localhost/artisbay-inc/server';

const apiBase = isNativeMobile
  ? 'https://artisbay.com/server'
  : (process.env.NODE_ENV === 'development' ? devBase : '/server');

export const apiAuth = `${apiBase}/auth`;
export const apiUsers = `${apiBase}/users`;
export const apiInventory = `${apiBase}/inventory`;
export const apiFinance = `${apiBase}/finance`;
export const api = `${apiBase}/api`;
export const apiBaseUrl = apiBase;