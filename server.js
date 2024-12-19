// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bazarRoutes = require('./routes/bazarRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
// const https = require('https');
// const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bazars', bazarRoutes);
app.use('/api/applications', applicationRoutes);  // Pastikan ini ada

const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });