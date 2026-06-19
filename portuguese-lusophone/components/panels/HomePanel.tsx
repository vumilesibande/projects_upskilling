import { MOZAMBIQUE, QUICK_START } from '@/lib/data';

export function HomePanel() {
  return (
    <>
      <h2 className="text-2xl font-bold">Just moved to Mozambique?</h2>
      <p className="mt-2 text-muted">{MOZAMBIQUE.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed">
        Practical Portuguese for shops, transport, neighbours, rent, health, and emergencies — with
        pronunciation guides and listen buttons. No account required.
      </p>

      <div className="mt-6 rounded-xl border-l-4 border-mz bg-surface p-5">
        <h3 className="font-semibold">🇲🇿 First steps</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
          {QUICK_START.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-surface2 p-4 text-sm">
          <strong className="text-foreground">Daily life</strong>
          <p className="mt-1 text-muted">Phrases by situation — housing, transport, emergencies.</p>
        </div>
        <div className="rounded-xl bg-surface2 p-4 text-sm">
          <strong className="text-foreground">Guides</strong>
          <p className="mt-1 text-muted">Short lessons for your first weeks here.</p>
        </div>
        <div className="rounded-xl bg-surface2 p-4 text-sm">
          <strong className="text-foreground">Words</strong>
          <p className="mt-1 text-muted">Rent, chapa, metical, farmácia, and more.</p>
        </div>
        <div className="rounded-xl bg-surface2 p-4 text-sm">
          <strong className="text-foreground">Practice</strong>
          <p className="mt-1 text-muted">Flashcards and quiz — progress stays on your phone.</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-surface2 p-4 text-sm text-muted">
        Content is a learning aid, not legal or medical advice. Confirm important matters with
        local professionals and native speakers. Emergency numbers vary by area — find yours locally.
      </div>
    </>
  );
}
