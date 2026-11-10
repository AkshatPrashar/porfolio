import { Schema, model } from 'mongoose';

export const SCORE_LIMITS = { snake: 400, flappy: 10000 };
export const GAMES = Object.keys(SCORE_LIMITS);
export const NAME_COLLATION = { locale: 'en', strength: 2 };

const scoreSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 16 },
    game: { type: String, required: true, enum: GAMES },
    score: {
      type: Number,
      required: true,
      min: 1,
      validate: { validator: Number.isInteger, message: 'Score must be an integer.' },
    },
  },
  { timestamps: true, versionKey: false },
);

scoreSchema.index({ game: 1, score: -1, createdAt: 1 });
scoreSchema.index({ name: 1, game: 1 }, { unique: true, collation: NAME_COLLATION });

export const Score = model('Score', scoreSchema);

Score.on('index', (err) => {
  if (err) console.error(`[db] Score index build failed: ${err.message}`);
});
