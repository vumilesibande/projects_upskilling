import { isBlockedTranslation, looksLikePortuguese, pickBestMemoryMatch } from '@/lib/translation-safety';

const MAX_LENGTH = 500;
const WARNING_PREFIX = 'MYMEMORY WARNING';

type MyMemoryResponse = {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number | string;
  responseDetails?: string;
  matches?: Array<{
    segment?: string;
    translation?: string;
    quality?: number | string;
    match?: number;
    'usage-count'?: number;
    'created-by'?: string;
  }>;
};

type LibreTranslateResponse = {
  translatedText?: string;
};

function isSuccessStatus(status: number | string | undefined): boolean {
  return status === 200 || status === '200';
}

function isUsableTranslation(text: string, source: string): boolean {
  if (!text || isBlockedTranslation(text) || !looksLikePortuguese(text)) {
    return false;
  }
  if (text.toUpperCase().includes(WARNING_PREFIX)) {
    return false;
  }
  if (text.trim().toLowerCase() === source.trim().toLowerCase()) {
    return false;
  }
  return true;
}

async function fetchLibreTranslate(text: string): Promise<string | null> {
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = process.env.LIBRETRANSLATE_URL ?? 'https://libretranslate.com';

  const response = await fetch(`${baseUrl}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: 'pt',
      format: 'text',
      api_key: apiKey,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as LibreTranslateResponse;
  const translated = data.translatedText?.trim();

  if (!translated || !isUsableTranslation(translated, text)) {
    return null;
  }

  return translated;
}

async function fetchMyMemory(text: string, langpair: string): Promise<string | null> {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', langpair);

  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as MyMemoryResponse;

  if (!isSuccessStatus(data.responseStatus)) {
    return null;
  }

  const fromMatches = pickBestMemoryMatch(data.matches, text);
  if (fromMatches && isUsableTranslation(fromMatches, text)) {
    return fromMatches;
  }

  const translated = data.responseData?.translatedText?.trim();
  if (translated && isUsableTranslation(translated, text)) {
    return translated;
  }

  return null;
}

async function fetchTranslation(text: string): Promise<string | null> {
  const libre = await fetchLibreTranslate(text);
  if (libre) {
    return libre;
  }

  return (
    (await fetchMyMemory(text, 'en|pt-PT')) ??
    (await fetchMyMemory(text, 'en|pt'))
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body === 'object' && body !== null && 'text' in body ? body.text : null;

  if (typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'Text is required' }, { status: 400 });
  }

  const trimmed = text.trim();

  if (trimmed.length > MAX_LENGTH) {
    return Response.json({ error: `Text must be ${MAX_LENGTH} characters or fewer` }, { status: 400 });
  }

  try {
    const pt = await fetchTranslation(trimmed);

    if (!pt) {
      return Response.json({ error: 'Could not translate this text right now. Try a shorter phrase.' }, { status: 422 });
    }

    return Response.json({ pt });
  } catch {
    return Response.json({ error: 'Translation service unavailable' }, { status: 502 });
  }
}
