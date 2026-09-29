import { useEffect, useRef, useState } from 'react';
import type { Level } from '../game/types';
import { Frog, Npc } from './Characters';

interface Props {
  levels: Level<unknown>[];
  solved: Record<string, number>;
  onEnter: (levelId: string) => void;
}

type Point = { x: number; y: number };

const SPEED = 0.045; // % of the map per millisecond
const TALK_RANGE = 11;
const KEYS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const standSpot = (l: Level<unknown>): Point => ({ x: l.spot.x, y: l.spot.y + 12 });

// Where the player stood last is kept across visits to a level.
let lastPosition: Point = { x: 50, y: 32 };

export function PondMap({ levels, solved, onEnter }: Props) {
  const [pos, setPos] = useState<Point>(lastPosition);
  const [walking, setWalking] = useState(false);
  const posRef = useRef<Point>(lastPosition);
  const [facing, setFacing] = useState<1 | -1>(1);
  const held = useRef(new Set<string>());
  const target = useRef<{ point: Point; levelId?: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const nearby = levels.find((l) => Math.hypot(l.spot.x - pos.x, l.spot.y + 10 - pos.y) < TALK_RANGE);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (KEYS[key]) {
        e.preventDefault();
        held.current.add(key);
        target.current = null;
      }
    };
    const up = (e: KeyboardEvent) => held.current.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      let dx = 0;
      let dy = 0;
      held.current.forEach((k) => {
        dx += KEYS[k].x;
        dy += KEYS[k].y;
      });

      const p = posRef.current;
      const goal = target.current;
      if (goal) {
        const gx = goal.point.x - p.x;
        const gy = goal.point.y - p.y;
        const dist = Math.hypot(gx, gy);
        if (dist < 1) {
          target.current = null;
          setWalking(false);
          if (goal.levelId) onEnter(goal.levelId);
        } else {
          dx = gx / dist;
          dy = gy / dist;
        }
      }
      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        if (dx) setFacing(dx > 0 ? 1 : -1);
        const next = {
          x: clamp(p.x + (dx / len) * SPEED * dt, 4, 96),
          y: clamp(p.y + (dy / len) * SPEED * dt * 1.4, 8, 94),
        };
        posRef.current = next;
        lastPosition = next;
        setPos(next);
      }
      setWalking(Boolean(dx || dy));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onEnter]);

  useEffect(() => {
    const talk = (e: KeyboardEvent) => {
      if (nearby && (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onEnter(nearby.id);
      }
    };
    window.addEventListener('keydown', talk);
    return () => window.removeEventListener('keydown', talk);
  }, [nearby, onEnter]);

  const walkTo = (e: React.MouseEvent) => {
    const box = mapRef.current?.getBoundingClientRect();
    if (!box) return;
    target.current = {
      point: {
        x: clamp(((e.clientX - box.left) / box.width) * 100, 4, 96),
        y: clamp(((e.clientY - box.top) / box.height) * 100, 8, 94),
      },
    };
  };

  return (
    <div className="pond" ref={mapRef} onClick={walkTo}>
      <svg className="pond-scenery" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M30 44 Q34 34 50 36 Q68 34 72 44 Q78 54 66 58 Q52 64 36 58 Q24 54 30 44 Z"
          fill="#8fd3d6"
          stroke="#2b2230"
          strokeWidth="0.5"
          filter="url(#sketch)"
        />
        <path d="M38 46 q4 -2 8 0 M56 50 q4 -2 8 0 M44 54 q3 -1.5 6 0" stroke="#5fb3bb" strokeWidth="0.4" fill="none" />
        <path d="M10 94 Q30 70 50 72 Q70 74 92 94" stroke="#e7d9a8" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M50 10 Q48 26 50 34" stroke="#e7d9a8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      </svg>
      {[
        [40, 44],
        [60, 50],
        [48, 52],
      ].map(([x, y]) => (
        <span key={`${x}-${y}`} className="lily" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      {[
        [6, 14],
        [92, 48],
        [8, 52],
        [62, 88],
        [36, 12],
        [94, 10],
      ].map(([x, y]) => (
        <span key={`${x}-${y}`} className="bush" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}

      {levels.map((l, i) => {
        const done = solved[l.id] !== undefined;
        return (
          <button
            key={l.id}
            className={`station ${done ? 'done' : ''} ${nearby?.id === l.id ? 'near' : ''}`}
            style={{ left: `${l.spot.x}%`, top: `${l.spot.y}%`, zIndex: Math.round(l.spot.y) }}
            onClick={(e) => {
              e.stopPropagation();
              target.current = { point: standSpot(l), levelId: l.id };
            }}
            aria-label={`Level ${i + 1}: ${l.title} with ${l.npc.name}${done ? ' (done)' : ''}`}
          >
            <Npc kind={l.npc.kind} size={88} className="bob" />
            <span className="tag">
              <b>{i + 1}.</b> {l.npc.name}
              {done && <span className="check"> ✓</span>}
            </span>
            <span className="topic-chip">{l.topic}</span>
          </button>
        );
      })}

      <div
        className={`player ${walking ? 'walking' : ''}`}
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: Math.round(pos.y) + 1 }}
      >
        <div style={{ transform: `scaleX(${facing})` }}>
          <Frog size={64} />
        </div>
        <span className="you">you</span>
      </div>

      {nearby && (
        <button
          className="talk-prompt"
          onClick={(e) => {
            e.stopPropagation();
            onEnter(nearby.id);
          }}
        >
          Chat with {nearby.npc.name} <kbd>E</kbd>
        </button>
      )}
    </div>
  );
}
