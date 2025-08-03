import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    // Check if username exists
    const existing = await sql`SELECT * FROM users WHERE username = ${username}`
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await sql`
      INSERT INTO users (username, password, confirmed)
      VALUES (${username}, ${hashedPassword}, true)
    `

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[Signup error]', err)
    return res.status(500).json({ error: 'Signup failed' })
  }
}
