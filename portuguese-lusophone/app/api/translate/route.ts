const MAX_LENGTH = 500;
const WARNING_PREFIX = 'MYMEMORY WARNING';

type MyMemoryResponse = {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number | string;
  responseDetails?: string;
};

function isSuccessStatus(status: number | string | undefined): boolean {
  return status === 200 || status === '200';
}

function isUsableTranslation(text: string, source: string): boolean {
  if (!text) {
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

async function fetchTranslation(text: string, langpair: string): Promise<string | null> {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', langpair);

  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as MyMemoryResponse;
  const translated = data.responseData?.translatedText?.trim();

  if (!isSuccessStatus(data.responseStatus) || !translated || !isUsableTranslation(translated, text)) {
    return null;
  }

  return translated;
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
    const pt =
      (await fetchTranslation(trimmed, 'en|pt-PT')) ??
      (await fetchTranslation(trimmed, 'en|pt'));

    if (!pt) {
      return Response.json({ error: 'Could not translate this text right now. Try a shorter phrase.' }, { status: 422 });
    }

    return Response.json({ pt });
  } catch {
    return Response.json({ error: 'Translation service unavailable' }, { status: 502 });
  }
}
