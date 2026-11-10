import 'dotenv/config';
import connectDB from './db/index.js';
import app from './app.js';

const REQUIRED_ENV = ['CLIENT_ORIGIN', 'RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[server] Missing required environment variables: ${missing.join(', ')}`);
  // REMOVED process.exit(1) so Vercel doesn't crash the function
}

// Connect to DB
connectDB().catch((err) => {
  console.error('[server] Database connection failed:', err.message);
});

// ONLY listen locally. Vercel handles routing automatically.
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, (err) => {
    if (err) console.error(`[server] Failed to start: ${err.message}`);
    else console.log(`[server] Listening on port ${port}`);
  });
}

// Export the app for Vercel
export default app;