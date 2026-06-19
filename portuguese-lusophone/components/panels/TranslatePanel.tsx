'use client';

import { useState } from 'react';
import { PronunciationLine } from '@/components/PronunciationLine';
import { SpeakButton } from '@/components/SpeakButton';
import { lookupEnglish, splitSentences, type LookupMatch } from '@/lib/phrase-index';
import { resolvePronunciation } from '@/lib/pronunciation';

type SentenceResult = {
  id: string;
  en: string;
  pt: string;
  pron?: LookupMatch['pron'];
  note?: string;
  context?: string;
  source: 'phrasebook' | 'machine' | 'phrasebook-fallback';
  pronApproximate?: boolean;
};

function pickPhrasebookMatch(sentence: string): LookupMatch | null {
  const matches = lookupEnglish(sentence);
  const best = matches[0];

  if (!best) {
    return null;
  }

  if (best.match === 'exact' || best.match === 'partial') {
    return best;
  }

  if (best.match === 'close' && best.score >= 0.6) {
    return best;
  }

  return null;
}

function attachPronunciation(result: Omit<SentenceResult, 'pronApproximate'>): SentenceResult {
  const { pron, approximate } = resolvePronunciation(result.pt, result.pron);
  return {
    ...result,
    pron,
    pronApproximate: approximate,
  };
}

function fromPhrasebookMatch(sentence: string, match: LookupMatch, fallback = false): SentenceResult {
  return attachPronunciation({
    id: `${sentence}-${match.pt}`,
    en: sentence,
    pt: match.pt,
    pron: match.pron,
    note: fallback ? `Closest match in the app for: “${match.en}”` : match.note,
    context: match.context,
    source: fallback ? 'phrasebook-fallback' : 'phrasebook',
  });
}

async function translateWithApi(text: string): Promise<string> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = (await response.json()) as { pt?: string; error?: string };

  if (!response.ok || !data.pt) {
    throw new Error(data.error ?? 'Translation failed');
  }

  return data.pt;
}

async function translateSentence(sentence: string, index: number): Promise<SentenceResult> {
  const phrasebook = pickPhrasebookMatch(sentence);

  if (phrasebook) {
    const usePhrasebook =
      phrasebook.match === 'exact' ||
      (phrasebook.match === 'partial' && phrasebook.score >= 0.9) ||
      normalizeForCompare(sentence) === normalizeForCompare(phrasebook.en);

    if (usePhrasebook) {
      return fromPhrasebookMatch(sentence, phrasebook);
    }
  }

  try {
    const pt = await translateWithApi(sentence);
    return attachPronunciation({
      id: `machine-${index}-${sentence}`,
      en: sentence,
      pt,
      source: 'machine',
    });
  } catch (error) {
    if (phrasebook) {
      return fromPhrasebookMatch(sentence, phrasebook, true);
    }
    throw error;
  }
}

function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function TranslatePanel() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<SentenceResult[]>([]);
  const [suggestions, setSuggestions] = useState<LookupMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleTranslate() {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setSuggestions([]);
    setHasSearched(true);

    const sentences = splitSentences(trimmed);

    try {
      const translated: SentenceResult[] = [];

      for (let index = 0; index < sentences.length; index += 1) {
        translated.push(await translateSentence(sentences[index], index));
      }

      setResults(translated);

      const allSuggestions = lookupEnglish(trimmed).filter((match) => match.match !== 'exact');
      const seen = new Set<string>();
      const unique = allSuggestions.filter((match) => {
        const key = `${match.en}|${match.pt}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      setSuggestions(unique.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function applySuggestion(match: LookupMatch) {
    setInput(match.en);
    setResults([fromPhrasebookMatch(match.en, match)]);
    setSuggestions([]);
    setError(null);
    setHasSearched(true);
  }

  return (
    <>
      <h2 className="text-2xl font-bold">English → Portuguese</h2>
      <p className="mt-1 text-muted">
        Type what you want to say in English. The app checks its phrasebook first, then translates
        anything else to European Portuguese (pt-PT).
      </p>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void handleTranslate();
        }}
      >
        <label htmlFor="translate-input" className="block text-sm font-medium">
          English
        </label>
        <textarea
          id="translate-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleTranslate();
            }
          }}
          rows={4}
          placeholder="e.g. Where is the nearest pharmacy?"
          className="mt-2 w-full resize-y rounded-xl border border-surface2 bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <p className="mt-2 text-xs text-muted">Press Enter to translate. Shift+Enter for a new line.</p>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="mt-3 rounded-full border border-accent bg-surface2 px-5 py-2 text-sm font-medium text-foreground transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Translating…' : 'Translate'}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-lg border border-ao/40 bg-surface2 px-4 py-3 text-sm text-foreground" role="alert">
          {error}
        </p>
      ) : null}

      {hasSearched ? (
        <section className="mt-8" aria-live="polite">
          <h3 className="text-lg font-semibold text-foreground">Portuguese</h3>

          {loading ? (
            <p className="mt-3 text-sm text-muted">Working on your translation…</p>
          ) : null}

          {!loading && results.length === 0 && !error ? (
            <p className="mt-3 text-sm text-muted">No translation to show yet.</p>
          ) : null}

          {results.map((result) => (
            <div key={result.id} className="mt-3 rounded-xl border border-surface2 bg-surface2 p-4">
              <p className="text-xs text-muted">{result.en}</p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                <p className="text-xl font-semibold text-foreground">{result.pt}</p>
                <SpeakButton text={result.pt.split(' / ')[0] ?? result.pt} />
              </div>
              {result.pron ? (
                <PronunciationLine pron={result.pron} approximate={result.pronApproximate} />
              ) : null}
              {result.note ? <p className="mt-2 text-xs text-accent">{result.note}</p> : null}
              <p className="mt-2 text-xs text-muted">
                {result.source === 'phrasebook'
                  ? `From app phrasebook${result.context ? ` · ${result.context}` : ''}`
                  : result.source === 'phrasebook-fallback'
                    ? `Closest phrasebook match${result.context ? ` · ${result.context}` : ''}`
                    : 'Machine translation — confirm with a native speaker'}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {suggestions.length > 0 ? (
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">Similar phrases in the app</h3>
          <p className="mt-1 text-sm text-muted">Tap one to use the curated translation with pronunciation.</p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((match) => (
              <li key={`${match.en}-${match.pt}`}>
                <button
                  type="button"
                  onClick={() => applySuggestion(match)}
                  className="w-full rounded-lg border border-surface2 bg-surface px-4 py-3 text-left transition hover:border-accent"
                >
                  <span className="block text-sm text-muted">{match.en}</span>
                  <span className="mt-1 block font-medium text-foreground">{match.pt}</span>
                  {match.pron ? (
                    <span className="mt-1 block font-mono text-xs text-muted">Say it like: {match.pron.simple}</span>
                  ) : null}
                  <span className="mt-1 block text-xs text-muted">{match.context}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
