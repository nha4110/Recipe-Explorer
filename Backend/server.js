const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login'); // ✅ Import login route

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

// ✅ Signup handler
app.use('/api/signup', signupRoute);

// ✅ Login handler
app.use('/api/login', loginRoute); // <-- ADDED THIS LINE

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
