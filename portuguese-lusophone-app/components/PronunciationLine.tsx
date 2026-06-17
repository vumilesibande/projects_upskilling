import type { Pronunciation } from '@/lib/types';

export function PronunciationLine({ pron }: { pron: Pronunciation }) {
  return (
    <p className="mt-1 font-mono text-sm text-muted">
      <span className="text-foreground/90">{pron.simple}</span>
      {pron.ipa ? (
        <span className="ml-2 text-xs text-accent" lang="pt">
          IPA: {pron.ipa}
        </span>
      ) : null}
    </p>
  );
}
