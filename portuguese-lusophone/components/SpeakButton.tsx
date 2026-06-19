'use client';

import { speakPortuguese, speechSupported } from '@/lib/speech';

type SpeakButtonProps = {
  text: string;
  label?: string;
};

export function SpeakButton({ text, label = 'Listen' }: SpeakButtonProps) {
  if (!speechSupported()) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => speakPortuguese(text)}
      className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-md border border-surface2 bg-surface px-2 py-0.5 text-xs text-accent hover:border-accent"
      aria-label={label}
      title="Play pronunciation (Mozambican / European Portuguese)"
    >
      <span aria-hidden>🔊</span>
      <span>{label}</span>
    </button>
  );
}
