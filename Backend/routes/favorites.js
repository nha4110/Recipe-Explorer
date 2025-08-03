const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/favorites/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const result = await pool.query(
      `SELECT recipes.* FROM favorites
       JOIN recipes ON favorites.recipe_id = recipes.id
       WHERE favorites.user_id = $1`,
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch favorites' })
  }
})

module.exports = router
