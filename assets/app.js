(function () {
  const COURSE = window.COURSE;
  const STORE_KEY = 'sfdo-course-v1';
  const state = Object.assign({ done: {}, quiz: {}, lab: {}, notes: {}, trainer: false, theme: 'light', open: {} },
    JSON.parse(localStorage.getItem(STORE_KEY) || '{}'));
  const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));

  const days = [];
  COURSE.modules.forEach((m, mi) => {
    m.index = mi + 1;
    m.days.forEach(d => { d.module = m; d.n = days.length + 1; d.key = 'd' + d.n; days.push(d); });
  });

  const $ = (s, el = document) => el.querySelector(s);
  const main = $('#main');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- theme / trainer ----------
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
  }
  applyTheme();
  $('#themeBtn').onclick = () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); location.reload(); };
  const tt = $('#trainerToggle');
  tt.checked = state.trainer;
  document.body.classList.toggle('trainer-on', state.trainer);
  tt.onchange = () => { state.trainer = tt.checked; document.body.classList.toggle('trainer-on', tt.checked); save(); };
  $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');

  // ---------- sidebar ----------
  function renderNav(activeN) {
    const nav = $('#moduleNav');
    nav.innerHTML = COURSE.modules.map(m => {
      const done = m.days.filter(d => state.done[d.key]).length;
      const isOpen = state.open[m.index] || (activeN && m.days.some(d => d.n === activeN));
      return `<div class="mod ${isOpen ? 'open' : ''}" data-mod="${m.index}">
        <button class="mod-head">${m.icon} ${esc(m.title)} <small>${done}/${m.days.length}</small></button>
        <div class="mod-days">${m.days.map(d => `
          <a class="day-link ${d.n === activeN ? 'active' : ''}" href="#day-${d.n}" data-search="${esc((d.t + ' ' + (d.tags || []).join(' ')).toLowerCase())}">
            <span class="dot">${state.done[d.key] ? '✅' : d.n}</span><span>${esc(d.t)}</span></a>`).join('')}
        </div></div>`;
    }).join('');
    nav.querySelectorAll('.mod-head').forEach(b => b.onclick = () => {
      const el = b.parentElement; el.classList.toggle('open');
      state.open[el.dataset.mod] = el.classList.contains('open'); save();
    });
    const pct = Math.round(Object.keys(state.done).filter(k => state.done[k]).length / days.length * 100);
    $('#progressPct').textContent = pct + '%';
    $('#progressFill').style.width = pct + '%';
    applySearch();
  }

  function applySearch() {
    const q = $('#search').value.trim().toLowerCase();
    document.querySelectorAll('.day-link').forEach(a => a.classList.toggle('hidden', q && !a.dataset.search.includes(q)));
    if (q) document.querySelectorAll('.mod').forEach(m => m.classList.add('open'));
  }
  $('#search').oninput = applySearch;

  // ---------- helpers ----------
  const codeBlock = (c) => `<div class="code-wrap">${c.title ? `<div class="code-title">📄 ${esc(c.title)}</div>` : '<div class="code-title">&nbsp;</div>'}
    <button class="copy-btn">Copy</button><pre class="code">${esc(c.src.trim())}</pre></div>`;

  function wireCopy(root) {
    root.querySelectorAll('.copy-btn').forEach(b => b.onclick = () => {
      navigator.clipboard.writeText(b.nextElementSibling.textContent);
      b.textContent = 'Copied!'; setTimeout(() => b.textContent = 'Copy', 1200);
    });
  }

  function renderDiagrams() {
    const nodes = main.querySelectorAll('pre.mermaid:not([data-processed])');
    if (!nodes.length) return;
    if (window.mermaid) window.mermaid.run({ nodes }).catch(() => {});
  }
  window.addEventListener('mermaid-ready', renderDiagrams);
  window.addEventListener('mermaid-failed', () => {
    main.querySelectorAll('pre.mermaid').forEach(n => n.insertAdjacentHTML('afterend',
      '<div class="callout warn">Diagram needs an internet connection (Mermaid CDN). The source is shown above.</div>'));
  });

  // ---------- views ----------
  function home() {
    const totalLabs = days.filter(d => d.lab).length;
    const totalQ = days.reduce((a, d) => a + (d.quiz || []).length, 0);
    const next = days.find(d => !state.done[d.key]) || days[0];
    main.innerHTML = `
      <section class="hero">
        <div class="eyebrow" style="color:#cfe6ff">For professionals with ~5 years of Salesforce experience</div>
        <h1>Salesforce DevOps Mastery in 60 Days</h1>
        <p>Go from change sets to fully automated, governed release pipelines. Every day has a plain-English analogy, a visual diagram,
        hands-on code, a quick quiz and a lab. You will build real pipelines with <b>Salesforce CLI</b>, <b>GitHub Actions</b>,
        <b>Azure DevOps</b>, <b>Copado</b> and <b>DevOps Center</b>.</p>
        <a class="btn" href="#day-${next.n}">${state.done.d1 ? '▶ Continue: Day ' + next.n : '▶ Start Day 1'}</a>
        <a class="btn" style="margin-left:8px" href="#setup">🧰 Setup checklist</a>
        <div class="callout info" style="margin-top:16px;background:rgba(255,255,255,.12);border-left-color:#fff;color:#fff">
          📤 <b>Students:</b> bookmark this page — no install needed. Progress stays in your browser.
          Instructors: push to <code>main</code> and share the GitHub Pages URL (see README).
        </div>
        <div class="stats">
          <div class="stat"><b>60</b>Daily sessions</div>
          <div class="stat"><b>${COURSE.modules.length}</b>Modules</div>
          <div class="stat"><b>${totalLabs}</b>Hands-on labs</div>
          <div class="stat"><b>${totalQ}</b>Quiz questions</div>
        </div>
      </section>
      <div class="card">
        <h2>🧭 How each day works</h2>
        <div class="grid">
          <div class="concept"><h4>🎯 Objectives</h4><p>What you will be able to do by the end of the session.</p></div>
          <div class="concept"><h4>💡 Explain it simply</h4><p>An everyday analogy so non-technical learners get the idea first.</p></div>
          <div class="concept"><h4>🖼️ Visual diagram</h4><p>A picture of the flow, so students can see it before they type it.</p></div>
          <div class="concept"><h4>🧠 Key concepts + code</h4><p>The real detail for experienced professionals, with copy-paste snippets.</p></div>
          <div class="concept"><h4>❓ Quick quiz</h4><p>Instant feedback with explanations.</p></div>
          <div class="concept"><h4>🧪 Lab</h4><p>Step-by-step practice with a checklist, a way to verify it and a stretch challenge.</p></div>
        </div>
        <div class="callout info">👩‍🏫 Turn on <b>Trainer mode</b> (top right) to see timings, talking points and discussion prompts for teaching each session.</div>
      </div>
      <h2>📚 Modules</h2>
      <div class="grid">${COURSE.modules.map(m => {
        const done = m.days.filter(d => state.done[d.key]).length;
        return `<div class="card mod-card" style="border-left-color:${m.color}" data-go="${m.days[0].n}">
          <div class="eyebrow">Module ${m.index} · Days ${m.days[0].n}–${m.days[m.days.length - 1].n}</div>
          <h3>${m.icon} ${esc(m.title)}</h3><p>${esc(m.summary)}</p>
          <div class="mini-bar"><div style="width:${done / m.days.length * 100}%"></div></div></div>`;
      }).join('')}</div>`;
    main.querySelectorAll('[data-go]').forEach(c => c.onclick = () => location.hash = 'day-' + c.dataset.go);
    renderNav(0);
  }

  function glossary() {
    main.innerHTML = `<div class="card"><h1>📖 Glossary</h1><p>Plain-English definitions you can share with non-technical learners.</p>
      <input id="gsearch" type="search" placeholder="Filter terms…" style="padding:8px 12px;border-radius:8px;border:1px solid var(--border);width:100%;margin-bottom:10px;background:var(--bg);color:var(--text)">
      <table class="gloss"><tbody>${COURSE.glossary.map(([t, d]) =>
        `<tr data-s="${esc((t + ' ' + d).toLowerCase())}"><td>${esc(t)}</td><td>${d}</td></tr>`).join('')}</tbody></table></div>`;
    $('#gsearch').oninput = e => main.querySelectorAll('tr[data-s]').forEach(r =>
      r.style.display = r.dataset.s.includes(e.target.value.toLowerCase()) ? '' : 'none');
    renderNav(0);
  }

  function setup() {
    const s = COURSE.setup;
    main.innerHTML = `<div class="card"><h1>🧰 Setup checklist (do this before Day 1)</h1>
      <p>${s.intro}</p>
      ${s.items.map((it, i) => `<div class="lab-step ${state.lab['setup-' + i] ? 'checked' : ''}">
        <input type="checkbox" data-k="setup-${i}" ${state.lab['setup-' + i] ? 'checked' : ''}/>
        <div><b>${esc(it[0])}</b><br>${it[1]}${it[2] ? codeBlock({ src: it[2] }) : ''}</div></div>`).join('')}
      </div>`;
    wireChecks(); wireCopy(main); renderNav(0);
  }

  function wireChecks() {
    main.querySelectorAll('input[data-k]').forEach(cb => cb.onchange = () => {
      state.lab[cb.dataset.k] = cb.checked; save();
      cb.closest('.lab-step').classList.toggle('checked', cb.checked);
      const c = $('#labCount'); if (c) c.textContent = labProgress(c.dataset.day);
    });
  }

  function labProgress(n) {
    const d = days[n - 1]; const total = d.lab.steps.length;
    const done = d.lab.steps.filter((_, i) => state.lab[d.key + '-' + i]).length;
    return `${done}/${total} steps`;
  }

  function step(s, d, i) {
    const k = d.key + '-' + i;
    const [text, code] = Array.isArray(s) ? s : [s];
    return `<div class="lab-step ${state.lab[k] ? 'checked' : ''}"><input type="checkbox" data-k="${k}" ${state.lab[k] ? 'checked' : ''}/>
      <div><b>Step ${i + 1}.</b> ${text}${code ? codeBlock({ src: code }) : ''}</div></div>`;
  }

  function lesson(n) {
    const d = days[n - 1];
    if (!d) return home();
    const m = d.module;
    const prev = days[n - 2], next = days[n];
    const isDone = !!state.done[d.key];
    main.innerHTML = `
      <div class="eyebrow">Day ${d.n} of 60 · Module ${m.index}: ${esc(m.title)}</div>
      <h1>${esc(d.t)}</h1>
      <div style="margin-bottom:16px">
        <span class="pill">⏱️ ${d.mins || 90} min</span><span class="pill">🎚️ ${d.level || 'Intermediate'}</span>
        ${(d.tags || []).map(t => `<span class="pill">#${esc(t)}</span>`).join('')}
      </div>

      <div class="card"><h2>🎯 Learning objectives</h2><ul>${d.obj.map(o => `<li>${o}</li>`).join('')}</ul></div>

      <div class="card analogy"><div class="big">${d.analogy.icon}</div>
        <div><div class="eyebrow">💡 Explain it simply (for non-technical learners)</div><p>${d.analogy.text}</p></div></div>

      ${d.diagram ? `<div class="card"><h2>🖼️ Visual: ${esc(d.diagramTitle || 'How it fits together')}</h2>
        <div class="diagram"><pre class="mermaid">${esc(d.diagram.trim())}</pre></div>
        ${d.diagramCaption ? `<div class="diagram-caption">${d.diagramCaption}</div>` : ''}</div>` : ''}

      ${(d.images || []).map(img => {
        const isSvg = /\.svg(\?|$)/i.test(img.src);
        const media = isSvg
          ? `<object class="lesson-img" type="image/svg+xml" data="${esc(img.src)}" aria-label="${esc(img.alt || img.title || 'Lesson illustration')}"></object>`
          : `<img class="lesson-img" src="${esc(img.src)}" alt="${esc(img.alt || img.title || 'Lesson illustration')}"/>`;
        return `<div class="card"><h2>🖼️ ${esc(img.title || 'Visual guide')}</h2>
        ${img.text ? `<p>${img.text}</p>` : ''}
        ${media}
        ${img.caption ? `<div class="diagram-caption">${img.caption}</div>` : ''}
        ${img.credit ? `<div class="img-credit">${img.credit}</div>` : ''}
      </div>`;
      }).join('')}

      ${(d.diagrams || []).map(dg => `<div class="card"><h2>🖼️ ${esc(dg.title || 'Visual')}</h2>
        ${dg.image ? `<img class="lesson-img" src="${esc(dg.image)}" alt="${esc(dg.title || 'Diagram')}" loading="lazy"/>` : ''}
        ${dg.src ? `<div class="diagram"><pre class="mermaid">${esc(dg.src.trim())}</pre></div>` : ''}
        ${dg.caption ? `<div class="diagram-caption">${dg.caption}</div>` : ''}
        ${dg.credit ? `<div class="img-credit">${dg.credit}</div>` : ''}
      </div>`).join('')}

      ${d.walkthrough ? `<div class="card walkthrough"><h2>👣 Step-by-step walkthrough</h2>
        <p style="color:var(--muted);margin-top:0">Follow each step in order. Diagrams show what should look true after the step.</p>
        ${d.walkthrough.map(w => `<div class="wt-step">
          <h3>${w.title}</h3>
          ${w.text ? `<p>${w.text}</p>` : ''}
          ${w.image ? `<img class="lesson-img" src="${esc(w.image)}" alt="${esc(w.title)}" loading="lazy"/>` : ''}
          ${w.diagram ? `<div class="diagram"><pre class="mermaid">${esc(w.diagram.trim())}</pre></div>` : ''}
          ${w.code ? codeBlock(typeof w.code === 'string' ? { src: w.code } : w.code) : ''}
          ${w.tip ? `<div class="callout info">💡 ${w.tip}</div>` : ''}
          ${w.warn ? `<div class="callout warn">⚠️ ${w.warn}</div>` : ''}
        </div>`).join('')}</div>` : ''}

      <div class="card"><h2>🧠 Key concepts</h2><div class="concepts">
        ${d.concepts.map(([h, p]) => `<div class="concept"><h4>${h}</h4><p>${p}</p></div>`).join('')}</div>
        ${(d.code || []).map(codeBlock).join('')}
        ${d.pitfall ? `<div class="callout warn">⚠️ <b>Real-world pitfall:</b> ${d.pitfall}</div>` : ''}
      </div>

      ${d.quiz ? `<div class="card"><h2>❓ Quick check <span class="score" id="score"></span></h2>
        ${d.quiz.map((q, qi) => `<div class="quiz-q" data-qi="${qi}"><p>${qi + 1}. ${q[0]}</p>
          ${q[1].map((o, oi) => `<button class="opt" data-oi="${oi}">${o}</button>`).join('')}
          <div class="why" style="display:none"></div></div>`).join('')}</div>` : ''}

      ${d.lab ? `<div class="card lab"><h2>🧪 Lab: ${esc(d.lab.title)} <span class="pill" id="labCount" data-day="${d.n}">${labProgress(d.n)}</span></h2>
        <p><b>Goal:</b> ${d.lab.goal}</p>
        ${d.lab.steps.map((s, i) => step(s, d, i)).join('')}
        <div class="callout ok">✅ <b>Verify:</b> ${d.lab.verify}</div>
        ${d.lab.challenge ? `<div class="callout info">🏆 <b>Stretch challenge:</b> ${d.lab.challenge}</div>` : ''}
      </div>` : ''}

      ${d.teach ? `<div class="card trainer trainer-only"><h2>👩‍🏫 Trainer notes</h2>
        <ul>${d.teach.map(t => `<li>${t}</li>`).join('')}</ul></div>` : ''}

      <div class="card"><h2>📝 My notes</h2>
        <textarea class="notes" placeholder="Questions, insights, things to try at work… (saved in your browser)">${esc(state.notes[d.key] || '')}</textarea></div>

      <div class="nav-row">
        ${prev ? `<a class="btn secondary" href="#day-${prev.n}">← Day ${prev.n}</a>` : '<span></span>'}
        <button class="btn ${isDone ? 'done' : ''}" id="doneBtn">${isDone ? '✅ Completed' : 'Mark day complete'}</button>
        ${next ? `<a class="btn secondary" href="#day-${next.n}">Day ${next.n} →</a>` : '<span></span>'}
      </div>`;

    // quiz
    const qs = state.quiz[d.key] || {};
    const updateScore = () => {
      const answered = Object.keys(qs).length;
      if (!answered) return;
      const right = Object.entries(qs).filter(([qi, oi]) => d.quiz[qi][2] === oi).length;
      $('#score').textContent = `· ${right}/${d.quiz.length} correct`;
    };
    main.querySelectorAll('.quiz-q').forEach(qEl => {
      const qi = +qEl.dataset.qi; const q = d.quiz[qi];
      const reveal = (oi) => {
        qEl.querySelectorAll('.opt').forEach((b, bi) => {
          b.disabled = true;
          if (bi === q[2]) b.classList.add('correct');
          else if (bi === oi) b.classList.add('wrong');
        });
        const w = qEl.querySelector('.why');
        w.style.display = 'block';
        w.innerHTML = (oi === q[2] ? '✅ Correct. ' : '❌ Not quite. ') + q[3];
      };
      if (qs[qi] !== undefined) reveal(qs[qi]);
      qEl.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        const oi = +b.dataset.oi; qs[qi] = oi; state.quiz[d.key] = qs; save(); reveal(oi); updateScore();
      });
    });
    updateScore();

    wireChecks(); wireCopy(main);
    const ta = $('textarea.notes', main);
    ta.oninput = () => { state.notes[d.key] = ta.value; save(); };
    $('#doneBtn').onclick = () => { state.done[d.key] = !state.done[d.key]; save(); lesson(n); };
    renderNav(n);
    renderDiagrams();
  }

  function route() {
    const h = location.hash.slice(1);
    $('#sidebar').classList.remove('open');
    window.scrollTo(0, 0);
    if (h.startsWith('day-')) lesson(parseInt(h.slice(4), 10));
    else if (h === 'glossary') glossary();
    else if (h === 'setup') setup();
    else home();
  }
  window.addEventListener('hashchange', route);
  route();
})();
