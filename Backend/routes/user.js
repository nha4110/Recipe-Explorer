const express = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();

// PATCH /api/user/:id/password - update password
router.patch('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  try {
    // Get user hashed password from DB
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = userResult.rows[0].password;

    // Compare currentPassword with stored hash
    const passwordMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in DB
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [newHashedPassword, id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('PATCH /api/user/:id/password error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
