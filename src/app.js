const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
    max: 100,
      standardHeaders: true,
      });
      app.use(globalLimiter);

      app.use('/auth', authRoutes);

      app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        app.use(errorHandler);

        module.exports = app;
