import 'dotenv/config';
import app from './app.js';
import connectDB from './db/index.js';

const REQUIRED_ENV = ['CLIENT_ORIGIN', 'RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[server] Missing required environment variables: ${missing.join(', ')}`);
}

await connectDB();

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, (err) => {
    if (err) {
      console.error(`[server] Failed to start: ${err.message}`);
      process.exit(1);
    }
    console.log(`[server] Listening on port ${port}`);
  });
}

export default app;
