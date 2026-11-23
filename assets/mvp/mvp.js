/* Builds the MVP Project page from MVP_DATA (mvp-data.js) and MVP_COMMITS (mvp-commits.js). */
(function () {
  'use strict';

  const D = window.MVP_DATA;
  const C = window.MVP_COMMITS || {};
  if (!D) return;

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function niceDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }

  function isExternal(href) {
    return /^https?:\/\//.test(href);
  }

  function linkAttrs(item) {
    if (item.download) return ' download';
    return isExternal(item.href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }

  function commitLink(hash) {
    const c = C[hash];
    if (!c) return `<code class="mvp-commit mvp-commit-missing">${esc(hash)}</code>`;
    const label = `${c.merge ? 'Merge commit' : 'Commit'} ${hash}: ${c.subject} (${niceDate(c.date)}). Opens on GitHub in a new tab.`;
    return `<a class="mvp-commit" href="${esc(D.repo)}/commit/${c.sha}" target="_blank" rel="noopener noreferrer"
      title="${esc(c.subject)} · ${esc(niceDate(c.date))}" aria-label="${esc(label)}"><code>${esc(hash)}</code></a>`;
  }

  function commitRow(hashes, label) {
    if (!hashes || !hashes.length) return '';
    return `<div class="mvp-commits"><span class="mvp-commits-label">${esc(label || 'Commits')}</span>${hashes.map(commitLink).join('')}</div>`;
  }

  function fill(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  /* ---- Header ---- */
  const h = D.header;
  document.querySelector('[data-mvp="eyebrow"]').textContent = h.eyebrow;
  document.querySelector('[data-mvp="title"]').textContent = h.title;

  fill('mvpMeta', [
    ['My role', h.role],
    ['Project period', h.period],
    ['Mentor', h.mentor],
    ['Industry partner', h.partner],
    ['Team 8', h.team]
  ].filter(r => r[1]).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join(''));

  fill('mvpSummary', h.summary.map(p => `<p>${esc(p)}</p>`).join(''));

  fill('mvpButtons', h.buttons.map(b =>
    `<a href="${esc(b.href)}" class="${b.primary ? 'btn-primary' : 'btn-secondary'}"${linkAttrs(b)}>${esc(b.label)} <span aria-hidden="true">↗</span><span class="mvp-visually-hidden"> (opens in a new tab)</span></a>`
  ).join(''));

  /* ---- Stat tiles ---- */
  fill('mvpStats', D.stats.map((s, i) => `
    <div class="mvp-stat">
      <div class="stat-num">${esc(s.value)}</div>
      <div class="stat-label">${esc(s.label)}</div>
      <details class="mvp-src">
        <summary aria-label="Source for ${esc(s.label)}">Source</summary>
        <p id="mvp-src-${i}">${esc(s.source)}</p>
      </details>
    </div>`).join(''));

  fill('mvpJump', D.jump.map(j => `<a href="${esc(j.href)}" class="chip mvp-chip-link">${esc(j.label)}</a>`).join(''));

  /* ---- Timeline ---- */
  fill('mvpTimeline', D.timeline.map((t, i) => {
    const docs = (t.docs || []).map(d =>
      `<a class="ext-link" href="${esc(d.href)}"${linkAttrs(d)}>${esc(d.label)}</a>`).join('');
    const count = t.commits === 1 ? '1 commit' : `${t.commits} commits`;
    return `
    <li class="mvp-week fade-up">
      <details${i === D.timeline.length - 1 ? ' open' : ''}>
        <summary>
          <span class="mvp-week-dot" aria-hidden="true"></span>
          <span class="mvp-week-head">
            <span class="mvp-week-top">
              <span class="proto-badge">${esc(t.week)}</span>
              <span class="mvp-week-dates">${esc(t.dates)}</span>
              <span class="mvp-week-count${t.commits ? '' : ' is-zero'}">${esc(count)}</span>
            </span>
            <span class="mvp-week-title">${esc(t.title)}</span>
          </span>
          <span class="mvp-chevron" aria-hidden="true"></span>
        </summary>
        <div class="mvp-week-body">
          <ul class="project-highlights">${t.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
          ${commitRow(t.evidence, 'Evidence')}
          ${docs ? `<div class="mvp-docs">${docs}</div>` : ''}
        </div>
      </details>
    </li>`;
  }).join(''));

  /* ---- Contribution areas ---- */
  fill('mvpAreas', D.areas.map(a => `
    <article class="mvp-card fade-up">
      <h3>${esc(a.title)}</h3>
      <ul class="project-highlights">${a.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${commitRow(a.evidence, 'Key commits')}
    </article>`).join(''));

  /* ---- Evidence ---- */
  fill('mvpLinks', D.evidence.links.map(l => `
    <li>
      <a class="ext-link" href="${esc(l.href)}"${linkAttrs(l)}>${esc(l.label)}${isExternal(l.href) ? '<span class="mvp-visually-hidden"> (opens in a new tab)</span>' : ''}</a>
      <span class="mvp-link-note">${esc(l.note)}</span>
    </li>`).join(''));

  fill('mvpGallery', D.evidence.images.map((g, i) => `
    <figure class="mvp-figure fade-up">
      <button type="button" class="mvp-figure-btn" data-index="${i}" aria-label="Enlarge: ${esc(g.title)}">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" />
      </button>
      <figcaption>${esc(g.title)} · <a href="${esc(g.src)}" target="_blank" rel="noopener noreferrer">open full size</a></figcaption>
    </figure>`).join(''));

  /* ---- Skills & challenges ---- */
  fill('mvpSkills', D.skills.map(s => `
    <div class="mvp-skill-group fade-up">
      <h3>${esc(s.group)}</h3>
      <div class="project-tags">${s.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>`).join(''));

  fill('mvpChallenges', D.challenges.map(c => `
    <article class="mvp-card mvp-challenge fade-up">
      <h4>${esc(c.title)}</h4>
      <dl>
        <div><dt>Challenge</dt><dd>${esc(c.problem)}</dd></div>
        <div><dt>How I solved it</dt><dd>${esc(c.solution)}</dd></div>
        <div class="is-result"><dt>Result</dt><dd>${esc(c.result)}</dd></div>
      </dl>
      ${commitRow(c.evidence, 'Evidence')}
    </article>`).join(''));

  fill('mvpReflection', D.reflection.map(p => `<p>${esc(p)}</p>`).join(''));

  /* ---- Expand / collapse all ---- */
  const expandBtn = document.getElementById('mvpExpandAll');
  const weeks = () => [...document.querySelectorAll('#mvpTimeline details')];
  function syncExpand() {
    const allOpen = weeks().every(d => d.open);
    expandBtn.textContent = allOpen ? 'Collapse all' : 'Expand all';
    expandBtn.setAttribute('aria-expanded', String(allOpen));
  }
  expandBtn.addEventListener('click', () => {
    const open = !weeks().every(d => d.open);
    weeks().forEach(d => { d.open = open; });
    syncExpand();
  });
  weeks().forEach(d => d.addEventListener('toggle', syncExpand));
  syncExpand();

  /* ---- Source tooltips: one open at a time, close on outside click or Escape ---- */
  const srcs = [...document.querySelectorAll('.mvp-src')];
  srcs.forEach(s => s.addEventListener('toggle', () => {
    if (s.open) srcs.forEach(o => { if (o !== s) o.open = false; });
  }));
  document.addEventListener('click', e => {
    srcs.forEach(s => { if (s.open && !s.contains(e.target)) s.open = false; });
  });

  /* ---- Lightbox ---- */
  const box = document.getElementById('mvpLightbox');
  const boxImg = document.getElementById('mvpLightboxImg');
  const boxCap = document.getElementById('mvpLightboxCaption');
  let lastFocus = null;
  document.querySelectorAll('.mvp-figure-btn').forEach(btn => btn.addEventListener('click', () => {
    const g = D.evidence.images[Number(btn.dataset.index)];
    boxImg.src = g.src;
    boxImg.alt = g.alt;
    boxCap.textContent = g.title;
    lastFocus = btn;
    if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', '');
  }));
  function closeBox() {
    if (typeof box.close === 'function') box.close(); else box.removeAttribute('open');
  }
  document.getElementById('mvpLightboxClose').addEventListener('click', closeBox);
  box.addEventListener('click', e => { if (e.target === box) closeBox(); });
  box.addEventListener('close', () => { boxImg.src = ''; if (lastFocus) lastFocus.focus(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') srcs.forEach(s => { s.open = false; });
  });

  /* ---- Shared page behaviour (nav, progress bar, scroll-to-top, fade-in) ---- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const topBtn = document.getElementById('scroll-top');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    topBtn.classList.toggle('visible', y > 400);
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const fades = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    fades.forEach(el => io.observe(el));
  } else {
    fades.forEach(el => el.classList.add('visible'));
  }

  /* Printing shows every week */
  window.addEventListener('beforeprint', () => weeks().forEach(d => { d.open = true; }));
})();
