const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect database
connectDB();

// init middleware -- allow us to get the  data from req.body
app.use(express.json({ extended: false }));

// to test
app.get('/', (req, res) => res.send('API running'));

// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// when we deploy the app they will lock for envierment variable to deploay on this post
// if there is on envierment variable set then ot will work locally on port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
