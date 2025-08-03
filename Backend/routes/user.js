const express = require('express')
const pool = require('../db')
const router = express.Router()

// PATCH /api/users/:id/note
router.patch('/:id/note', async (req, res) => {
  const { id } = req.params
  const { note } = req.body
  try {
    const result = await pool.query(
      'UPDATE users SET note = $1 WHERE id = $2 RETURNING note',
      [note, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update note' })
  }
})

module.exports = router
