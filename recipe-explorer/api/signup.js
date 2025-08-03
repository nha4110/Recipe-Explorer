import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  console.log('Received signup:', {
    username,
    passwordLength: password ? password.length : 0,
  })

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' })
  }

  try {
    // Check if username already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username, created_at`,
      [username, hashedPassword]
    )

    console.log('User inserted:', result.rows[0])
    res.status(200).json({ message: 'Signup successful', user: result.rows[0] })
  } catch (err) {
    console.error('Signup error stack:', err.stack)
    res.status(500).json({
      error: 'Internal server error',
      detail: err.message,
    })
  }
}
