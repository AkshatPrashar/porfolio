import { useCallback, useEffect, useRef, useState } from 'react';
import useBestScore from '../../hooks/useBestScore';
import useGameLoop from '../../hooks/useGameLoop';
import useKeyControls from '../../hooks/useKeyControls';
import { readPalette, setupCanvas } from '../../lib/canvas';
import GameShell from './GameShell';

const WIDTH = 400;
const HEIGHT = 520;
const GRAVITY = 1600;
const FLAP_VELOCITY = -460;
const MAX_FALL = 720;
const PIPE_WIDTH = 56;
const GAP = 150;
const SPACING = 210;
const BASE_SPEED = 150;
const SPEED_PER_POINT = 2;
const MAX_EXTRA_SPEED = 90;
const GAP_MARGIN = 60;
const CAR = { x: 90, width: 38, height: 16 };
const KERB = 8;
const FLAP_KEYS = new Set([' ', 'ArrowUp', 'w', 'W']);

const createPipe = (x) => ({
  x,
  gapY: GAP_MARGIN + Math.random() * (HEIGHT - GAP - GAP_MARGIN * 2),
  passed: false,
});

function createRace() {
  return {
    y: HEIGHT / 2,
    velocity: 0,
    pipes: [createPipe(WIDTH + 80), createPipe(WIDTH + 80 + SPACING)],
    score: 0,
    offset: 0,
    crashed: false,
  };
}

function advance(race, seconds) {
  race.velocity = Math.min(race.velocity + GRAVITY * seconds, MAX_FALL);
  race.y += race.velocity * seconds;
  if (race.y < CAR.height / 2) {
    race.y = CAR.height / 2;
    race.velocity = 0;
  }

  const speed = BASE_SPEED + Math.min(race.score * SPEED_PER_POINT, MAX_EXTRA_SPEED);
  race.offset = (race.offset + speed * seconds) % 40;
  race.pipes.forEach((pipe) => {
    pipe.x -= speed * seconds;
  });
  if (race.pipes[0].x + PIPE_WIDTH < 0) {
    race.pipes.shift();
    race.pipes.push(createPipe(race.pipes.at(-1).x + SPACING));
  }

  const top = race.y - CAR.height / 2;
  const bottom = race.y + CAR.height / 2;
  if (bottom >= HEIGHT) return false;

  for (const pipe of race.pipes) {
    if (!pipe.passed && pipe.x + PIPE_WIDTH < CAR.x) {
      pipe.passed = true;
      race.score += 1;
    }
    const overlapsX = CAR.x + CAR.width > pipe.x && CAR.x < pipe.x + PIPE_WIDTH;
    if (overlapsX && (top < pipe.gapY || bottom > pipe.gapY + GAP)) return false;
  }
  return true;
}

export default function FlappyBird() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const colorRef = useRef(null);
  const [initialRace] = useState(createRace);
  const raceRef = useRef(initialRace);
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [best, recordBest] = useBestScore('flappy');

  const drawKerb = (ctx, color, x, y) => {
    for (let i = 0; i * KERB < PIPE_WIDTH; i += 1) {
      ctx.fillStyle = i % 2 ? color('ink', 0.85) : color('red');
      ctx.fillRect(x + i * KERB, y, Math.min(KERB, PIPE_WIDTH - i * KERB), KERB);
    }
  };

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const color = colorRef.current;
    const race = raceRef.current;

    ctx.fillStyle = color('black');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = color('line', 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -race.offset; x < WIDTH; x += 40) {
      ctx.moveTo(x + 0.5, HEIGHT - 24);
      ctx.lineTo(x + 20.5, HEIGHT - 24);
    }
    ctx.stroke();

    race.pipes.forEach(({ x, gapY }) => {
      ctx.fillStyle = color('surface');
      ctx.strokeStyle = color('line');
      ctx.fillRect(x, 0, PIPE_WIDTH, gapY);
      ctx.strokeRect(x + 0.5, -1, PIPE_WIDTH - 1, gapY + 1);
      ctx.fillRect(x, gapY + GAP, PIPE_WIDTH, HEIGHT - gapY - GAP);
      ctx.strokeRect(x + 0.5, gapY + GAP + 0.5, PIPE_WIDTH - 1, HEIGHT - gapY - GAP);
      drawKerb(ctx, color, x, gapY - KERB);
      drawKerb(ctx, color, x, gapY + GAP);
    });

    const tilt = Math.max(-0.4, Math.min(0.6, race.velocity / 900));
    ctx.save();
    ctx.translate(CAR.x + CAR.width / 2, race.y);
    ctx.rotate(tilt);
    ctx.fillStyle = color('red');
    ctx.beginPath();
    ctx.moveTo(-CAR.width / 2, -4);
    ctx.lineTo(CAR.width / 2, 2);
    ctx.lineTo(CAR.width / 2, 5);
    ctx.lineTo(-CAR.width / 2, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = color('ink');
    ctx.fillRect(-CAR.width / 2 - 2, -CAR.height / 2 - 2, 5, 9);
    ctx.fillStyle = color('surface');
    ctx.strokeStyle = color('muted');
    [-CAR.width / 2 + 7, CAR.width / 2 - 7].forEach((wheelX) => {
      ctx.beginPath();
      ctx.arc(wheelX, 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();
  }, []);

  useEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current, WIDTH, HEIGHT);
    colorRef.current = readPalette();
    draw();
  }, [draw]);

  const flap = () => {
    if (status === 'over') return;
    raceRef.current.velocity = FLAP_VELOCITY;
    if (status === 'idle') setStatus('playing');
  };

  const restart = () => {
    raceRef.current = createRace();
    setScore(0);
    setStatus('idle');
    draw();
  };

  useGameLoop((delta) => {
    const race = raceRef.current;
    if (race.crashed) return;
    if (!advance(race, delta / 1000)) {
      race.crashed = true;
      setStatus('over');
      recordBest(race.score);
    }
    if (race.score !== score) setScore(race.score);
    draw();
  }, status === 'playing');

  useKeyControls((event) => {
    if (!FLAP_KEYS.has(event.key)) return false;
    if (!event.repeat) flap();
    return true;
  }, status !== 'over');

  return (
    <GameShell
      title="FlappyCar"
      hint="Space, ↑ or tap to lift. Thread the pit-wall gaps."
      stats={[
        { label: 'Score', value: score },
        { label: 'Best', value: Math.max(best, score), tone: 'text-green' },
      ]}
      status={status}
      score={score}
      game="flappy"
      onStart={flap}
      onRestart={restart}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="FlappyCar playfield"
        onPointerDown={(event) => {
          event.preventDefault();
          flap();
        }}
        className="block h-auto w-full touch-none select-none"
      />
    </GameShell>
  );
}
