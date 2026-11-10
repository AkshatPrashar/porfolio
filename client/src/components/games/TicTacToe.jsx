import { useState } from 'react';
import GameShell from './GameShell';

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
const MARK_TONE = { X: 'text-red', O: 'text-green' };

function findWinner(board) {
  const line = LINES.find(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c],
  );
  return line ? { player: board[line[0]], line } : null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(EMPTY_BOARD);

  const winner = findWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const isOver = Boolean(winner) || isDraw;
  const next = board.filter(Boolean).length % 2 === 0 ? 'X' : 'O';

  const play = (index) => {
    if (isOver || board[index]) return;
    setBoard((current) => current.map((cell, i) => (i === index ? next : cell)));
  };

  const stats = isOver
    ? [
        {
          label: 'Result',
          value: winner ? `${winner.player} wins` : 'Draw',
          tone: winner ? MARK_TONE[winner.player] : 'text-ink',
        },
      ]
    : [{ label: 'Turn', value: next, tone: MARK_TONE[next] }];

  return (
    <GameShell
      title="Tic-Tac-Toe"
      hint="Two players. X starts. Click a cell or use Tab + Enter."
      stats={stats}
      status={isOver ? 'over' : 'playing'}
      overlay={false}
      onRestart={() => setBoard(EMPTY_BOARD)}
    >
      <div
        role="group"
        aria-label="Tic-tac-toe board"
        className="grid grid-cols-3 gap-px bg-line/70"
      >
        {board.map((mark, index) => {
          const winning = winner?.line.includes(index);
          const locked = isOver || Boolean(mark);
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
