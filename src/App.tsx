import { useCallback, useState } from 'react';
import { Bear, Dog, Frog, Lobster, Raccoon, Axolotl, SketchDefs } from './components/Characters';
import { LevelRoom } from './components/LevelRoom';
import { PondMap } from './components/PondMap';
import { LEVELS, POINTS_PER_LEVEL } from './game/levels';
import { useProgress } from './game/progress';

const GUILD_WORKSPACE = 'https://app.guild.ai/hexiao0225~hack-the-pond';

type Screen = { name: 'title' } | { name: 'map' } | { name: 'level'; id: string } | { name: 'finale' };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'title' });
  const { progress, score, revealHint, solve, reset } = useProgress();
  const solvedCount = Object.keys(progress.solved).length;
  const allDone = solvedCount === LEVELS.length;

  const enter = useCallback((id: string) => setScreen({ name: 'level', id }), []);
  const levelIndex = screen.name === 'level' ? LEVELS.findIndex((l) => l.id === screen.id) : -1;
  const level = LEVELS[levelIndex];

  return (
    <div className="app">
      <SketchDefs />

      {screen.name === 'title' && (
        <main className="title">
          <div className="title-cast" aria-hidden="true">
            <Lobster size={130} className="bob" />
            <Dog size={150} className="bob delay" />
            <Frog size={170} className="hop" />
            <Bear size={150} className="bob delay" />
            <Axolotl size={130} className="bob" />
          </div>
          <h1 className="logo">
            Hack <span>the</span> Pond
          </h1>
          <p className="lede">
            The animals of the pond just got AI helpers. The helpers are... not very careful. Hop around, trick each one,
            and learn how real security engineers keep AI safe.
          </p>
          <div className="row center">
            <button className="big" onClick={() => setScreen({ name: 'map' })}>
              {solvedCount ? 'Keep playing' : 'Start playing'} →
            </button>
          </div>
          <p className="small">
            5 levels · about 15 minutes · no sign-up · hints if you get stuck ·{' '}
            <a href="/demo.mp4" target="_blank" rel="noopener noreferrer">
              ▶ watch the trailer
            </a>
          </p>
          <p className="small">
            Want a real AI challenge? Each animal is also a live AI agent on{' '}
            <a href={GUILD_WORKSPACE} target="_blank" rel="noopener noreferrer">
              Guild.ai
            </a>
            .
          </p>
        </main>
      )}

      {screen.name === 'map' && (
        <main className="map-screen">
          <header className="hud">
            <button className="ghost" onClick={() => setScreen({ name: 'title' })}>
              🐸 Hack the Pond
            </button>
            <span className="hud-score">
              ⭐ {score} / {LEVELS.length * POINTS_PER_LEVEL} pts
            </span>
            <span className="hud-count">
              {solvedCount}/{LEVELS.length} hacked
            </span>
            {allDone && (
              <button className="big small-big" onClick={() => setScreen({ name: 'finale' })}>
                🏆 Claim badge
              </button>
            )}
          </header>
          <p className="how">Walk with arrow keys / WASD (or tap anywhere). Walk up to an animal to chat.</p>
          <PondMap levels={LEVELS} solved={progress.solved} onEnter={enter} />
        </main>
      )}

      {screen.name === 'level' && level && (
        <LevelRoom
          key={level.id}
          level={level}
          number={levelIndex + 1}
          hintsUsed={progress.hints[level.id] ?? 0}
          earned={progress.solved[level.id]}
          onHint={() => revealHint(level.id)}
          onSolve={() => solve(level.id)}
          onExit={() => setScreen({ name: 'map' })}
        />
      )}

      {screen.name === 'finale' && (
        <main className="card finale">
          <div className="title-cast" aria-hidden="true">
            <Raccoon size={110} />
            <Frog size={150} className="hop" />
            <Dog size={120} />
          </div>
          <p className="eyebrow">Certificate of awesome</p>
          <h1>Pond Security Champion</h1>
          <p className="lede">
            You scored <b>{score}</b> out of {LEVELS.length * POINTS_PER_LEVEL}. You now know five ways AI helpers get tricked — and how to protect them.
          </p>
          <p>
            Ready for harder mode? Try the same tricks on real AI agents in the{' '}
            <a href={GUILD_WORKSPACE} target="_blank" rel="noopener noreferrer">
              Hack the Pond Guild.ai workspace
            </a>
            .
          </p>
          <ul className="badges">
            {LEVELS.map((l) => (
              <li key={l.id}>
                ✓ {l.topic} <span>+{progress.solved[l.id]}</span>
              </li>
            ))}
          </ul>
          <div className="row center">
            <button className="big" onClick={() => setScreen({ name: 'map' })}>
              Back to the pond
            </button>
            <button
              className="ghost"
              onClick={() => {
                reset();
                setScreen({ name: 'title' });
              }}
            >
              Start over
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
