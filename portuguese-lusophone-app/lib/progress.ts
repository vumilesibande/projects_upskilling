const STORAGE_KEY = 'portuguese-lusophone-progress';

export type Progress = {
  lessons?: Record<string, boolean>;
  flashSeen?: number;
  lastQuiz?: { score: number; total: number; at: number };
};

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Progress;
  } catch {
    return {};
  }
}

export function saveProgress(data: Progress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
