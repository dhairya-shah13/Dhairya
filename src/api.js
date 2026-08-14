// Central API utility — the backend base URL lives only here (Practical 6).
const BASE_URL = 'http://localhost:5000'

// Parse the JSON body or throw a meaningful error for non-2xx responses.
async function handleResponse(res) {
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
    throw new Error(message)
  }
  return res.json()
}

// Wrapper that turns network failures (fetch throws TypeError) into a clear message.
async function request(url, options) {
  try {
    const res = await fetch(url, options)
    return handleResponse(res)
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        'Could not reach the backend server. Make sure it is running on http://localhost:5000'
      )
    }
    throw err
  }
}

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
