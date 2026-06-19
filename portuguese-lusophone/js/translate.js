(function () {
  'use strict';

  const MAX_LENGTH = 500;
  const WARNING_PREFIX = 'MYMEMORY WARNING';

  let phraseIndex = null;

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[''']/g, "'")
      .replace(/[^\w\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(text) {
    return normalize(text).split(' ').filter(Boolean);
  }

  function overlapScore(a, b) {
    const tokensA = new Set(tokenize(a));
    const tokensB = new Set(tokenize(b));
    if (!tokensA.size || !tokensB.size) {
      return 0;
    }
    let shared = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) {
        shared += 1;
      }
    }
    return shared / Math.max(tokensA.size, tokensB.size);
  }

  function buildPhraseIndex() {
    const items = [];

    ['br', 'mz', 'ao'].forEach((code) => {
      (PHRASEBOOK[code] || []).forEach((phrase) => {
        items.push({
          en: phrase.en,
          pt: phrase.pt,
          note: phrase.note,
          context: COUNTRIES[code].name,
        });
      });
    });

    LESSONS.forEach((lesson) => {
      (lesson.phrases || []).forEach((phrase) => {
        items.push({
          en: phrase.en,
          pt: phrase.pt,
          note: phrase.note,
          context: lesson.title,
        });
      });
    });

    VOCABULARY.forEach((row) => {
      items.push({
        en: row.concept,
        pt: row.mz || row.ao || row.br,
        note: row.note,
        context: 'Vocabulary',
      });
    });

    return items;
  }

  function lookupEnglish(text) {
    if (!phraseIndex) {
      phraseIndex = buildPhraseIndex();
    }

    const normalized = normalize(text);
    if (!normalized) {
      return [];
    }

    const results = [];

    for (const item of phraseIndex) {
      const itemNorm = normalize(item.en);
      if (!itemNorm) {
        continue;
      }

      if (itemNorm === normalized) {
        results.push({ ...item, match: 'exact', score: 1 });
        continue;
      }

      if (itemNorm.includes(normalized) || normalized.includes(itemNorm)) {
        results.push({ ...item, match: 'partial', score: 0.85 });
        continue;
      }

      const score = overlapScore(text, item.en);
      if (score >= 0.45) {
        results.push({ ...item, match: 'close', score });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  function splitSentences(text) {
    return text
      .split(/(?<=[.!?])\s+|\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function isUsableTranslation(translated, source) {
    if (!translated) {
      return false;
    }
    if (translated.toUpperCase().includes(WARNING_PREFIX)) {
      return false;
    }
    if (translated.trim().toLowerCase() === source.trim().toLowerCase()) {
      return false;
    }
    return true;
  }

  async function fetchTranslation(text, langpair) {
    const url = new URL('https://api.mymemory.translated.net/get');
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', langpair);

    const response = await fetch(url.toString());
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const translated = data.responseData?.translatedText?.trim();
    const status = data.responseStatus;

    if ((status !== 200 && status !== '200') || !isUsableTranslation(translated, text)) {
      return null;
    }

    return translated;
  }

  async function translateWithApi(text) {
    const pt = (await fetchTranslation(text, 'en|pt-PT')) ?? (await fetchTranslation(text, 'en|pt'));
    if (!pt) {
      throw new Error('Could not translate this text right now. Try a shorter phrase.');
    }
    return pt;
  }

  function pickPhrasebookMatch(sentence) {
    const matches = lookupEnglish(sentence);
    const best = matches[0];
    if (!best) {
      return null;
    }
    if (best.match === 'exact' || best.match === 'partial') {
      return best;
    }
    if (best.match === 'close' && best.score >= 0.6) {
      return best;
    }
    return null;
  }

  async function translateSentence(sentence, index) {
    const phrasebook = pickPhrasebookMatch(sentence);
    if (phrasebook?.match === 'exact') {
      return {
        id: `phrase-${index}`,
        en: sentence,
        pt: phrasebook.pt,
        note: phrasebook.note,
        context: phrasebook.context,
        source: 'phrasebook',
      };
    }

    try {
      const pt = await translateWithApi(sentence);
      return {
        id: `machine-${index}`,
        en: sentence,
        pt,
        source: 'machine',
      };
    } catch (error) {
      if (phrasebook) {
        return {
          id: `fallback-${index}`,
          en: sentence,
          pt: phrasebook.pt,
          note: `Closest match in the app for: “${phrasebook.en}”`,
          context: phrasebook.context,
          source: 'phrasebook-fallback',
        };
      }
      throw error;
    }
  }

  function sourceLabel(result) {
    if (result.source === 'phrasebook') {
      return `From app phrasebook${result.context ? ` · ${result.context}` : ''}`;
    }
    if (result.source === 'phrasebook-fallback') {
      return `Closest phrasebook match${result.context ? ` · ${result.context}` : ''}`;
    }
    return 'Machine translation — confirm with a native speaker';
  }

  function appendText(parent, className, text) {
    const node = document.createElement(className.startsWith('translate') ? 'div' : 'div');
    node.className = className;
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function renderResultNode(result) {
    const card = document.createElement('div');
    card.className = 'phrase translate-result';
    appendText(card, 'en', result.en);
    appendText(card, 'pt', result.pt);
    if (result.note) {
      appendText(card, 'note', result.note);
    }
    appendText(card, 'translate-source', sourceLabel(result));
    return card;
  }

  function renderSuggestionNode(match, onSelect) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'translate-suggestion';

    const en = document.createElement('span');
    en.className = 'en';
    en.textContent = match.en;

    const pt = document.createElement('span');
    pt.className = 'pt';
    pt.textContent = match.pt;

    const context = document.createElement('span');
    context.className = 'translate-source';
    context.textContent = match.context;

    button.append(en, pt, context);
    button.addEventListener('click', () => onSelect(match));
    item.appendChild(button);
    return item;
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function renderTranslatePanel(root) {
    if (root.dataset.rendered) {
      return;
    }
    root.dataset.rendered = '1';
    root.innerHTML = `
      <h2 id="translate-heading">English → Portuguese</h2>
      <p class="lead">Type what you want to say in English. The app checks its phrasebook first, then translates online to European Portuguese (pt-PT). Needs internet.</p>
      <form id="translate-form" class="translate-form">
        <label for="translate-input">English</label>
        <textarea id="translate-input" rows="4" placeholder="e.g. Where is the nearest pharmacy?"></textarea>
        <p class="translate-hint">Press Enter to translate. Shift+Enter for a new line.</p>
        <button type="submit" id="translate-submit">Translate</button>
      </form>
      <p id="translate-error" class="translate-error" role="alert" hidden></p>
      <section id="translate-results" class="translate-results" aria-live="polite" hidden>
        <h3>Portuguese</h3>
        <div id="translate-output"></div>
      </section>
      <section id="translate-suggestions" class="translate-suggestions" hidden>
        <h3>Similar phrases in the app</h3>
        <ul id="translate-suggestion-list"></ul>
      </section>
    `;

    const form = root.querySelector('#translate-form');
    const input = root.querySelector('#translate-input');
    const error = root.querySelector('#translate-error');
    const results = root.querySelector('#translate-results');
    const output = root.querySelector('#translate-output');
    const suggestions = root.querySelector('#translate-suggestions');
    const suggestionList = root.querySelector('#translate-suggestion-list');
    const submit = root.querySelector('#translate-submit');

    async function runTranslate() {
      const trimmed = input.value.trim();
      if (!trimmed) {
        return;
      }
      if (trimmed.length > MAX_LENGTH) {
        error.hidden = false;
        error.textContent = `Text must be ${MAX_LENGTH} characters or fewer.`;
        return;
      }

      error.hidden = true;
      results.hidden = false;
      submit.disabled = true;
      submit.textContent = 'Translating…';
      output.replaceChildren();
      const loading = document.createElement('p');
      loading.className = 'translate-hint';
      loading.textContent = 'Working on your translation…';
      output.appendChild(loading);
      suggestions.hidden = true;
      clearNode(suggestionList);

      try {
        const sentences = splitSentences(trimmed);
        const translated = [];
        for (let index = 0; index < sentences.length; index += 1) {
          translated.push(await translateSentence(sentences[index], index));
        }
        clearNode(output);
        translated.forEach((result) => {
          output.appendChild(renderResultNode(result));
        });

        const seen = new Set();
        const unique = lookupEnglish(trimmed)
          .filter((match) => match.match !== 'exact')
          .filter((match) => {
            const key = `${match.en}|${match.pt}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          })
          .slice(0, 5);

        if (unique.length) {
          suggestions.hidden = false;
          unique.forEach((match) => {
            suggestionList.appendChild(
              renderSuggestionNode(match, (selected) => {
                input.value = selected.en;
                clearNode(output);
                output.appendChild(
                  renderResultNode({
                    id: 'suggestion',
                    en: selected.en,
                    pt: selected.pt,
                    note: selected.note,
                    context: selected.context,
                    source: 'phrasebook',
                  }),
                );
                results.hidden = false;
                error.hidden = true;
              }),
            );
          });
        }
      } catch (err) {
        error.hidden = false;
        error.textContent = err instanceof Error ? err.message : 'Something went wrong';
        clearNode(output);
      } finally {
        submit.disabled = false;
        submit.textContent = 'Translate';
      }
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void runTranslate();
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void runTranslate();
      }
    });
  }

  window.renderTranslatePanel = renderTranslatePanel;
})();
