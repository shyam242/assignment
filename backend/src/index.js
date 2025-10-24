const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const reportsRoute = require('./routes/reports');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/reports', reportsRoute);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port',process.env.PORT||5000);
});
