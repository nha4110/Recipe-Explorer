const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});



// POST /api/recipes
router.post('/', async (req, res) => {
  const { title, description, ingredients, steps, created_by } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO recipes (title, description, ingredients, steps, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, ingredients, steps, created_by]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create recipe' })
  }
})

module.exports = router
