import { VOCABULARY } from '@/lib/data';
import { PronunciationLine } from '@/components/PronunciationLine';
import { SpeakButton } from '@/components/SpeakButton';

export function VocabPanel() {
  return (
    <>
      <h2 className="text-2xl font-bold">Essential words</h2>
      <p className="mt-1 text-muted">
        Rent, transport, money, health — words you need after moving. Tap 🔊 to hear each one.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="border-b border-surface2 py-2 pr-3">English</th>
              <th className="border-b border-surface2 py-2 pr-3 text-mz">🇲🇿 Portuguese</th>
              <th className="border-b border-surface2 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {VOCABULARY.map((row) => (
              <tr key={row.concept} className="border-b border-surface2/60 align-top">
                <td className="py-3 pr-3 font-medium">{row.concept}</td>
                <td className="py-3 pr-3 text-mz">
                  <div className="flex flex-wrap items-center gap-1">
                    <span>{row.pt}</span>
                    <SpeakButton text={row.pt.split(' / ')[0] ?? row.pt} />
                  </div>
                  <PronunciationLine pron={row.pron} />
                </td>
                <td className="py-3 text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
