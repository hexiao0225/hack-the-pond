import { useCallback, useEffect, useState } from 'react';
import { HINT_COST, POINTS_PER_LEVEL } from './levels';

export interface Progress {
  /** Level id → points earned. Present only once the level is beaten. */
  solved: Record<string, number>;
  /** Level id → how many hints have been revealed. */
  hints: Record<string, number>;
}

const KEY = 'hack-the-pond:v1';
const EMPTY: Progress = { solved: {}, hints: {} };

const isNumberMap = (value: unknown): value is Record<string, number> =>
  typeof value === 'object' && value !== null && Object.values(value).every((v) => typeof v === 'number' && Number.isFinite(v));

function load(): Progress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (typeof parsed === 'object' && parsed !== null && 'solved' in parsed && 'hints' in parsed) {
      const { solved, hints } = parsed;
      if (isNumberMap(solved) && isNumberMap(hints)) return { solved, hints };
    }
  } catch {
    // Storage blocked or corrupt — start fresh.
  }
  return EMPTY;
}

export const pointsFor = (hintsUsed: number) => Math.max(POINTS_PER_LEVEL - hintsUsed * HINT_COST, 40);

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      // Progress just won't survive a reload.
    }
  }, [progress]);

  const revealHint = useCallback((levelId: string) => {
    setProgress((p) => ({ ...p, hints: { ...p.hints, [levelId]: Math.min((p.hints[levelId] ?? 0) + 1, 3) } }));
  }, []);

  const solve = useCallback((levelId: string) => {
    setProgress((p) =>
      p.solved[levelId] !== undefined ? p : { ...p, solved: { ...p.solved, [levelId]: pointsFor(p.hints[levelId] ?? 0) } },
    );
  }, []);

  const reset = useCallback(() => setProgress(EMPTY), []);

  const score = Object.values(progress.solved).reduce((a, b) => a + b, 0);
  return { progress, score, revealHint, solve, reset };
}
