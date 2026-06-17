const SPEECH_LANG = 'pt-PT';

export function speakPortuguese(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  const clean = text.replace(/\*.*$/g, '').split('/')[0]?.trim() ?? text;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = SPEECH_LANG;
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
