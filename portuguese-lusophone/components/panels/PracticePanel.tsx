'use client';

import { useCallback, useMemo, useState } from 'react';
import { FLASHCARDS, QUIZ_ITEMS } from '@/lib/data';
import { loadProgress, saveProgress, shuffle } from '@/lib/progress';
import { PronunciationLine } from '@/components/PronunciationLine';
import { SpeakButton } from '@/components/SpeakButton';

export function PracticePanel() {
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizPool, setQuizPool] = useState<typeof QUIZ_ITEMS | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const flashDeck = useMemo(() => shuffle([...FLASHCARDS]), []);
  const currentCard = flashDeck[flashIndex % flashDeck.length];

  const nextCard = useCallback(() => {
    setFlashIndex((i) => (i + 1) % flashDeck.length);
    setFlipped(false);
    const p = loadProgress();
    p.flashSeen = (p.flashSeen ?? 0) + 1;
    saveProgress(p);
  }, [flashDeck.length]);

  function startQuiz() {
    setQuizPool(shuffle([...QUIZ_ITEMS]));
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
  }

  function answerQuiz(chosen: number) {
    if (!quizPool || quizDone) return;
    const item = quizPool[quizIndex];
    const correct = chosen === item.answer;
    const newScore = correct ? quizScore + 1 : quizScore;
    if (quizIndex + 1 >= quizPool.length) {
      setQuizScore(newScore);
      setQuizDone(true);
      const p = loadProgress();
      p.lastQuiz = { score: newScore, total: quizPool.length, at: Date.now() };
      saveProgress(p);
      return;
    }
    setQuizScore(newScore);
    setQuizIndex((i) => i + 1);
  }

  const quizItem = quizPool && !quizDone ? quizPool[quizIndex] : null;

  return (
    <>
      <h2 className="text-2xl font-bold">Practice</h2>
      <p className="mt-1 text-muted">
        Review words and test yourself on everyday situations — progress stays on this device only.
      </p>

      <h3 className="mt-8 text-lg font-semibold">Flashcards</h3>
      <div className="mt-2">
        <button
          type="button"
          onClick={nextCard}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg"
        >
          Next card
        </button>
      </div>
      {currentCard ? (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="mt-4 flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border-2 border-surface2 bg-surface p-6 text-center"
        >
          <span className="text-xs uppercase tracking-wide text-mz">🇲🇿 Moçambique</span>
          <span className="mt-2 text-2xl font-bold">
            {flipped ? currentCard.back : currentCard.front}
          </span>
          {flipped && currentCard.pron ? (
            <span className="mt-2 w-full max-w-sm">
              <PronunciationLine pron={currentCard.pron} />
            </span>
          ) : null}
          {flipped ? (
            <span className="mt-2">
              <SpeakButton text={currentCard.back} />
            </span>
          ) : null}
          {flipped && currentCard.hint ? (
            <span className="mt-2 text-sm text-muted">{currentCard.hint}</span>
          ) : (
            <span className="mt-2 text-sm text-muted">Tap to flip</span>
          )}
        </button>
      ) : null}

      <h3 className="mt-10 text-lg font-semibold">Quiz</h3>
      <div className="mt-2">
        <button
          type="button"
          onClick={startQuiz}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg"
        >
          Start quiz
        </button>
      </div>
      <div className="mt-4">
        {quizDone && quizPool ? (
          <p>
            Finished! Score: {quizScore} / {quizPool.length}
          </p>
        ) : null}
        {quizItem ? (
          <>
            <p className="text-lg font-semibold">{quizItem.q}</p>
            <div className="mt-3 flex flex-col gap-2">
              {quizItem.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => answerQuiz(i)}
                  className="rounded-lg border border-surface2 bg-surface px-4 py-3 text-left text-sm hover:border-accent"
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">
              Question {quizIndex + 1} of {quizPool!.length} · Score: {quizScore}
            </p>
          </>
        ) : !quizPool ? (
          <p className="text-sm text-muted">Press Start quiz to begin.</p>
        ) : null}
      </div>
    </>
  );
}
