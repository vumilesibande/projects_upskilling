import type { Pronunciation } from '@/lib/types';

export function PronunciationLine({
  pron,
  approximate = false,
}: {
  pron: Pronunciation;
  approximate?: boolean;
}) {
  return (
    <p className="mt-2 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">Say it like: </span>
      <span className="font-mono text-foreground/90">{pron.simple}</span>
      {pron.ipa ? (
        <span className="ml-2 text-xs text-accent" lang="pt">
          IPA: {pron.ipa}
        </span>
      ) : null}
      {approximate ? (
        <span className="ml-2 text-xs text-muted">(approximate — tap Listen to check)</span>
      ) : null}
    </p>
  );
}
