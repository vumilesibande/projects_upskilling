(function () {
  'use strict';

  const STORAGE_KEY = 'portuguese-lusophone-progress';

  let flashIndex = 0;
  let flashDeck = [...FLASHCARDS];
  let flashFlipped = false;
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function showPanel(id) {
    $$('.panel').forEach((p) => p.classList.toggle('active', p.id === id));
    $$('nav.tabs button').forEach((b) => {
      b.setAttribute('aria-selected', b.dataset.panel === id ? 'true' : 'false');
    });
  }

  function renderHome() {
    const panel = $('#panel-home');
    if (panel.dataset.rendered) return;
    panel.dataset.rendered = '1';
    panel.innerHTML = `
      <h2>Portuguese across Brazil, Mozambique & Angola</h2>
      <p class="lead">Learn shared grammar, compare regional vocabulary, and practise offline — no account, no internet required after first load.</p>
      <div class="flags">
        <div class="flag-card br"><h3>🇧🇷 ${COUNTRIES.br.name}</h3><p>${COUNTRIES.br.speakers} speakers. Open vowels, você, ônibus, legal.</p></div>
        <div class="flag-card mz"><h3>🇲🇿 ${COUNTRIES.mz.name}</h3><p>${COUNTRIES.mz.speakers} speakers. European base + chapa, fixe, African languages.</p></div>
        <div class="flag-card ao"><h3>🇦🇴 ${COUNTRIES.ao.name}</h3><p>${COUNTRIES.ao.speakers} speakers. fixe, bué, telemóvel, kizomba culture.</p></div>
      </div>
      <div class="tip-box">
        <strong>Offline tip</strong>
        Open this site once while online (or via a local server) so the browser saves all files. Then use it without Wi‑Fi. Progress is stored on your device only.
      </div>
    `;
  }

  function renderLessons() {
    const list = $('#lesson-list');
    const detail = $('#lesson-detail');
    if (list.dataset.rendered) return;
    list.dataset.rendered = '1';

    LESSONS.forEach((lesson) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = lesson.title;
      btn.addEventListener('click', () => openLesson(lesson, detail));
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function openLesson(lesson, container) {
    container.classList.add('open');
    let html = `<h3>${lesson.title}</h3>`;
    if (lesson.body) {
      lesson.body.split('\n\n').forEach((p) => {
        html += `<p>${escapeHtml(p)}</p>`;
      });
    }
    if (lesson.phrases) {
      lesson.phrases.forEach((ph) => {
        html += phraseHtml(ph);
      });
    }
    container.innerHTML = html;
    const progress = loadProgress();
    progress.lessons = progress.lessons || {};
    progress.lessons[lesson.id] = true;
    saveProgress(progress);
  }

  function phraseHtml(ph) {
    return `<div class="phrase">
      <div class="pt">${escapeHtml(ph.pt)}</div>
      <div class="en">${escapeHtml(ph.en)}</div>
      ${ph.note ? `<div class="note">${escapeHtml(ph.note)}</div>` : ''}
    </div>`;
  }

  function renderVocabulary() {
    const tbody = $('#vocab-body');
    if (tbody.dataset.rendered) return;
    tbody.dataset.rendered = '1';
    VOCABULARY.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(row.concept)}</td>
        <td class="col-br">${escapeHtml(row.br)}</td>
        <td class="col-mz">${escapeHtml(row.mz)}</td>
        <td class="col-ao">${escapeHtml(row.ao)}</td>
        <td>${escapeHtml(row.note)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderPhrasebook() {
    const container = $('#phrasebook-content');
    if (container.dataset.rendered) return;
    container.dataset.rendered = '1';

    ['br', 'mz', 'ao'].forEach((code) => {
      const block = document.createElement('div');
      block.innerHTML = `<h3>${COUNTRIES[code].label}</h3>`;
      PHRASEBOOK[code].forEach((ph) => {
        block.innerHTML += phraseHtml(ph);
      });
      container.appendChild(block);
    });
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function filterFlashDeck(region) {
    flashDeck = region === 'all' ? [...FLASHCARDS] : FLASHCARDS.filter((c) => c.region === region);
    flashDeck = shuffle(flashDeck);
    flashIndex = 0;
    flashFlipped = false;
    renderFlashcard();
  }

  function renderFlashcard() {
    const card = $('#flashcard');
    if (!flashDeck.length) {
      card.innerHTML = '<p>No cards for this filter.</p>';
      return;
    }
    const item = flashDeck[flashIndex % flashDeck.length];
    const regionName = COUNTRIES[item.region].name;
    card.innerHTML = flashFlipped
      ? `<span class="label">${regionName}</span><span class="main-text">${escapeHtml(item.back)}</span><span class="sub">${escapeHtml(item.hint || '')}</span><span class="sub">Tap to flip back</span>`
      : `<span class="label">${regionName}</span><span class="main-text">${escapeHtml(item.front)}</span><span class="sub">Tap to see the word</span>`;
  }

  function nextFlashcard() {
    flashIndex = (flashIndex + 1) % flashDeck.length;
    flashFlipped = false;
    renderFlashcard();
    const progress = loadProgress();
    progress.flashSeen = (progress.flashSeen || 0) + 1;
    saveProgress(progress);
  }

  function startQuiz() {
    const region = $('#quiz-region').value;
    let pool = region === 'all' ? [...QUIZ_ITEMS] : QUIZ_ITEMS.filter((q) => q.region === region);
    if (!pool.length) pool = [...QUIZ_ITEMS];
    window._quizPool = shuffle(pool);
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    renderQuiz();
  }

  function renderQuiz() {
    const pool = window._quizPool || QUIZ_ITEMS;
    const area = $('#quiz-area');
    if (quizIndex >= pool.length) {
      area.innerHTML = `<p class="quiz-q">Finished!</p><p>Score: ${quizScore} / ${pool.length}</p><button type="button" id="quiz-restart">Try again</button>`;
      $('#quiz-restart')?.addEventListener('click', startQuiz);
      const progress = loadProgress();
      progress.lastQuiz = { score: quizScore, total: pool.length, at: Date.now() };
      saveProgress(progress);
      return;
    }
    const item = pool[quizIndex];
    quizAnswered = false;
    let html = `<p class="quiz-q">${escapeHtml(item.q)}</p><div class="quiz-options">`;
    item.options.forEach((opt, i) => {
      html += `<button type="button" data-idx="${i}">${escapeHtml(opt)}</button>`;
    });
    html += '</div><p class="score-bar">Question ${quizIndex + 1} of ${pool.length} · Score: ${quizScore}</p>';
    area.innerHTML = html;
    area.querySelectorAll('.quiz-options button').forEach((btn) => {
      btn.addEventListener('click', () => answerQuiz(item, parseInt(btn.dataset.idx, 10), btn));
    });
  }

  function answerQuiz(item, chosen, btn) {
    if (quizAnswered) return;
    quizAnswered = true;
    const buttons = $$('.quiz-options button');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === chosen) b.classList.add('wrong');
    });
    if (chosen === item.answer) quizScore++;
    setTimeout(() => {
      quizIndex++;
      renderQuiz();
    }, 900);
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function initTabs() {
    $$('nav.tabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.panel;
        showPanel(id);
        if (id === 'panel-home') renderHome();
        if (id === 'panel-translate' && window.renderTranslatePanel) {
          window.renderTranslatePanel($('#panel-translate'));
        }
        if (id === 'panel-lessons') renderLessons();
        if (id === 'panel-vocab') renderVocabulary();
        if (id === 'panel-phrases') renderPhrasebook();
        if (id === 'panel-practice') {
          filterFlashDeck($('#flash-region').value);
        }
      });
    });
  }

  function initPractice() {
    $('#flash-region').addEventListener('change', (e) => filterFlashDeck(e.target.value));
    $('#flash-next').addEventListener('click', nextFlashcard);
    $('#flashcard').addEventListener('click', () => {
      flashFlipped = !flashFlipped;
      renderFlashcard();
    });
    $('#quiz-start').addEventListener('click', startQuiz);
    filterFlashDeck('all');
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then(() => updateOfflineBadge(true))
      .catch(() => updateOfflineBadge(false));
  }

  function updateOfflineBadge(ready) {
    const badge = $('#offline-status');
    if (!badge) return;
    if (ready) {
      badge.textContent = 'Offline ready';
      badge.classList.add('ready');
    } else if (!navigator.onLine) {
      badge.textContent = 'Offline (cached)';
      badge.classList.add('ready');
    }
  }

  window.addEventListener('online', () => updateOfflineBadge(true));
  window.addEventListener('offline', () => updateOfflineBadge(true));

  function init() {
    renderHome();
    renderLessons();
    renderVocabulary();
    renderPhrasebook();
    initTabs();
    initPractice();
    registerServiceWorker();
    updateOfflineBadge(navigator.onLine);
    showPanel('panel-home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
