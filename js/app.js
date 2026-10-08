(function () {
  "use strict";

  const P = window.PRAYERS;
  const STORAGE_KEY = "ruzenec.v1";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const STEP_COUNT = 61; // 1 kríž + 1 + 3 + 5 × (1 + 10) + medailón
  const MONTHS = ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"];
  const DAY_NAMES = ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"];

  // ---------- Stav a ukladanie ----------

  const state = loadState();
  let steps = [];
  let rosary = null;
  let beads = []; // { x, y, r, el, halo }
  let wakeLock = null;
  let toastTimer = null;
  let undoProgress = null;
  let savedTimer = null;

  function loadState() {
    const fallback = {
      settings: { fullText: true, vibrate: true, keepAwake: true, theme: "auto" },
      session: null, // { rosaryId, progress, startedAt, updatedAt }
      completed: 0,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        settings: { ...fallback.settings, ...(parsed.settings || {}) },
      };
    } catch (e) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* súkromné okno / plné úložisko – appka funguje ďalej bez ukladania */
    }
  }

  // ---------- Kroky ruženca ----------

  function zdravas(formula) {
    return { ...P.zdravas, key: "zdravas", formula, text: P.zdravas.text.replace("{T}", formula) };
  }

  function buildSteps(r) {
    const s = [];
    s.push({ bead: "cross", section: "Úvod", label: "Na kríži", parts: [P.znamenieKriza, P.verim] });
    s.push({ bead: "large", section: "Úvod", label: "Otče náš", parts: [P.otceNas] });
    window.INTRO_MYSTERIES.forEach((f, i) => {
      s.push({ bead: "small", section: "Úvod", label: `Zdravas ${i + 1} / 3`, count: [i + 1, 3], formula: f, parts: [zdravas(f)] });
    });
    r.mysteries.forEach((m, d) => {
      const before = d === 0 ? [P.slava] : [P.slava, P.fatima];
      s.push({
        bead: "large",
        decade: d,
        mystery: m,
        section: `${d + 1}. desiatok`,
        label: "Tajomstvo a Otče náš",
        parts: [...before, { name: `${d + 1}. tajomstvo`, text: m.title, formula: m.formula, announce: true }, P.otceNas],
      });
      for (let n = 0; n < 10; n++) {
        s.push({
          bead: "small",
          decade: d,
          mystery: m,
          section: `${d + 1}. desiatok`,
          label: `Zdravas ${n + 1} / 10`,
          count: [n + 1, 10],
          formula: m.formula,
          parts: [zdravas(m.formula)],
        });
      }
    });
    s.push({ bead: "medal", section: "Záver", label: "Záverečné modlitby", parts: [P.slava, P.fatima, P.salve, P.znamenieKriza] });
    return s;
  }

  // ---------- Geometria ruženca ----------
  // Kroky 0–5 sú na prívesku (kríž → veľká → 3 malé → veľká),
  // kroky 6–59 tvoria slučku (5 × 10 malých + 4 veľké), krok 60 je medailón.

  const C = { x: 180, y: 165 };
  const R = 140;
  const SIZE = { small: 6.5, large: 10, medal: 12, cross: 22 };

  function layout(stepList) {
    const pos = new Array(stepList.length);

    // Prívesok (zhora nadol: veľká, malé, veľká, kríž)
    pos[5] = { x: C.x, y: 340 };
    pos[4] = { x: C.x, y: 365 };
    pos[3] = { x: C.x, y: 383 };
    pos[2] = { x: C.x, y: 401 };
    pos[1] = { x: C.x, y: 428 };
    pos[0] = { x: C.x, y: 468 };

    // Slučka – rozostupy, veľké guľôčky majú viac miesta
    const loop = stepList.slice(6, stepList.length - 1);
    const GAP = 1.7;
    let u = GAP;
    const units = [];
    loop.forEach((st, k) => {
      if (k > 0) {
        const bigNeighbour = st.bead === "large" || loop[k - 1].bead === "large";
        u += bigNeighbour ? 1.45 : 1;
      }
      units.push(u);
    });
    const total = u + GAP;
    units.forEach((val, k) => {
      const theta = (Math.PI / 2) - (val / total) * Math.PI * 2;
      pos[6 + k] = { x: C.x + R * Math.cos(theta), y: C.y + R * Math.sin(theta) };
    });

    // Medailón dole na slučke
    pos[stepList.length - 1] = { x: C.x, y: C.y + R };
    return pos;
  }

  function el(tag, attrs, parent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function renderRosary() {
    const svg = document.getElementById("rosary");
    svg.innerHTML = "";

    // Šnúrka
    el("circle", { cx: C.x, cy: C.y, r: R, class: "cord" }, svg);
    el("line", { x1: C.x, y1: C.y + R, x2: C.x, y2: 446, class: "cord" }, svg);

    // Text v strede
    const center = el("g", { class: "center-text", "aria-hidden": "true" }, svg);
    el("text", { x: C.x, y: 138, class: "c-big" }, center);
    el("text", { x: C.x, y: 168, class: "c-count" }, center);
    el("text", { x: C.x, y: 200, class: "c-myst" }, center);
    el("text", { x: C.x, y: 219, class: "c-myst" }, center);

    const pos = layout(steps);
    beads = steps.map((st, i) => {
      const p = pos[i];
      const g = el("g", { class: `bead bead-${st.bead}`, "data-i": i }, svg);
      const r = SIZE[st.bead];
      const halo = el("circle", { cx: p.x, cy: p.y, r: r + 7, class: "halo" }, g);
      if (st.bead === "cross") {
        el("path", {
          d: `M${p.x} ${p.y - 22}V${p.y + 24}M${p.x - 13} ${p.y - 8}H${p.x + 13}`,
          class: "body cross-shape",
        }, g);
      } else if (st.bead === "medal") {
        el("rect", { x: p.x - 10, y: p.y - 10, width: 20, height: 20, rx: 6, transform: `rotate(45 ${p.x} ${p.y})`, class: "body" }, g);
        el("circle", { cx: p.x, cy: p.y, r: 2.6, class: "medal-mark" }, g);
      } else {
        el("circle", { cx: p.x, cy: p.y, r, class: "body" }, g);
      }
      return { x: p.x, y: p.y, r, g, halo };
    });
  }

  function nearestBead(evt) {
    const svg = document.getElementById("rosary");
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const m = svg.getScreenCTM();
    if (!m) return -1;
    const p = pt.matrixTransform(m.inverse());
    let best = -1;
    let bestD = Infinity;
    beads.forEach((b, i) => {
      const d = Math.hypot(b.x - p.x, b.y - p.y) - b.r;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return bestD < 16 ? best : -1;
  }

  // ---------- Vykreslenie stavu ----------

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function partHtml(part) {
    const full = state.settings.fullText;
    if (part.announce) {
      return `<section class="part announce">
        <h3>${escapeHtml(part.name)}</h3>
        <p class="announce-title">${escapeHtml(part.text)}</p>
        <p class="announce-formula">Ježiš, ${escapeHtml(part.formula)}</p>
      </section>`;
    }
    let body = "";
    if (part.key === "zdravas") {
      const marked = `<mark>${escapeHtml(part.formula)}</mark>`;
      body = full
        ? escapeHtml(P.zdravas.text).replace("{T}", marked)
        : `… plod tvojho života, Ježiš, ${marked}. Svätá Mária…`;
      return `<section class="part"><h3>${escapeHtml(part.name)}</h3><p>${body}</p></section>`;
    }
    body = full ? `<p>${escapeHtml(part.text)}</p>` : "";
    return `<section class="part${full ? "" : " compact"}"><h3>${escapeHtml(part.name)}</h3>${body}</section>`;
  }

  function wrapLines(text, max) {
    const words = text.split(" ");
    const lines = [""];
    words.forEach((w) => {
      const cur = lines[lines.length - 1];
      if (cur && (cur + " " + w).length > max) lines.push(w);
      else lines[lines.length - 1] = cur ? cur + " " + w : w;
    });
    if (lines.length > 2) lines[1] = lines.slice(1).join(" ").slice(0, max - 1) + "…";
    return lines.slice(0, 2);
  }

  function render() {
    const progress = state.session.progress;
    const finished = progress >= steps.length;
    const cur = finished ? steps[steps.length - 1] : steps[progress];

    beads.forEach((b, i) => {
      b.g.classList.toggle("done", i < progress);
      b.g.classList.toggle("current", i === progress);
      const st = steps[i];
      b.g.setAttribute("aria-label", `${st.section}: ${st.label}${i < progress ? " – pomodlené" : ""}`);
    });

    // Stred ruženca
    const t = document.querySelectorAll("#rosary .center-text text");
    t[0].textContent = finished ? "Amen" : cur.section;
    t[1].textContent = finished ? "dokončené" : cur.count ? `${cur.count[0]} / ${cur.count[1]}` : cur.label;
    const myst = !finished && cur.mystery ? wrapLines(cur.mystery.title, 24) : [];
    t[2].textContent = myst[0] || "";
    t[3].textContent = myst[1] || "";

    // Text modlitby
    const card = document.getElementById("text-card");
    card.innerHTML = `
      <div class="card-head">
        <span class="card-section">${escapeHtml(cur.section)}</span>
        <span class="card-label">${escapeHtml(cur.label)}</span>
        <span class="card-step">${Math.min(progress + 1, steps.length)} / ${steps.length}</span>
      </div>
      ${cur.parts.map(partHtml).join("")}`;
    card.scrollTop = 0;

    document.getElementById("progress-fill").style.width = `${(progress / steps.length) * 100}%`;
    document.getElementById("prev-btn").disabled = progress === 0;
    const next = document.getElementById("next-btn");
    next.disabled = finished;
    next.textContent = progress === steps.length - 1 ? "Amen ✓" : "Pomodlené ✓";
  }

  function flashSaved() {
    const s = document.getElementById("pray-saved");
    s.classList.add("show");
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => s.classList.remove("show"), 1200);
  }

  // ---------- Pohyb v ruženci ----------

  function setProgress(p, { undoable = false, message = "" } = {}) {
    const before = state.session.progress;
    p = Math.max(0, Math.min(steps.length, p));
    if (p === before) return;
    state.session.progress = p;
    state.session.updatedAt = Date.now();

    if (p >= steps.length && before < steps.length) {
      state.completed = (state.completed || 0) + 1;
    }
    saveState();
    render();
    flashSaved();

    if (state.settings.vibrate && navigator.vibrate) navigator.vibrate(p > before ? 12 : [8, 40, 8]);

    if (undoable) showToast(message, before);
    if (p >= steps.length) showDone();
  }

  function tapBead(i) {
    const progress = state.session.progress;
    if (i === progress - 1) {
      // Opätovné ťuknutie na poslednú pomodlenú guľôčku ju odznačí
      setProgress(i);
    } else {
      const jump = Math.abs(i + 1 - progress) > 1;
      setProgress(i + 1, {
        undoable: jump,
        message: `Pomodlené až po: ${steps[i].section} – ${steps[i].label}`,
      });
    }
  }

  function showToast(text, prev) {
    undoProgress = prev;
    document.getElementById("toast-text").textContent = text;
    const t = document.getElementById("toast");
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
  }

  function hideToast() {
    document.getElementById("toast").hidden = true;
    undoProgress = null;
  }

  function showDone() {
    const n = state.completed || 0;
    document.getElementById("done-text").textContent =
      `${rosary.name} – pomodlené. ` + (n > 1 ? `Spolu už ${n} ružencov.` : "");
    document.getElementById("done").hidden = false;
  }

  // ---------- Obrazovky ----------

  function show(id) {
    document.getElementById("home").hidden = id !== "home";
    document.getElementById("pray").hidden = id !== "pray";
  }

  function timeAgo(ts) {
    const min = Math.round((Date.now() - ts) / 60000);
    if (min < 1) return "práve teraz";
    if (min < 60) return `pred ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `pred ${h} h`;
    const d = Math.round(h / 24);
    return d === 1 ? "včera" : `pred ${d} dňami`;
  }

  function describePosition(session) {
    const r = window.ROSARIES.find((x) => x.id === session.rosaryId);
    const st = buildSteps(r)[session.progress];
    return { r, text: st ? `${st.section} · ${st.label}` : "" };
  }

  function renderHome() {
    const today = new Date().getDay();
    const s = state.session;
    const active = s && window.ROSARIES.some((r) => r.id === s.rosaryId) && s.progress < STEP_COUNT;

    const cont = document.getElementById("continue");
    cont.hidden = !active;
    if (active) {
      const { r, text } = describePosition(s);
      document.getElementById("continue-title").textContent = r.name;
      document.getElementById("continue-meta").textContent = `${text} · ${timeAgo(s.updatedAt)}`;
      cont.dataset.rosary = r.id;
      const pct = Math.round((s.progress / STEP_COUNT) * 100);
      cont.style.setProperty("--pct", pct);
      document.getElementById("continue-pct").textContent = `· ${pct} %`;
    }

    const now = new Date();
    document.getElementById("today-date").textContent =
      `${DAY_NAMES[today]}, ${now.getDate()}. ${MONTHS[now.getMonth()]}`;

    const list = document.getElementById("rosary-list");
    list.innerHTML = "";
    window.ROSARIES.forEach((r, idx) => {
      const isToday = r.days.includes(today);
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="rosary-item${isToday ? " today" : ""}" data-rosary="${r.id}">
          <span class="num" aria-hidden="true">${["I", "II", "III", "IV"][idx]}</span>
          <span class="ri-main">
            <span class="ri-name">${r.name}${isToday ? ` <span class="badge">dnes</span>` : ""}</span>
            <span class="ri-days">${r.days.map((d) => DAY_NAMES[d]).join(" · ")}</span>
          </span>
          <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>`;
      li.querySelector("button").addEventListener("click", () => startRosary(r.id));
      list.appendChild(li);
    });

    document.getElementById("set-fulltext").checked = state.settings.fullText;
    document.getElementById("set-vibrate").checked = state.settings.vibrate;
    document.getElementById("set-awake").checked = state.settings.keepAwake;
  }

  function startRosary(id) {
    const s = state.session;
    const inProgress = s && s.progress > 0 && s.progress < STEP_COUNT;
    if (inProgress && s.rosaryId === id) return openPray(true);
    if (inProgress) {
      const { r, text } = describePosition(s);
      if (!confirm(`Máš rozrobený ${r.name} (${text}).\nZačať nový ruženec namiesto neho?`)) return;
    }
    state.session = { rosaryId: id, progress: 0, startedAt: Date.now(), updatedAt: Date.now() };
    saveState();
    openPray(true);
  }

  function openPray(pushHistory) {
    rosary = window.ROSARIES.find((r) => r.id === state.session.rosaryId);
    steps = buildSteps(rosary);
    document.getElementById("pray-name").textContent = rosary.name;
    document.body.dataset.rosary = rosary.id;
    document.getElementById("done").hidden = true;
    hideToast();
    renderRosary();
    render();
    show("pray");
    if (pushHistory) history.pushState({ screen: "pray" }, "");
    applyWakeLock();
  }

  function goHome() {
    releaseWakeLock();
    delete document.body.dataset.rosary;
    renderHome();
    show("home");
  }

  // ---------- Svetlý / tmavý režim ----------

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    const t = state.settings.theme;
    return t === "dark" || (t !== "light" && darkQuery.matches);
  }

  function applyTheme() {
    const t = state.settings.theme;
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;

    const color = isDark() ? "#151412" : "#f7f5f0";
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
    document.querySelectorAll('input[name="theme"]').forEach((r) => (r.checked = r.value === t));
    document.getElementById("theme-btn").setAttribute("aria-pressed", String(isDark()));
  }

  function setTheme(t) {
    state.settings.theme = t;
    saveState();
    applyTheme();
  }

  // ---------- Nevypínať obrazovku ----------

  async function applyWakeLock() {
    const btn = document.getElementById("awake-btn");
    btn.setAttribute("aria-pressed", String(state.settings.keepAwake));
    btn.hidden = !("wakeLock" in navigator);
    if (!state.settings.keepAwake || !("wakeLock" in navigator)) return releaseWakeLock();
    if (document.getElementById("pray").hidden || wakeLock) return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => (wakeLock = null));
    } catch (e) {
      wakeLock = null;
    }
  }

  function releaseWakeLock() {
    if (wakeLock) wakeLock.release().catch(() => {});
    wakeLock = null;
  }

  // ---------- Udalosti ----------

  function bind() {
    document.getElementById("rosary").addEventListener("click", (e) => {
      const i = nearestBead(e);
      if (i >= 0) tapBead(i);
    });
    document.getElementById("next-btn").addEventListener("click", () => setProgress(state.session.progress + 1));
    document.getElementById("prev-btn").addEventListener("click", () => setProgress(state.session.progress - 1));
    document.getElementById("back-home").addEventListener("click", () => history.back());
    document.getElementById("continue-btn").addEventListener("click", () => openPray(true));

    document.getElementById("toast-undo").addEventListener("click", () => {
      const p = undoProgress;
      hideToast();
      if (p !== null) {
        document.getElementById("done").hidden = true;
        setProgress(p);
      }
    });

    document.getElementById("done-home").addEventListener("click", () => history.back());
    document.getElementById("done-review").addEventListener("click", () => {
      document.getElementById("done").hidden = true;
      setProgress(steps.length - 1);
    });

    document.getElementById("theme-btn").addEventListener("click", () => setTheme(isDark() ? "light" : "dark"));
    document.querySelectorAll('input[name="theme"]').forEach((r) =>
      r.addEventListener("change", () => setTheme(r.value))
    );
    darkQuery.addEventListener("change", applyTheme);

    document.getElementById("awake-btn").addEventListener("click", () => {
      state.settings.keepAwake = !state.settings.keepAwake;
      saveState();
      applyWakeLock();
    });

    [["set-fulltext", "fullText"], ["set-vibrate", "vibrate"], ["set-awake", "keepAwake"]].forEach(([id, key]) => {
      document.getElementById(id).addEventListener("change", (e) => {
        state.settings[key] = e.target.checked;
        saveState();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (document.getElementById("pray").hidden || e.target.closest("button, input")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setProgress(state.session.progress + 1);
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        setProgress(state.session.progress - 1);
      }
    });

    window.addEventListener("popstate", () => {
      if (!document.getElementById("pray").hidden) goHome();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        applyWakeLock();
      } else if (state.session) {
        saveState();
      }
    });
  }

  // ---------- Štart ----------

  bind();
  applyTheme();
  const s = state.session;
  const resumable = s && window.ROSARIES.some((r) => r.id === s.rosaryId) && s.progress > 0 && s.progress < STEP_COUNT;
  renderHome();
  if (resumable) {
    // Otvorenie appky ťa vráti presne tam, kde si prestal/a
    history.replaceState({ screen: "home" }, "");
    openPray(true);
  } else {
    show("home");
  }

  // Požiadať prehliadač, aby uloženú pozíciu nemazal pri nedostatku miesta
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
