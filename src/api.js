// Central API utility — the backend base URL lives only here.
const BASE_URL = 'http://localhost:5000'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function isPublicAuthUrl(url) {
  return url.endsWith('/login') || url.endsWith('/register')
}

// Parse the JSON body or throw a meaningful error for non-2xx responses.
async function handleResponse(res, url) {
  if (!res.ok) {
    let message = `HTTP ${res.status}: Request failed`
    try {
      const data = await res.json()
      if (data && data.message) {
        message = data.message
      } else if (data && data.errors) {
        // Mongoose ValidationError responses look like { errors: { field: "msg" } }
        message = Object.values(data.errors).join(', ')
      }
    } catch {
      // Response was not JSON; keep the default message
    }

    const error = new Error(message)

    // Missing/invalid/expired JWT: drop the session and send the user to login.
    // Do not do this for /login itself (wrong password also returns 401).
    if (res.status === 401 && !isPublicAuthUrl(url)) {
      clearAuthSession()
      error.authRedirect = true
      if (typeof unauthorizedHandler === 'function') {
        unauthorizedHandler(message)
      }
    }

    throw error
  }
  return res.json()
}

function buildHeaders(extra = {}) {
  const headers = { ...extra }
  const token = getToken()

  // Protected task routes require Authorization: Bearer <JWT>
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// Wrapper that turns network failures (fetch throws TypeError) into a clear message.
async function request(url, options = {}) {
  try {
    const { headers, ...rest } = options
    const res = await fetch(url, {
      ...rest,
      headers: buildHeaders(headers),
    })
    return handleResponse(res, url)
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        'Could not reach the backend server. Make sure it is running on http://localhost:5000'
      )
    }
    throw err
  }
}

export const registerUser = (data) =>
  request(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const loginUser = (data) =>
  request(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const getCurrentUser = () => request(`${BASE_URL}/me`)

export const getTasks = () => request(`${BASE_URL}/tasks`)

export const createTask = (task) =>
  request(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })

export const updateTask = (id, task) =>
  request(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })

export const deleteTask = (id) =>
  request(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
