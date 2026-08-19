/**
 * CSRF token store — populated from the check_session.php response.
 * Use csrfFetch() instead of fetch() for all state-changing requests.
 */

let _csrfToken = '';

export function setCsrfToken(token) {
  _csrfToken = token || '';
}

export function getCsrfToken() {
  return _csrfToken;
}

/**
 * Drop-in replacement for fetch() that automatically includes the CSRF token
 * header on every request. Always passes credentials: 'include'.
 */
export function csrfFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'X-CSRF-Token': _csrfToken,
    },
  });
}
