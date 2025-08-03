const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const signupRoute = require('./routes/signup');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ✅ Route check - handles GET request to /api
app.get('/api', (req, res) => {
  res.send('API is live at /api');
});

// ✅ Allow GET on /api/signup (for browser test only)
app.get('/api/signup', (req, res) => {
  res.send('Use POST to /api/signup to register');
});

// ✅ Actual POST handler
app.use('/api/signup', signupRoute);

// Base route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
