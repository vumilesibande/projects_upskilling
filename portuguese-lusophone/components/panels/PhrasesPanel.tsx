import { PHRASEBOOK } from '@/lib/data';
import { PhraseBlock } from '@/components/PhraseBlock';

export function PhrasesPanel() {
  return (
    <>
      <h2 className="text-2xl font-bold">Daily life phrases</h2>
      <p className="mt-1 text-muted">
        Situations you face after moving — settling in, home, shops, transport, paperwork, and
        emergencies.
      </p>
      {PHRASEBOOK.map((section) => (
        <section key={section.id} className="mt-8">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          {section.description ? (
            <p className="mt-1 text-sm text-muted">{section.description}</p>
          ) : null}
          {section.phrases.map((ph) => (
            <PhraseBlock key={ph.pt} phrase={ph} />
          ))}
        </section>
      ))}
    </>
  );
}
