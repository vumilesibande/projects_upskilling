import { PronunciationLine } from '@/components/PronunciationLine';
import { SpeakButton } from '@/components/SpeakButton';
import type { Phrase, PhrasebookEntry } from '@/lib/types';

export function PhraseBlock({ phrase }: { phrase: Phrase | PhrasebookEntry }) {
  return (
    <div className="my-3 rounded-lg bg-surface2 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-lg font-semibold">{phrase.pt}</p>
        <SpeakButton text={phrase.pt} />
      </div>
      {phrase.pron ? <PronunciationLine pron={phrase.pron} /> : null}
      <p className="text-sm text-muted">{phrase.en}</p>
      {phrase.note ? <p className="mt-1 text-xs text-accent">{phrase.note}</p> : null}
    </div>
  );
}
