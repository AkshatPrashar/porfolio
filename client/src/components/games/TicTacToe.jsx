import { useEffect, useState } from 'react';
import GameShell from './GameShell';

const PLAYER = 'X';
const CPU = 'O';
const CPU_DELAY_MS = 300;
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const EMPTY_BOARD = Array(9).fill(null);
const MARK_TONE = { [PLAYER]: 'text-red', [CPU]: 'text-green' };

function findWinner(board) {
  const line = LINES.find(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c],
  );
  return line ? { player: board[line[0]], line } : null;
}

function minimax(board, turn, depth) {
  const winner = findWinner(board);
  if (winner) return { score: winner.player === CPU ? 10 - depth : depth - 10 };
  if (board.every(Boolean)) return { score: 0 };

  let best = { score: turn === CPU ? -Infinity : Infinity, index: -1 };
  board.forEach((cell, index) => {
    if (cell) return;
    board[index] = turn;
    const { score } = minimax(board, turn === CPU ? PLAYER : CPU, depth + 1);
    board[index] = null;
    if (turn === CPU ? score > best.score : score < best.score) best = { score, index };
  });
  return best;
}

const chooseCpuMove = (board) => minimax([...board], CPU, 0).index;

export default function TicTacToe() {
  const [board, setBoard] = useState(EMPTY_BOARD);

  const winner = findWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const isOver = Boolean(winner) || isDraw;
  const turn = board.filter(Boolean).length % 2 === 0 ? PLAYER : CPU;
  const cpuThinking = !isOver && turn === CPU;

  useEffect(() => {
    if (!cpuThinking) return undefined;
    const timer = setTimeout(() => {
      const move = chooseCpuMove(board);
      setBoard((current) => current.map((cell, i) => (i === move ? CPU : cell)));
    }, CPU_DELAY_MS);
    return () => clearTimeout(timer);
  }, [board, cpuThinking]);

  const play = (index) => {
    if (isOver || cpuThinking || board[index]) return;
    setBoard((current) => current.map((cell, i) => (i === index ? PLAYER : cell)));
  };

  const result = winner ? (winner.player === PLAYER ? 'You win' : 'CPU wins') : 'Draw';
  const stats = isOver
    ? [{ label: 'Result', value: result, tone: winner ? MARK_TONE[winner.player] : 'text-ink' }]
    : [
        {
          label: 'Turn',
          value: cpuThinking ? 'CPU thinking' : 'You (X)',
          tone: MARK_TONE[turn],
        },
      ];

  return (
    <GameShell
      title="Tic-Tac-Toe"
      hint="You are X and move first. Click a cell or use Tab + Enter."
      stats={stats}
      status={isOver ? 'over' : 'playing'}
      overlay={false}
      onRestart={() => setBoard(EMPTY_BOARD)}
    >
      <div
        role="group"
        aria-label="Tic-tac-toe board"
        aria-busy={cpuThinking}
        className="grid grid-cols-3 gap-px bg-line/70"
      >
        {board.map((mark, index) => {
          const winning = winner?.line.includes(index);
          const locked = isOver || cpuThinking || Boolean(mark);
          return (
            <button
              key={index}
              type="button"
              aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${mark ?? 'empty'}`}
              aria-disabled={locked}
              onClick={() => play(index)}
              className={`flex aspect-square items-center justify-center font-display text-5xl font-bold transition-colors sm:text-6xl ${
                winning ? 'bg-red/20 shadow-[inset_0_0_0_2px_rgb(var(--color-red))]' : 'bg-black'
              } ${locked ? 'cursor-default' : 'hover:bg-surface'} ${mark ? MARK_TONE[mark] : ''}`}
            >
              {mark}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
