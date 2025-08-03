const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const userRoute = require('./routes/user');
const recipesRoute = require('./routes/recipes');
const favoritesRoute = require('./routes/favorites');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Parse JSON bodies for other routes (we'll handle multipart separately)
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api', (req, res) => {
  res.send('API is live at /api');
});

// Info routes
app.get('/api/signup', (req, res) => {
  res.send('Use POST to /api/signup to register');
});

// Mount route handlers
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/user', userRoute);
app.use('/api/recipes', recipesRoute);
app.use('/api/favorites', favoritesRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
