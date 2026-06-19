const BLOCKED_PATTERNS = [
  /\bputa\b/i,
  /\bmerda\b/i,
  /\bcaralho\b/i,
  /\bfoda\b/i,
  /\bchupar\b/i,
  /\bporra\b/i,
  /\bviado\b/i,
  /\bbicha\b/i,
];

const TRUSTED_CREATORS = new Set([
  'MateCat',
  'Microsoft',
  'TED',
  'Google',
  'DeepL',
  'Public Sector',
]);

const GARBAGE_PATTERN = /^[A-Z0-9]{2,5}$/;

export function isBlockedTranslation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }
  if (GARBAGE_PATTERN.test(trimmed)) {
    return true;
  }
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function looksLikePortuguese(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) {
    return false;
  }
  if (!/[a-záàâãéêíóôõúçA-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(trimmed)) {
    return false;
  }
  return true;
}

type MemoryMatch = {
  segment?: string;
  translation?: string;
  quality?: number | string;
  match?: number;
  'usage-count'?: number;
  'created-by'?: string;
};

export function pickBestMemoryMatch(matches: MemoryMatch[] | undefined, source: string): string | null {
  if (!matches?.length) {
    return null;
  }

  const sourceNorm = source.trim().toLowerCase();
  let best: { text: string; score: number } | null = null;

  for (const entry of matches) {
    const text = entry.translation?.trim();
    if (!text || isBlockedTranslation(text) || !looksLikePortuguese(text)) {
      continue;
    }

    const segment = entry.segment?.trim().toLowerCase() ?? '';
    let score = Number(entry.quality) || 0;
    score += (entry.match ?? 0) * 100;
    score += (entry['usage-count'] ?? 0) * 3;

    const creator = entry['created-by'] ?? '';
    if (TRUSTED_CREATORS.has(creator)) {
      score += 40;
    } else if (creator === 'Public Web') {
      score -= 30;
    }

    if (segment === sourceNorm) {
      score += 25;
    }

    if (!best || score > best.score) {
      best = { text, score };
    }
  }

  return best?.text ?? null;
}
