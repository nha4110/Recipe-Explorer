import { sql } from '@vercel/postgres'
import { Resend } from 'resend'

// Configure Postgres and Email
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Only POST allowed' })
  }

  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    // Insert user into Neon
    await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${password})
    `

    // Send confirmation email
    await resend.emails.send({
      from: 'no-reply@recipeexplorer.dev',
      to: email,
      subject: 'Welcome to Recipe Explorer!',
      html: `<strong>Hello ${username},</strong><br/>Thanks for signing up!`,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to sign up' })
  }
}
