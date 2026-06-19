import { lookupPortuguese } from '@/lib/phrase-index';
import type { Pronunciation } from '@/lib/types';

const MULTI_REPLACEMENTS: [string, string][] = [
  ['ções', 'sowngz'],
  ['ção', 'sowng'],
  ['nh', 'ny'],
  ['lh', 'ly'],
  ['ch', 'sh'],
  ['qu', 'kw'],
  ['gu', 'gw'],
  ['ão', 'owng'],
  ['ões', 'owngz'],
  ['ãe', 'ang-eh'],
  ['ã', 'ang'],
  ['õ', 'ong'],
  ['á', 'ah'],
  ['à', 'ah'],
  ['â', 'ang'],
  ['é', 'eh'],
  ['ê', 'eh'],
  ['í', 'ee'],
  ['ó', 'oh'],
  ['ô', 'oh'],
  ['ú', 'oo'],
  ['ç', 's'],
];

const SINGLE_REPLACEMENTS: [string, string][] = [
  ['c', 'k'],
  ['j', 'zh'],
  ['r', 'r'],
  ['x', 'sh'],
  ['z', 'z'],
];

function cleanPortugueseText(text: string): string {
  return text
    .replace(/\*.*$/g, '')
    .split('/')[0]
    ?.replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() ?? text;
}

function syllabifyWord(word: string): string {
  let work = word.toLowerCase();

  for (const [from, to] of MULTI_REPLACEMENTS) {
    work = work.split(from).join(to);
  }

  for (const [from, to] of SINGLE_REPLACEMENTS) {
    work = work.split(from).join(to);
  }

  const chunks = work.match(/[a-z]+(?:'[a-z]+)?/gi);
  if (!chunks?.length) {
    return word;
  }

  return chunks
    .map((chunk, index) => {
      if (index === 0 && chunk.length > 2) {
        return chunk.charAt(0).toUpperCase() + chunk.slice(1);
      }
      return chunk;
    })
    .join('-');
}

function buildRoughPronunciation(text: string): Pronunciation {
  const clean = cleanPortugueseText(text);
  const parts = clean.split(/(\s+|[,.!?;:])/);

  const simple = parts
    .map((part) => {
      if (!part.trim() || /^[,.!?;:\s]+$/.test(part)) {
        return part;
      }
      return syllabifyWord(part);
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    simple: simple || clean,
  };
}

export function resolvePronunciation(pt: string, curated?: Pronunciation): {
  pron: Pronunciation;
  approximate: boolean;
} {
  if (curated?.simple) {
    return { pron: curated, approximate: false };
  }

  const fromPhrasebook = lookupPortuguese(pt);
  if (fromPhrasebook?.simple) {
    return { pron: fromPhrasebook, approximate: false };
  }

  return {
    pron: buildRoughPronunciation(pt),
    approximate: true,
  };
}
