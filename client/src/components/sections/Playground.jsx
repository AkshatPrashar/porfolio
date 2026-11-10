import { lazy, Suspense, useState } from 'react';
import ChamferCard from '../ui/ChamferCard';
import DrsButton from '../ui/DrsButton';
import Modal from '../ui/Modal';

const GAMES = [
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    blurb: 'Take on the computer in the classic 3×3 duel. You start as X.',
    controls: ['Click', 'Tab', 'Enter'],
    ranked: false,
    Game: lazy(() => import('../games/TicTacToe')),
  },
  {
    id: 'snake',
    title: 'Snake',
    blurb: 'Collect apples, grow the train, stay off the walls. It speeds up as you score.',
    controls: ['Arrows', 'WASD', 'D-pad'],
    ranked: true,
    Game: lazy(() => import('../games/Snake')),
  },
  {
    id: 'flappy',
    title: 'FlappyCar',
    blurb: 'Thread the car through the pit-wall gaps. One tap to lift, gravity does the rest.',
    controls: ['Space', '↑', 'Tap'],
    ranked: true,
    Game: lazy(() => import('../games/FlappyBird')),
  },
];

function GameCard({ game, index, onPlay }) {
  const { title, blurb, controls, ranked } = game;

  return (
    <ChamferCard as="li" interactive className="h-full" bodyClassName="flex flex-col p-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
        <span className="text-muted">
          G<span className="text-line">/</span>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={ranked ? 'text-green' : 'text-muted'}>{ranked ? 'Ranked' : 'Casual'}</span>
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight text-ink">
        {title}
      </h3>
      <p className="mt-3 text-sm">{blurb}</p>
      <ul aria-label="Controls" className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-6">
        {controls.map((control) => (
          <li
            key={control}
            className="border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/80"
          >
            {control}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <DrsButton onClick={onPlay} aria-haspopup="dialog">
          Play
        </DrsButton>
      </div>
    </ChamferCard>
  );
}

export default function Playground() {
  const [activeId, setActiveId] = useState(null);
  const active = GAMES.find(({ id }) => id === activeId);
  const close = () => setActiveId(null);

  return (
    <>
      <p className="-mt-6 mb-10 font-mono text-xs uppercase tracking-[0.25em] text-muted md:-mt-10">
        Three quick games, all in your browser.
      </p>

      <ul className="grid gap-5 md:grid-cols-3">
        {GAMES.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} onPlay={() => setActiveId(game.id)} />
        ))}
      </ul>

      <Modal open={Boolean(active)} onClose={close} label={active?.title ?? 'Game'}>
        {active && (
          <Suspense
            fallback={
              <p className="py-24 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Warming tyres…
              </p>
            }
          >
            <active.Game />
          </Suspense>
        )}
      </Modal>
    </>
  );
}
