'use client';

import { useState } from 'react';
import { LESSONS } from '@/lib/data';
import { loadProgress, saveProgress } from '@/lib/progress';
import type { Lesson } from '@/lib/types';
import { PhraseBlock } from '@/components/PhraseBlock';

export function LessonsPanel() {
  const [active, setActive] = useState<Lesson | null>(null);

  function openLesson(lesson: Lesson) {
    setActive(lesson);
    const progress = loadProgress();
    progress.lessons = { ...progress.lessons, [lesson.id]: true };
    saveProgress(progress);
  }

  return (
    <>
      <h2 className="text-2xl font-bold">Guides for newcomers</h2>
      <p className="mt-1 text-muted">
        Short reads for your first weeks — transport, markets, home, and health.
      </p>
      <ul className="mt-4 space-y-2">
        {LESSONS.map((lesson) => (
          <li key={lesson.id}>
            <button
              type="button"
              onClick={() => openLesson(lesson)}
              className="w-full rounded-xl border border-surface2 bg-surface px-4 py-3 text-left transition hover:border-accent"
            >
              {lesson.title}
            </button>
          </li>
        ))}
      </ul>
      {active ? (
        <div className="mt-4 rounded-xl bg-surface p-5">
          <h3 className="text-xl font-semibold">{active.title}</h3>
          {active.body
            ? active.body.split('\n\n').map((p) => (
                <p key={p.slice(0, 24)} className="mt-3 text-sm leading-relaxed">
                  {p}
                </p>
              ))
            : null}
          {active.phrases?.map((ph) => (
            <PhraseBlock key={ph.pt} phrase={ph} />
          ))}
        </div>
      ) : null}
    </>
  );
}
