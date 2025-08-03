const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function signup({ username, password }) {
  const response = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Signup failed')
  }

  return await response.json()
}
