// D:/Git-project/Recipe-Explorer/Backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const userRoute = require('./routes/user');
const recipesRoute = require('./routes/recipes');
const favoritesRoute = require('./routes/favorites');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ✅ Basic API check
app.get('/api', (req, res) => {
  res.send('API is live at /api');
});

// ✅ Signup info page
app.get('/api/signup', (req, res) => {
  res.send('Use POST to /api/signup to register');
});

// ✅ Routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/user', userRoute);
app.use('/api/recipes', recipesRoute);
app.use('/api/favorites', favoritesRoute);

// ✅ PATCH user note (same style as /api/signup)
const pool = require('./db');
app.patch('/api/users/:id/note', async (req, res) => {
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
    console.error('PATCH /api/users/:id/note error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
