import { LESSONS, PHRASEBOOK, VOCABULARY } from '@/lib/data';
import type { Phrase, PhrasebookEntry, Pronunciation, VocabRow } from '@/lib/types';

export type IndexedPhrase = {
  en: string;
  pt: string;
  pron?: Pronunciation;
  note?: string;
  context: string;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''']/g, "'")
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}

function overlapScore(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 || tokensB.size === 0) {
    return 0;
  }
  let shared = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      shared += 1;
    }
  }
  return shared / Math.max(tokensA.size, tokensB.size);
}

function fromPhrase(phrase: Phrase | PhrasebookEntry, context: string): IndexedPhrase {
  return {
    en: phrase.en,
    pt: phrase.pt,
    pron: phrase.pron,
    note: phrase.note,
    context,
  };
}

function fromVocab(row: VocabRow): IndexedPhrase {
  return {
    en: row.concept,
    pt: row.pt,
    pron: row.pron,
    note: row.note,
    context: 'Vocabulary',
  };
}

function buildIndex(): IndexedPhrase[] {
  const entries: IndexedPhrase[] = [];

  for (const lesson of LESSONS) {
    for (const phrase of lesson.phrases ?? []) {
      entries.push(fromPhrase(phrase, lesson.title));
    }
  }

  for (const section of PHRASEBOOK) {
    for (const phrase of section.phrases) {
      entries.push(fromPhrase(phrase, section.title));
    }
  }

  for (const row of VOCABULARY) {
    entries.push(fromVocab(row));
  }

  return entries;
}

const PHRASE_INDEX = buildIndex();

export type LookupMatch = IndexedPhrase & {
  match: 'exact' | 'close' | 'partial';
  score: number;
};

export function lookupEnglish(input: string): LookupMatch[] {
  const query = normalize(input);
  if (!query) {
    return [];
  }

  const matches: LookupMatch[] = [];

  for (const entry of PHRASE_INDEX) {
    const target = normalize(entry.en);
    if (!target) {
      continue;
    }

    if (query === target) {
      matches.push({ ...entry, match: 'exact', score: 1 });
      continue;
    }

    if (query.includes(target) || target.includes(query)) {
      const score = overlapScore(query, target);
      matches.push({ ...entry, match: 'partial', score: Math.max(score, 0.75) });
      continue;
    }

    const score = overlapScore(query, target);
    if (score >= 0.6) {
      matches.push({ ...entry, match: 'close', score });
    }
  }

  return matches
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const order = { exact: 3, close: 2, partial: 1 };
      return order[b.match] - order[a.match];
    })
    .slice(0, 8);
}

function normalizePortuguese(text: string): string {
  return normalize(text.replace(/\*.*$/g, '').split('/')[0] ?? text);
}

export function lookupPortuguese(pt: string): Pronunciation | undefined {
  const query = normalizePortuguese(pt);
  if (!query) {
    return undefined;
  }

  let best: { pron?: Pronunciation; score: number } | undefined;

  for (const entry of PHRASE_INDEX) {
    if (!entry.pron?.simple) {
      continue;
    }

    const target = normalizePortuguese(entry.pt);
    if (!target) {
      continue;
    }

    if (query === target) {
      return entry.pron;
    }

    if (query.includes(target) || target.includes(query)) {
      const score = overlapScore(query, target);
      if (!best || score > best.score) {
        best = { pron: entry.pron, score };
      }
    }
  }

  return best?.pron;
}

export function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}
