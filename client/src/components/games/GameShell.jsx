import { useState } from 'react';
import useLeaderboard from '../../hooks/useLeaderboard';
import DrsButton from '../ui/DrsButton';

const INITIALS_PATTERN = /^[A-Za-z0-9 ._-]{3,16}$/;

function TimingScreen({ status, scores }) {
  return (
    <aside aria-label="Top 10 leaderboard" className="border border-line/70 bg-black/40 p-4">
      <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        <span>Timing screen</span>
        <span className="text-red">Top 10</span>
      </p>
      {status === 'loading' && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Loading…</p>
      )}
      {status === 'offline' && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Timing offline
        </p>
      )}
      {status === 'ready' && scores.length === 0 && (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          No times set. Be P1.
        </p>
      )}
      {status === 'ready' && scores.length > 0 && (
        <ol className="mt-3 divide-y divide-line/50 font-mono text-xs uppercase tracking-[0.15em]">
          {scores.map(({ name, score, createdAt }, i) => (
            <li key={`${name}-${createdAt}`} className="flex items-center gap-3 py-2">
              <span className={i === 0 ? 'w-7 text-purple' : 'w-7 text-muted'}>P{i + 1}</span>
              <span className="flex-1 truncate text-ink">{name}</span>
              <span className="tabular-nums text-green">{score}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function ScoreSubmit({ score, onSubmit }) {
  const [name, setName] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  if (score < 1) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Score at least 1 to set a time.
      </p>
    );
  }

  if (state.status === 'done') {
    return (
      <p role="status" className="font-mono text-xs uppercase tracking-[0.2em] text-green">
        {state.message}
      </p>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const initials = name.trim();
    if (!INITIALS_PATTERN.test(initials)) {
      setState({ status: 'error', message: 'Use 3–16 letters, numbers, spaces, or . _ -' });
      return;
    }
    setState({ status: 'submitting', message: '' });
    try {
      const rank = await onSubmit(initials, score);
      setState({ status: 'done', message: `Classified P${rank}` });
    } catch (err) {
      setState({ status: 'error', message: err.errors?.name ?? err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xs">
      <label
        htmlFor="score-initials"
        className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted"
      >
        Enter initials
      </label>
      <div className="mt-2 flex">
        <input
          id="score-initials"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={16}
          autoComplete="off"
          aria-invalid={state.status === 'error'}
          aria-describedby={state.status === 'error' ? 'score-initials-error' : undefined}
          className="min-w-0 flex-1 border border-line bg-black px-3 py-2 font-mono text-sm uppercase tracking-[0.2em] text-ink"
        />
        <button
          type="submit"
          disabled={state.status === 'submitting'}
          className="border border-l-0 border-red bg-red/15 px-4 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-red/30 disabled:opacity-60"
        >
          {state.status === 'submitting' ? '…' : 'Submit'}
        </button>
      </div>
      {state.status === 'error' && (
        <p
          id="score-initials-error"
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-red"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

export default function GameShell({
  title,
  hint,
  stats,
  status,
  score = 0,
  game,
  overlay = true,
  onStart,
  onRestart,
  controls,
  children,
}) {
  const leaderboard = useLeaderboard(game);

  return (
    <div className={game ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]' : ''}>
      <div className="min-w-0">
        <header className="flex flex-wrap items-end justify-between gap-4 pr-10">
          <h2 className="font-display text-2xl font-bold uppercase leading-none text-ink sm:text-3xl">
            {title}
          </h2>
          <dl
            aria-live="polite"
            className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.2em]"
          >
            {stats.map(({ label, value, tone = 'text-ink' }) => (
              <div key={label} className="flex gap-2">
                <dt className="text-muted">{label}</dt>
                <dd className={`tabular-nums ${tone}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="relative mx-auto mt-5 w-full max-w-[400px]">
          <div className="chamfer-card bg-line/70 p-px">
            <div className="chamfer-card relative bg-black">
              {children}

              {overlay && status === 'idle' && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-6 text-center">
                  <p className="font-display text-2xl font-bold uppercase text-ink">Lights out</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {hint}
                  </p>
                  <span className="pointer-events-auto">
                    <DrsButton onClick={onStart}>Start</DrsButton>
                  </span>
                </div>
              )}

              {overlay && status === 'over' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-black/85 p-6 text-center">
                  <p className="font-display text-3xl font-bold uppercase text-red">Race over</p>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                    Score <span className="text-ink">{score}</span>
                  </p>
                  {game && leaderboard.status !== 'offline' && (
                    <ScoreSubmit score={score} onSubmit={leaderboard.submit} />
                  )}
                  <DrsButton onClick={onRestart}>Restart</DrsButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {controls}

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{hint}</p>
          <button
            type="button"
            onClick={onRestart}
            className="border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-red hover:text-ink"
          >
            Reset
          </button>
        </footer>
      </div>

      {game && <TimingScreen status={leaderboard.status} scores={leaderboard.scores} />}
    </div>
  );
}
