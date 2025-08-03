// D:\Git-project\Recipe-Explorer\Backend\routes\recipes.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

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

// GET /api/recipes/user/:userId - Get all recipes created by a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM recipes WHERE created_by = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user recipes:', err);
    res.status(500).json({ error: 'Failed to fetch user recipes' });
  }
});

// POST /api/recipes
router.post('/', async (req, res) => {
  const { title, description, ingredients, steps, image, created_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO recipes (title, description, ingredients, steps, image, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, ingredients, steps, image, created_by]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting recipe:', err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

module.exports = router;
