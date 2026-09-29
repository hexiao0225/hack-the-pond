import { useEffect, useRef, useState } from 'react';
import { HINT_COST } from '../game/levels';
import { pointsFor } from '../game/progress';
import type { ChatMessage, Level } from '../game/types';
import { Frog, Npc } from './Characters';

interface Props {
  level: Level<unknown>;
  number: number;
  hintsUsed: number;
  earned?: number;
  onHint: () => void;
  onSolve: () => void;
  onExit: () => void;
}

const MAX_INPUT = 280;
let nextId = 1;
const msg = (from: ChatMessage['from'], text: string): ChatMessage => ({ id: nextId++, from, text });

export function LevelRoom({ level, number, hintsUsed, earned, onHint, onSolve, onExit }: Props) {
  const [stage, setStage] = useState<'learn' | 'play' | 'won'>(earned !== undefined ? 'won' : 'learn');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [msg('bot', level.greeting)]);
  const [agentState, setAgentState] = useState(level.initialState);
  const [draft, setDraft] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerWrong, setAnswerWrong] = useState(false);
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const win = () => {
    onSolve();
    timers.current.push(window.setTimeout(() => setStage('won'), 900));
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, MAX_INPUT);
    if (!text || typing) return;
    setDraft('');
    setMessages((m) => [...m, msg('you', text)]);
    setTyping(true);

    const result = level.respond(text, agentState);
    setAgentState(result.state);
    result.replies.forEach((r, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setMessages((m) => [...m, msg(r.from, r.text)]);
          if (i === result.replies.length - 1) {
            setTyping(false);
            if (result.solved) win();
          }
        }, 550 + i * 650),
      );
    });
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!level.secret) return;
    if (answer.trim().toUpperCase() === level.secret.toUpperCase()) {
      setMessages((m) => [...m, msg('system', `🎉 "${level.secret}" is correct! You cracked it.`)]);
      win();
    } else {
      setAnswerWrong(true);
      timers.current.push(window.setTimeout(() => setAnswerWrong(false), 600));
    }
  };

  return (
    <div className="room">
      <header className="room-bar">
        <button className="ghost" onClick={onExit}>
          ← Back to the pond
        </button>
        <span className="room-title">
          Level {number} · <b>{level.topic}</b>
        </span>
      </header>

      {stage === 'learn' && (
        <section className="card lesson">
          <div className="lesson-cast">
            <Npc kind={level.npc.kind} size={150} className="bob" />
            <div>
              <p className="eyebrow">Meet {level.npc.name}, the {level.npc.role.toLowerCase()}</p>
              <h1>{level.title}</h1>
            </div>
          </div>
          <h2>What is {level.topic.toLowerCase()}?</h2>
          <ul className="explain">
            {level.explain.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="analogy">
            <span>💡 Think of it like this:</span> {level.analogy}
          </p>
          <div className="goal">
            <b>Your mission</b>
            <p>{level.goal}</p>
          </div>
          <button className="big" onClick={() => setStage('play')}>
            Let's hack! →
          </button>
        </section>
      )}

      {stage === 'play' && (
        <section className="play">
          <div className="card chat">
            <div className="chat-head">
              <Npc kind={level.npc.kind} size={56} />
              <div>
                <b>{level.npc.name}</b>
                <span>{level.npc.role}</span>
              </div>
            </div>
            <div className="log" ref={logRef} aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`bubble ${m.from}`}>
                  {m.from === 'tool' && <span className="tool-label">🔧 tool used</span>}
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="bubble bot typing" aria-label={`${level.npc.name} is typing`}>
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
            <form className="composer" onSubmit={send}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={MAX_INPUT}
                placeholder={`Say something to ${level.npc.name}...`}
                aria-label="Your message"
                autoFocus
              />
              <button type="submit" disabled={!draft.trim() || typing}>
                Send
              </button>
            </form>
          </div>

          <aside className="side">
            <div className="card mission">
              <b>🎯 Mission</b>
              <p>{level.goal}</p>
              {level.secret && (
                <form className={`answer ${answerWrong ? 'shake' : ''}`} onSubmit={checkAnswer}>
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={40}
                    placeholder="The secret is..."
                    aria-label="Secret answer"
                  />
                  <button type="submit">Check</button>
                </form>
              )}
            </div>
            <div className="card hints">
              <b>🐸 Stuck? Get a hint</b>
              <p className="small">Each hint costs {HINT_COST} points. Worth right now: {pointsFor(hintsUsed)} pts</p>
              <ol>
                {level.hints.slice(0, hintsUsed).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
              {hintsUsed < level.hints.length && (
                <button className="ghost" onClick={onHint}>
                  Show hint {hintsUsed + 1} of {level.hints.length}
                </button>
              )}
            </div>
          </aside>
        </section>
      )}

      {stage === 'won' && (
        <section className="card won">
          <div className="lesson-cast">
            <Frog size={120} className="hop" />
            <Npc kind={level.npc.kind} size={120} />
          </div>
          <p className="eyebrow">Level {number} complete</p>
          <h1>You hacked {level.npc.name}! +{earned ?? pointsFor(hintsUsed)} pts</h1>
          <h2>🛡️ How real engineers stop this</h2>
          <ul className="explain defense">
            {level.defense.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="small">Remember: only test on systems you have permission to hack — like this game!</p>
          <div className="row">
            <button className="big" onClick={onExit}>
              Back to the pond →
            </button>
            <button
              className="ghost"
              onClick={() => {
                setMessages([msg('bot', level.greeting)]);
                setAgentState(level.initialState);
                setStage('play');
              }}
            >
              Play again
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
