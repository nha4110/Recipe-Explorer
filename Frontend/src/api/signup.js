const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function signup({ username, password }) {
  if (!API_BASE) {
    throw new Error('API base URL (VITE_API_BASE_URL) is not defined. Check your .env file or Vercel env variables.');
  }

  const url = `${API_BASE}/api/signup`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    // If 404, maybe route doesn't exist
    if (response.status === 404) {
      throw new Error(`404 Not Found: ${url} — Check if the backend is correctly deployed and /api/signup exists`);
    }

    // If not OK (non-2xx), try to parse error body
    if (!response.ok) {
      let errMsg = `Signup failed with status ${response.status}`;
      try {
        const err = await response.json();
        errMsg += `: ${err.error || JSON.stringify(err)}`;
      } catch (jsonErr) {
        const text = await response.text();
        errMsg += `: ${text}`;
      }
      throw new Error(errMsg);
    }

    // Try parsing JSON success response
    try {
      return await response.json();
    } catch (jsonErr) {
      throw new Error('Received invalid JSON from the server. Check if your backend returns JSON.');
    }

  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}
