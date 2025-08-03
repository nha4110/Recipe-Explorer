const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login({ username, password }) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is missing');
  }

  const url = `${API_BASE}/api/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      let message = `Login failed with status ${response.status}`;
      try {
        const err = await response.json();
        message += `: ${err.error || JSON.stringify(err)}`;
      } catch {
        const text = await response.text();
        message += `: ${text}`;
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}
