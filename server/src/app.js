import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import contactRoutes from './routes/contact.routes.js';

const allowedOrigins = process.env.CLIENT_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const BODY_ERRORS = {
  'entity.parse.failed': 'Request body must be valid JSON.',
  'entity.too.large': 'Request body is too large.',
};

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: allowedOrigins, methods: ['POST'] }));
app.use(express.json({ limit: '10kb' }));

app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found.' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.statusCode ?? err.status ?? 500;
  if (status >= 500) console.error('[app]', err);

  const error =
    BODY_ERRORS[err.type] ?? (err.expose ? err.message : 'Something went wrong. Please try again.');

  res.status(status).json({ ok: false, error });
});

export default app;
