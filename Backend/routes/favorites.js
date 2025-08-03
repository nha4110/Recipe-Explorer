// D:\Git-project\Recipe-Explorer\Backend\routes\favorites.js
const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET favorites by user
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

// POST to add a favorite
router.post('/', async (req, res) => {
  console.log('POST /api/favorites body:', req.body) // debug log

  const { user_id, recipe_id } = req.body

  if (!user_id || !recipe_id) {
    return res.status(400).json({ error: 'Missing user_id or recipe_id' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, recipe_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, recipe_id) DO NOTHING
       RETURNING *`,
      [user_id, recipe_id]
    )
    res.json(result.rows[0] || { message: 'Already favorited' })
  } catch (err) {
    console.error('Error inserting favorite:', err)
    res.status(500).json({ error: 'Failed to add favorite' })
  }
})
// DELETE to remove a favorite
router.delete('/', async (req, res) => {
  const { user_id, recipe_id } = req.body

  if (!user_id || !recipe_id) {
    return res.status(400).json({ error: 'Missing user_id or recipe_id' })
  }

  try {
    const result = await pool.query(
      `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2 RETURNING *`,
      [user_id, recipe_id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Favorite not found' })
    }

    res.json({ message: 'Favorite removed' })
  } catch (err) {
    console.error('Error deleting favorite:', err)
    res.status(500).json({ error: 'Failed to remove favorite' })
  }
})


module.exports = router
