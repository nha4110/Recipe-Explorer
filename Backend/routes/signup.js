import express from 'express'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username, created_at`,
      [username, hashedPassword]
    )

    res.status(200).json({ message: 'Signup successful', user: result.rows[0] })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
})

export default router
