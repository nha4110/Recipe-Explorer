import { sql } from '@vercel/postgres';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Only POST allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Check if email already exists
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = randomBytes(32).toString('hex');

    // Store user with confirmation token
    await sql`
      INSERT INTO users (username, email, password, confirmed, token)
      VALUES (${username}, ${email}, ${hashedPassword}, false, ${token})
    `;

    const confirmUrl = `https://${req.headers.host}/api/confirm?token=${token}`;

    // Send email
    await resend.emails.send({
      from: 'no-reply@recipeexplorer.dev',
      to: email,
      subject: 'Confirm your Recipe Explorer account',
      html: `
        <h2>Hello ${username}!</h2>
        <p>Thanks for signing up. Please confirm your account by clicking below:</p>
        <a href="${confirmUrl}">Confirm Account</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Signup failed' });
  }
}
