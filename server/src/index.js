import 'dotenv/config';
import connectDB from './db/index.js';
import app from './app.js';

const REQUIRED_ENV = ['CLIENT_ORIGIN', 'RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[server] Missing required environment variables: ${missing.join(', ')}`);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Start the DB connection (it handles its own caching internally now)
connectDB().catch((err) => {
  console.error('[server] Database connection failed:', err.message);
});

// ONLY listen if we are running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, (err) => {
    if (err) {
      console.error(`[server] Failed to start: ${err.message}`);
      process.exit(1);
    }
    console.log(`[server] Listening on port ${port}`);
  });
}

// Export the Express app for Vercel Serverless Functions
export default app;