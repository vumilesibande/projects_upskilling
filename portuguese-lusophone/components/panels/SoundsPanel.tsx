import { SOUND_GUIDE } from '@/lib/data';
import { PronunciationLine } from '@/components/PronunciationLine';

export function SoundsPanel() {
  return (
    <>
      <h2 className="text-2xl font-bold">Sounds & spelling</h2>
      <p className="mt-1 text-muted">
        Pronunciation basics so people understand you in shops and on the street. Simple guides plus
        IPA where helpful.
      </p>
      <ul className="mt-6 space-y-4">
        {SOUND_GUIDE.map((item) => (
          <li key={item.letter} className="rounded-xl border border-surface2 bg-surface p-4">
            <h3 className="font-semibold">
              <span className="text-accent">{item.letter}</span>
              <span className="ml-2 text-sm font-normal text-muted">— {item.name}</span>
            </h3>
            <div className="mt-2">
              <PronunciationLine pron={item.pron} />
            </div>
            <p className="mt-2 text-xs text-muted">{item.tip}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
