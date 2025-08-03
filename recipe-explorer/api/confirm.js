import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Missing token');
  }

  try {
    const userRes = await sql`SELECT * FROM users WHERE token = ${token}`;

    if (userRes.rows.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    // Confirm the user
    await sql`
      UPDATE users SET confirmed = true, token = NULL WHERE token = ${token}
    `;

    res.status(200).send(`
      <h2>✅ Email confirmed!</h2>
      <p>You can now log in to your account.</p>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Confirmation failed');
  }
}
