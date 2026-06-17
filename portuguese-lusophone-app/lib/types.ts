export type Pronunciation = {
  simple: string;
  ipa?: string;
};

export type Phrase = {
  pt: string;
  en: string;
  note?: string;
  pron?: Pronunciation;
};

export type PhrasebookEntry = {
  pt: string;
  en: string;
  pron: Pronunciation;
  note?: string;
};

export type PhrasebookSection = {
  id: string;
  title: string;
  description?: string;
  phrases: PhrasebookEntry[];
};

export type Lesson = {
  id: string;
  title: string;
  body?: string;
  phrases?: Phrase[];
};

export type VocabRow = {
  concept: string;
  pt: string;
  note: string;
  pron: Pronunciation;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint: string;
  pron: Pronunciation;
};

export type QuizItem = {
  q: string;
  options: string[];
  answer: number;
};

export type PanelId = 'home' | 'translate' | 'lessons' | 'vocab' | 'phrases' | 'practice' | 'sounds';

export type SoundGuide = {
  letter: string;
  name: string;
  pron: Pronunciation;
  tip: string;
};
