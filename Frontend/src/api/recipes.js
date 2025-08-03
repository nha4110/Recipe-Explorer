const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchAllRecipes() {
  const url = `${API_BASE}/api/recipes`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching recipes:', err);
    throw err;
  }
}
