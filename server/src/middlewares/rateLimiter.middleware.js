import { rateLimit } from 'express-rate-limit';

const createLimiter = (windowMinutes, limit, error) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { ok: false, error },
  });

export const contactLimiter = createLimiter(
  15,
  5,
  'Too many messages. Please try again in 15 minutes.',
);

export const scoreLimiter = createLimiter(
  10,
  10,
  'Too many score submissions. Please try again in 10 minutes.',
);
