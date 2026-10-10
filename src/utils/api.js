// src/utils/api.js
// Centralised API helpers — all requests go through `request()`.

// Default to same-origin requests ("/api/..."). In development Vite proxies
// these to the PHP server; when deployed, the backend lives on the same
// domain, so this keeps working with no cross-origin (CORS) issues.
// Set VITE_API_URL only if the API is hosted on a different origin.
const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * Low-level fetch wrapper.
 * - Always sends credentials (cookies) for session auth.
 * - Serialises JSON bodies.
 * - Parses JSON responses.
 * - Throws an Error with a human-readable message on failure.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  const config = {
    credentials: 'include',
    ...options,
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  const res = await fetch(url, config)

  // Try to parse JSON — some endpoints may return empty bodies
  let data = null
  try {
    data = await res.json()
  } catch {
    // non-JSON response — leave data as null
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

// ---- Auth ----

/** POST /api/login.php — expects { email, password } */
export function login(email, password) {
  return request('/api/login.php', {
    method: 'POST',
    body: { email, password },
  })
}

/** POST /api/logout.php */
export function logout() {
  return request('/api/logout.php', { method: 'POST' })
}

// ---- Messages ----

/** GET /api/messages.php — returns array of messages (newest first) */
export function getMessages() {
  return request('/api/messages.php')
}

/** POST /api/delete.php — expects { id } */
export function deleteMessage(id) {
  return request('/api/delete.php', {
    method: 'POST',
    body: { id },
  })
}

// ---- Contact ----

/** POST /api/contact.php — expects { name, email, message, company } */
export function submitContact(formData) {
  return request('/api/contact.php', {
    method: 'POST',
    body: formData,
  })
}