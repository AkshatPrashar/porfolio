import { useCallback, useEffect, useRef, useState } from 'react';
import useBestScore from '../../hooks/useBestScore';
import useGameLoop from '../../hooks/useGameLoop';
import useKeyControls from '../../hooks/useKeyControls';
import { readPalette, setupCanvas } from '../../lib/canvas';
import GameShell from './GameShell';

const GRID = 20;
const CELL = 20;
const SIZE = GRID * CELL;
const BASE_TICK_MS = 130;
const MIN_TICK_MS = 70;
const TICK_STEP_MS = 3;
const MAX_QUEUED_TURNS = 2;

const VECTORS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};
const DPAD = [
  { direction: 'up', area: 'col-start-2', rotate: 'rotate-0' },
  { direction: 'left', area: 'col-start-1 row-start-2', rotate: '-rotate-90' },
  { direction: 'down', area: 'col-start-2 row-start-2', rotate: 'rotate-180' },
  { direction: 'right', area: 'col-start-3 row-start-2', rotate: 'rotate-90' },
];

function spawnApple(snake) {
  const free = [];
  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y });
    }
  }
  return free.length ? free[Math.floor(Math.random() * free.length)] : null;
}

function createRace() {
  const snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  return {
    snake,
    direction: 'right',
    queue: [],
    apple: spawnApple(snake),
    score: 0,
    elapsed: 0,
    crashed: false,
  };
}

function advance(race) {
  if (race.queue.length) race.direction = race.queue.shift();
  const [dx, dy] = VECTORS[race.direction];
  const head = { x: race.snake[0].x + dx, y: race.snake[0].y + dy };
  const eating = head.x === race.apple.x && head.y === race.apple.y;
  const body = eating ? race.snake : race.snake.slice(0, -1);

  const outOfBounds = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
  if (outOfBounds || body.some((part) => part.x === head.x && part.y === head.y)) return false;

  race.snake = [head, ...body];
  if (!eating) return true;

  race.score += 1;
  race.apple = spawnApple(race.snake);
  return Boolean(race.apple);
}

export default function Snake() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const colorRef = useRef(null);
  const [initialRace] = useState(createRace);
  const raceRef = useRef(initialRace);
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [best, recordBest] = useBestScore('snake');

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const color = colorRef.current;
    const { snake, apple } = raceRef.current;

    ctx.fillStyle = color('black');
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = color('line', 0.25);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < GRID; i += 1) {
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, SIZE);
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(SIZE, i * CELL + 0.5);
    }
    ctx.stroke();

    if (apple) {
      ctx.fillStyle = color('green');
      ctx.beginPath();
      ctx.arc(apple.x * CELL + CELL / 2, apple.y * CELL + CELL / 2, CELL / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
    }

    snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? color('red') : color('ink', Math.max(0.3, 0.9 - i * 0.02));
      ctx.fillRect(part.x * CELL + 2, part.y * CELL + 2, CELL - 4, CELL - 4);
    });
  }, []);

  useEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current, SIZE, SIZE);
    colorRef.current = readPalette();
    draw();
  }, [draw]);

  const steer = (direction) => {
    const race = raceRef.current;
    const last = race.queue.at(-1) ?? race.direction;
    if (
      direction !== last &&
      direction !== OPPOSITE[last] &&
      race.queue.length < MAX_QUEUED_TURNS
    ) {
      race.queue.push(direction);
    }
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
    race.elapsed += delta;
    const tick = Math.max(MIN_TICK_MS, BASE_TICK_MS - race.score * TICK_STEP_MS);
    let moved = false;

    while (race.elapsed >= tick) {
      race.elapsed -= tick;
      moved = true;
      if (!advance(race)) {
        race.crashed = true;
        setStatus('over');
        recordBest(race.score);
        break;
      }
    }

    if (moved) {
      setScore(race.score);
      draw();
    }
  }, status === 'playing');

  useKeyControls((event) => {
    const direction = KEY_TO_DIRECTION[event.key] ?? KEY_TO_DIRECTION[event.key.toLowerCase()];
    if (!direction) return false;
    steer(direction);
    return true;
  }, status !== 'over');

  return (
    <GameShell
      title="Snake"
      hint="Arrows, WASD or the D-pad to steer."
      stats={[
        { label: 'Score', value: score },
        { label: 'Best', value: Math.max(best, score), tone: 'text-green' },
      ]}
      status={status}
      score={score}
      game="snake"
      onStart={() => setStatus('playing')}
      onRestart={restart}
      controls={
        <div className="mx-auto mt-5 grid w-36 grid-cols-3 gap-1.5" aria-label="Direction pad">
          {DPAD.map(({ direction, area, rotate }) => (
            <button
              key={direction}
              type="button"
              aria-label={`Steer ${direction}`}
              onClick={() => steer(direction)}
              className={`flex aspect-square items-center justify-center border border-line bg-surface text-ink transition-colors hover:border-red active:bg-red/20 ${area}`}
            >
              <svg aria-hidden="true" viewBox="0 0 12 8" className={`h-2.5 w-3.5 ${rotate}`}>
                <path d="M1 7l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ))}
        </div>
      }
    >
      <canvas
        ref={canvasRef}
        className="block h-auto w-full"
        aria-label="Snake playfield"
        role="img"
      />
    </GameShell>
  );
}
