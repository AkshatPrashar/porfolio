import { GAMES, NAME_COLLATION, SCORE_LIMITS, Score } from '../models/score.models.js';
import connectDB from '../db/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const LEADERBOARD_SIZE = 10;
const NAME_PATTERN = /^[A-Za-z0-9 ._-]{3,16}$/;

const offline = (res) => res.status(503).json({ ok: false, error: 'Leaderboard is offline.' });
const nameTaken = (res) =>
  res.status(409).json({ ok: false, error: 'Name already taken', field: 'name' });
const DUPLICATE_KEY = 11000;

export const getTopScores = asyncHandler(async (req, res) => {
  const { game } = req.params;

  if (!GAMES.includes(game)) {
    return res.status(400).json({ ok: false, error: 'Unknown game.' });
  }
  if (!(await connectDB())) return offline(res);

  const scores = await Score.find({ game })
    .sort({ score: -1, createdAt: 1 })
    .limit(LEADERBOARD_SIZE)
    .select({ _id: 0, name: 1, score: 1, createdAt: 1 })
    .lean();

  return res.status(200).json({ ok: true, scores });
});

export const submitScore = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const { game, score } = body;

  const errors = {};
  if (!NAME_PATTERN.test(name)) {
    errors.name = 'Initials must be 3–16 letters, numbers, spaces, or . _ -';
  }
  if (!GAMES.includes(game)) {
    errors.game = 'Unknown game.';
  } else if (!Number.isInteger(score) || score < 1 || score > SCORE_LIMITS[game]) {
    errors.score = 'Invalid score.';
  }
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }
  if (!(await connectDB())) return offline(res);

  const taken = await Score.exists({ name, game }).collation(NAME_COLLATION);
  if (taken) return nameTaken(res);

  const created = await Score.create({ name, game, score }).catch((err) => {
    if (err.code === DUPLICATE_KEY) return null;
    throw err;
  });
  if (!created) return nameTaken(res);

  const rank = await Score.countDocuments({ game, score: { $gte: score } });

  return res.status(201).json({ ok: true, rank });
});
