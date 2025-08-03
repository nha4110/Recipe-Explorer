const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET all recipes (optionally showing if favorited by user)
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    let result;

    if (userId) {
      result = await pool.query(
        `SELECT 
           r.*, 
           u.username AS creator_name,
           f.id IS NOT NULL AS is_favorite
         FROM recipes r
         LEFT JOIN users u ON r.created_by = u.id
         LEFT JOIN favorites f ON r.id = f.recipe_id AND f.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
      );
    } else {
      result = await pool.query(
        `SELECT 
           r.*, 
           u.username AS creator_name
         FROM recipes r
         LEFT JOIN users u ON r.created_by = u.id
         ORDER BY r.created_at DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET a single recipe by ID (with creator name)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*, u.username AS creator_name
       FROM recipes r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// GET all recipes created by a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         r.*, 
         u.username AS creator_name
       FROM recipes r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.created_by = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user recipes:', err);
    res.status(500).json({ error: 'Failed to fetch user recipes' });
  }
});

// POST new recipe
router.post('/', async (req, res) => {
  const { title, description, ingredients, steps, image, created_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO recipes (title, description, ingredients, steps, image, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, ingredients, steps, image, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting recipe:', err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// DELETE a recipe by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

module.exports = router;
