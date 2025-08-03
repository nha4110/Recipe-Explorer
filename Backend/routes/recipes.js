const express = require('express');
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for PNG uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG files are allowed!'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit

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

// POST new recipe (with optional PNG upload)
router.post('/', upload.single('image'), async (req, res) => {
  // multer attaches file info on req.file, other form fields on req.body
  const { title, description, ingredients, steps, created_by } = req.body;
  let image = '';

  try {
    if (req.file) {
      // Save path to uploaded PNG file
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // For default or online image URL sent as string
      image = req.body.image;
    } else {
      // fallback image path
      image = '/assets/default.png';
    }

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
