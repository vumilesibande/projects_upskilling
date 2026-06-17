'use client';

import { useState } from 'react';
import { TABS } from '@/lib/data';
import type { PanelId } from '@/lib/types';
import { HomePanel } from '@/components/panels/HomePanel';
import { LessonsPanel } from '@/components/panels/LessonsPanel';
import { VocabPanel } from '@/components/panels/VocabPanel';
import { PhrasesPanel } from '@/components/panels/PhrasesPanel';
import { PracticePanel } from '@/components/panels/PracticePanel';
import { SoundsPanel } from '@/components/panels/SoundsPanel';
import { TranslatePanel } from '@/components/panels/TranslatePanel';

export function AppShell() {
  const [panel, setPanel] = useState<PanelId>('home');

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface2 bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <h1 className="text-lg font-bold">PT em Moçambique</h1>
        </div>
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-1 px-4 pb-3" aria-label="Sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-selected={panel === tab.id}
              onClick={() => setPanel(tab.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                panel === tab.id
                  ? 'border-accent bg-surface2 text-foreground'
                  : 'border-surface2 bg-surface text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {panel === 'home' && <HomePanel />}
        {panel === 'translate' && <TranslatePanel />}
        {panel === 'sounds' && <SoundsPanel />}
        {panel === 'lessons' && <LessonsPanel />}
        {panel === 'vocab' && <VocabPanel />}
        {panel === 'phrases' && <PhrasesPanel />}
        {panel === 'practice' && <PracticePanel />}
      </main>

      <footer className="mx-auto max-w-3xl border-t border-surface2 px-4 py-4 text-xs text-muted">
        For people who have moved to Mozambique. Not legal or medical advice — confirm important
        details locally.
      </footer>
    </>
  );
}
