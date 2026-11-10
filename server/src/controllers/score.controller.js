import mongoose from 'mongoose';
import { GAMES, SCORE_LIMITS, Score } from '../models/score.models.js';
import asyncHandler from '../utils/asyncHandler.js';

const LEADERBOARD_SIZE = 10;
const NAME_PATTERN = /^[A-Za-z0-9 ._-]{3,16}$/;

const isDbReady = () => mongoose.connection.readyState === 1;
const offline = (res) => res.status(503).json({ ok: false, error: 'Leaderboard is offline.' });

export const getTopScores = asyncHandler(async (req, res) => {
  const { game } = req.params;

  if (!GAMES.includes(game)) {
    return res.status(400).json({ ok: false, error: 'Unknown game.' });
  }
  if (!isDbReady()) return offline(res);

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
  if (!isDbReady()) return offline(res);

  await Score.create({ name, game, score });
  const rank = await Score.countDocuments({ game, score: { $gte: score } });

  return res.status(201).json({ ok: true, rank });
});
