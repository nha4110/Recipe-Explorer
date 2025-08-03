const express = require('express');
const pool = require('../db');
const router = express.Router();

// ✅ GET /api/user/:id - Fetch a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, username, note FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /api/user/:id error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ PATCH /api/user/:id/note - Update user note
router.patch('/:id/note', async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET note = $1 WHERE id = $2 RETURNING id, username, note',
      [note, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /api/user/:id/note error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
