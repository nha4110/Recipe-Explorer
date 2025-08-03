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

// ✅ Health check
app.get('/api', (req, res) => {
  res.send('API is live at /api');
});

// ✅ Info routes
app.get('/api/signup', (req, res) => {
  res.send('Use POST to /api/signup to register');
});

// ✅ Mounting all route handlers
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/user', userRoute);        // includes PATCH /:id/note
app.use('/api/recipes', recipesRoute);
app.use('/api/favorites', favoritesRoute);

// ✅ Root
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
