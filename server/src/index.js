require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const eventsRoutes = require('./routes/events.routes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB()
  .then(() => {
    app.use('/api/events', eventsRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error iniciando el servidor:', err);
    process.exit(1);
  });
