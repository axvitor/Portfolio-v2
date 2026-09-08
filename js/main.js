/* ═══════════════════════════════════════════════════════════
   VITOR — portfolio runtime
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
/* normalised progress of v within [a,b] */
const norm  = (v, a, b) => clamp((v - a) / (b - a));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════ CONTENT ═══════════
   Everything persona-specific lives here — swap freely. */

const PROJECTS = [
  {
    name: 'Careers Page',
    w: 1, h: 1,
    img: 'assets/projects/starbasis/hero-desk.jpg',
    url: 'careers-page.html',
    tag: 'Case study',
    desc: 'A careers page for a creator experience marketplace scaling fast, ahead of a platform pivot. Hero, benefits, team and open positions, all fully responsive, plus a coded interactive version beyond the original deliverable.',
    role: 'Product Designer',
    client: 'StarBasis · Creator marketplace',
    year: '',
    outcome: '',
    art: 'mesh'
  },
  {
    name: 'WCAG Study',
    w: 1, h: 1,
    img: 'assets/projects/wcag/hero.jpg',
    url: 'wcag-study.html',
    tag: 'Study',
    desc: 'A WCAG-compliant redesign of the Uber app, focused on senior users. Contrast ratios, clearer labelling, larger touch targets, and an interface that survives increased font sizes.',
    role: 'UX Researcher & Designer',
    client: 'Uber · Self-initiated',
    year: '2021',
    outcome: '',
    art: 'access'
  },
  {
    name: 'CreatorHub',
    w: 2, h: 1,
    img: 'assets/projects/creatorhub/hero-desk.jpg',
    url: 'creatorhub.html',
    tag: 'Case study',
    desc: 'A marketplace redesign for a company selling experiences, courses and webinars with well known people. Built around trust, with transparent pricing, authentic photography and legible creator information.',
    role: 'Product Designer',
    client: 'Experiences marketplace',
    year: '2025',
    outcome: "The final design landed well with the company's team.",
    art: 'orbit'
  },
  {
    name: 'Element Dashboard',
    w: 1, h: 1,
    img: 'assets/projects/dashboard/hero-desk.jpg',
    url: 'element-dashboard.html',
    tag: 'Case study',
    desc: 'A dashboard redesign built around the numbers users actually needed, with a live activity feed. The metrics driving decisions moved up front instead of sitting several clicks deep.',
    role: 'Product Designer',
    client: 'Element',
    year: '2024 to 2025',
    outcome: 'Within the first day of going live, the clients were already calling it a huge upgrade.',
    art: 'bars'
  },
  {
    name: 'Digital Signage Interfaces',
    w: 2, h: 1,
    img: 'assets/projects/signage/hero.jpg',
    url: 'digital-signage.html',
    tag: 'Case study',
    desc: '40+ fully responsive apps built for the OnSign platform, covering weather, news, exchange rates and social feeds, across landscape, portrait, bar and square screens.',
    role: 'UI Designer',
    client: 'OnSign · Digital signage',
    year: '2019',
    outcome: 'More than 40 interfaces, all 100% responsive.',
    art: 'stack'
  },
  {
    name: 'Gym&Bet',
    w: 1, h: 1,
    img: 'assets/projects/gymbet/hero.jpg',
    url: 'gym-and-bet.html',
    tag: 'Case study',
    desc: 'A mobile app that turns exercise into a friendly bet with friends. Health tracking combined with social competition, designed in two weeks.',
    role: 'Product Designer',
    client: 'Health & fitness',
    year: '',
    outcome: '',
    art: 'wave'
  }
];

const TIMELINE = [
  { yr: '2023 to Now',  role: 'Senior Product Designer', co: 'Awesomic',        type: 'Design talent marketplace',
    /* the 1% line moved to the points below, where it read twice otherwise */
    note: 'Awesomic can be described as a Trello with top talent embedded inside. Companies from all around the world create diverse tasks, and designers work to deliver the best possible results.',
    points: [
      "Rebuilt a client's analytics dashboard around the metrics that drive decisions, and added a real-time sales and disputes monitor. Contributed to 20% more conversions, with users reporting stronger confidence and legibility.",
      'Partnered with engineering and QA through implementation so what shipped matched the approved designs.',
      'Awesomic accepts roughly 1% of the designers who apply.'
    ] },
  { yr: '2022 to 2023', role: 'Product Designer',        co: 'Soap Health',     type: 'Healthtech',
    /* the intake/risk/SOAP sentence moved to the points, where it read twice */
    note: 'Aimed at a better patient history, and better medical decisions taken from it.',
    points: [
      'Integrated patient intake, risk assessment and SOAP note recording into a single flow built to cut diagnostic mistakes.',
      'Paired with engineering through implementation so the clinical detail survived the build.'
    ] },
  { yr: '2021 to 2022', role: 'UI/UX Designer',          co: 'Checklist Fácil', type: 'B2B SaaS',
    /* the PLG / integrations / design-system list moved to the points below */
    note: 'Worked with the product team, with a main focus on user experience.',
    points: [
      'Drove Product-Led Growth initiatives that increased conversions by 30%.',
      'Ran innovation projects and third-party integrations with the product and engineering teams.',
      'Expanded the design system as the product scaled.'
    ] },
  { yr: '2017 to 2021', role: 'UI/UX Designer',          co: 'OnSign',          type: 'Digital signage',
    note: "Head of design, responsible for the whole company's digital products, including the widget for the OnSign platform, website, and system redesign, using User Interface and User Experience methodologies.",
    points: [
      'Designed an ADA-compliant interface live on 800+ screens across San Francisco.',
      'Delivered 40+ responsive signage apps for the platform.',
      'Grew from intern to designer, setting design direction as the product scaled.'
    ] },
  { yr: '2014 to 2015', role: 'Research Project',        co: 'UFSC',            type: 'University research',
    note: 'Development of a new website and visual ID for the LIBRAS department at Universidade Federal de Santa Catarina (Federal University of Santa Catarina).' }
];

const CAPS = [
  ['Product Design',    'Owning a surface end to end, from the fuzzy problem to the shipped, measured thing.'],
  ['UX / UI Design',    'Structure first, then the surface. Flows and hierarchy that hold up under real data.'],
  ['Design Systems',    'Tokens, components and governance built to survive three years and four teams.'],
  ['UX Research',       'Interviews, field studies, usability testing. Enough rigour to be trusted, enough speed to be useful.'],
  ['Prototyping',       'High-fidelity, motion-accurate prototypes. If it can be felt, it can be judged before it is built.'],
  ['Interaction Design','Timing, state and feedback. The layer that decides whether a product feels expensive or cheap.'],
  ['Accessibility',     'WCAG 2.2 as a design constraint, not an audit bolted on at the end. Contrast, touch targets, and layouts that survive a doubled font size.']
];


/* ═══════════ GENERATIVE PROJECT ART ═══════════
   Abstract, on-brand visuals — no stock imagery. */

const A  = '#4A86FF';
const W  = 'rgba(255,255,255,';
const svg = inner =>
  `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
     <rect width="800" height="600" fill="#0a0a0c"/>${inner}</svg>`;

const ART = {
  /* perspective wireframe terrain */
  mesh(){
    let p = '';
    for (let i = 0; i <= 22; i++){
      const t = i / 22, y = 250 + Math.pow(t, 2.1) * 330;
      const sp = 20 + t * 300;
      p += `<line x1="${400 - sp * 1.6}" y1="${y}" x2="${400 + sp * 1.6}" y2="${y}"
             stroke="${W}${(0.07 + t * 0.21).toFixed(3)})" stroke-width="1"/>`;
    }
    for (let i = -11; i <= 11; i++){
      p += `<line x1="${400 + i * 15}" y1="250" x2="${400 + i * 110}" y2="600"
             stroke="${W}${(0.21 - Math.abs(i) * 0.013).toFixed(3)})" stroke-width="1"/>`;
    }
    for (let i = 0; i < 4; i++){
      p += `<circle cx="${180 + i * 150}" cy="${170 - i * 22}" r="${2 + i * 0.7}"
             fill="${i === 2 ? A : W}0.5)"/>`;
    }
    return svg(`
      <line x1="0" y1="250" x2="800" y2="250" stroke="${W}0.22)" stroke-width="1"/>
      <circle cx="400" cy="250" r="160" fill="none" stroke="${A}" stroke-opacity=".28" stroke-width="1"/>
      <circle cx="400" cy="250" r="72"  fill="none" stroke="${W}0.14)" stroke-width="1"/>
      ${p}
      <rect x="384" y="234" width="32" height="32" fill="none" stroke="${A}" stroke-width="1.5"/>`);
  },

  /* concentric orbits + nodes */
  orbit(){
    let p = '';
    for (let r = 60; r <= 340; r += 40)
      p += `<circle cx="400" cy="300" r="${r}" fill="none"
             stroke="${W}${(0.21 - r / 2900).toFixed(3)})" stroke-width="1"/>`;
    for (let i = 0; i < 9; i++){
      const a = (i / 9) * Math.PI * 2 + 0.4, r = 60 + (i % 5) * 60;
      const x = 400 + Math.cos(a) * r, y = 300 + Math.sin(a) * r;
      p += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === 3 ? 6 : 3}"
             fill="${i === 3 ? A : W}0.45)"/>`;
      if (i === 3) p += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16"
             fill="none" stroke="${A}" stroke-opacity=".45" stroke-width="1"/>`;
    }
    for (let i = 0; i < 12; i++){
      const a = (i / 12) * Math.PI * 2;
      p += `<line x1="${400 + Math.cos(a) * 344}" y1="${300 + Math.sin(a) * 344}"
             x2="${400 + Math.cos(a) * 360}" y2="${300 + Math.sin(a) * 360}"
             stroke="${W}0.2)" stroke-width="1"/>`;
    }
    return svg(`${p}<circle cx="400" cy="300" r="4" fill="${A}"/>`);
  },

  /* offset layered planes — design system */
  stack(){
    let p = '';
    for (let i = 6; i >= 0; i--){
      const o = i * 26;
      p += `<rect x="${230 + o * 0.7}" y="${120 + o}" width="330" height="200" rx="3"
             fill="#0d0d10" stroke="${i === 0 ? A : W + (0.12 + (6 - i) * 0.018).toFixed(3) + ')'}"
             ${i === 0 ? 'stroke-opacity=".85"' : ''} stroke-width="1"/>`;
    }
    for (let i = 0; i < 3; i++)
      p += `<rect x="252" y="${142 + i * 22}" width="${140 - i * 42}" height="6" rx="3"
             fill="${W}${0.22 - i * 0.05})"/>`;
    for (let c = 0; c < 4; c++)
      p += `<rect x="${252 + c * 42}" y="230" width="30" height="30" rx="2"
             fill="none" stroke="${c === 1 ? A : W + '0.16)'}" stroke-width="1"/>`;
    return svg(p);
  },

  /* interference wave field */
  wave(){
    let p = '';
    for (let l = 0; l < 26; l++){
      const yb = 90 + l * 17;
      let d = `M -20 ${yb}`;
      for (let x = 0; x <= 840; x += 14){
        const y = yb
          + Math.sin((x / 150) + l * 0.42) * (16 + l * 1.1)
          + Math.sin((x / 47) - l * 0.2) * 4;
        d += ` L ${x} ${y.toFixed(1)}`;
      }
      const hot = l === 13;
      p += `<path d="${d}" fill="none" stroke="${hot ? A : W + (0.07 + (l % 6) * 0.021).toFixed(3) + ')'}"
             stroke-opacity="${hot ? '.8' : '1'}" stroke-width="${hot ? 1.4 : 1}"/>`;
    }
    return svg(p);
  },

  /* dashboard: metric bars + sparkline */
  bars(){
    let p = '';
    for (let i = 0; i < 800; i += 40)
      p += `<line x1="${i}" y1="0" x2="${i}" y2="600" stroke="${W}0.032)" stroke-width="1"/>`;
    for (let i = 0; i < 600; i += 40)
      p += `<line x1="0" y1="${i}" x2="800" y2="${i}" stroke="${W}0.032)" stroke-width="1"/>`;
    const hs = [120, 190, 150, 260, 210, 320, 280, 380, 340, 430];
    hs.forEach((h, i) => {
      const hot = i === 7;
      p += `<rect x="${150 + i * 52}" y="${470 - h}" width="30" height="${h}" rx="2"
             fill="${hot ? A : '#141419'}" fill-opacity="${hot ? '.85' : '1'}"
             stroke="${hot ? A : W + '0.16)'}" stroke-width="1"/>`;
    });
    p += `<line x1="120" y1="470" x2="700" y2="470" stroke="${W}0.28)" stroke-width="1"/>`;
    let d = 'M 150 190';
    hs.forEach((h, i) => { d += ` L ${165 + i * 52} ${330 - h * 0.42}`; });
    p += `<path d="${d}" fill="none" stroke="${A}" stroke-opacity=".55" stroke-width="1.5"/>`;
    p += `<rect x="150" y="90" width="150" height="6" rx="3" fill="${W}0.22)"/>`;
    p += `<rect x="150" y="108" width="86" height="6" rx="3" fill="${W}0.1)"/>`;
    return svg(p);
  },

  /* accessibility: type scale, contrast steps, touch target */
  access(){
    let p = '';
    for (let i = 0; i < 5; i++){
      const h = 10 + i * 11;
      p += `<rect x="120" y="${110 + i * 62}" width="${180 + i * 62}" height="${h}" rx="${h / 2}"
             fill="${W}${(0.1 + i * 0.05).toFixed(3)})"/>`;
    }
    for (let i = 0; i < 6; i++)
      p += `<rect x="${470 + i * 46}" y="110" width="34" height="34" rx="2"
             fill="${W}${(0.06 + i * 0.13).toFixed(3)})" stroke="${W}0.14)" stroke-width="1"/>`;
    p += `<circle cx="600" cy="380" r="60" fill="none" stroke="${A}" stroke-opacity=".5"
           stroke-width="1" stroke-dasharray="5 6"/>`;
    p += `<circle cx="600" cy="380" r="26" fill="none" stroke="${A}" stroke-width="1.6"/>`;
    p += `<line x1="510" y1="380" x2="540" y2="380" stroke="${W}0.3)" stroke-width="1"/>`;
    p += `<line x1="660" y1="380" x2="690" y2="380" stroke="${W}0.3)" stroke-width="1"/>`;
    return svg(p);
  },

  /* routing / node graph */
  flow(){
    const n = [[120,150],[300,90],[300,250],[480,170],[480,380],[660,270],[200,420],[400,500],[640,470]];
    const e = [[0,1],[0,2],[1,3],[2,3],[2,6],[3,4],[3,5],[4,5],[6,7],[7,4],[7,8],[8,5]];
    let p = '';
    for (let i = 0; i < 800; i += 40)
      p += `<line x1="${i}" y1="0" x2="${i}" y2="600" stroke="${W}0.045)" stroke-width="1"/>`;
    for (let i = 0; i < 600; i += 40)
      p += `<line x1="0" y1="${i}" x2="800" y2="${i}" stroke="${W}0.045)" stroke-width="1"/>`;
    e.forEach(([a, b], i) => {
      const [x1, y1] = n[a], [x2, y2] = n[b], mx = (x1 + x2) / 2;
      const hot = i === 3 || i === 6;
      p += `<path d="M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}"
             fill="none" stroke="${hot ? A : W + '0.2)'}"
             stroke-opacity="${hot ? '.7' : '1'}" stroke-width="1"/>`;
    });
    n.forEach(([x, y], i) => {
      const hot = i === 3;
      p += `<rect x="${x - 7}" y="${y - 7}" width="14" height="14"
             fill="#0a0a0c" stroke="${hot ? A : W + '0.35)'}" stroke-width="${hot ? 1.6 : 1}"/>`;
      if (hot) p += `<rect x="${x - 16}" y="${y - 16}" width="32" height="32"
             fill="none" stroke="${A}" stroke-opacity=".3" stroke-width="1"/>`;
    });
    return svg(p);
  }
};

/* ═══════════ RENDER ═══════════ */

if ($('#projects')) $('#projects').innerHTML = PROJECTS.map((p, i) => `
  <li class="bento__item" style="--w:${p.w};--h:${p.h}">
    <a class="bento__link" href="${p.url}" aria-label="${p.name} case study">
      <img class="bento__img" src="${p.img}" alt="" loading="lazy" decoding="async" />
      <span class="bento__scrim" aria-hidden="true"></span>
      <span class="bento__idx mono">${String(i + 1).padStart(2, '0')}</span>
      <span class="bento__body">
        <h3 class="bento__name">${p.name}</h3>
        <span class="bento__meta mono">${[p.client, p.year].filter(Boolean).join(' · ')}</span>
      </span>
    </a>
  </li>`).join('');

if ($('#timeline')) $('#timeline').innerHTML = TIMELINE.map(t => `
  <li class="tl">
    <span class="tl__yr mono">${t.yr}</span>
    <div>
      <h3 class="tl__role">${t.role}</h3>
      <span class="tl__co"><b>${t.co}</b> · ${t.type}</span>
      <p class="tl__note">${t.note}</p>
      ${t.points ? `<ul class="tl__points">${t.points.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
    </div>
  </li>`).join('');

if ($('#caps')) $('#caps').innerHTML = CAPS.map(([t, d], i) => `
  <li class="cap">
    <span class="cap__n mono">${String(i + 1).padStart(2, '0')}</span>
    <h3 class="cap__t">${t}</h3>
    <p class="cap__d">${d}</p>
  </li>`).join('');


/* project pages render their hero visual from the same generators */
const artHost = $('[data-art]');
if (artHost && ART[artHost.dataset.art]) artHost.innerHTML = ART[artHost.dataset.art]();

/* ═══════════ BOOT SEQUENCE ═══════════ */

const video = $('#heroVideo');
const boot  = $('#boot');
const bootFill = $('#bootFill');
const bootPct  = $('#bootPct');

/* The hero belongs to the home page. On a project page none of that markup
   exists, so every side effect below is gated on HAS_HERO — but the
   declarations stay at top level, because the shared scroll loop further
   down calls into them. */
const HAS_HERO = !!(video && boot && $('#heroTrack'));
if (HAS_HERO) document.documentElement.classList.add('is-booting');

let shown = 0, booted = false;
const started = performance.now();

function bufferedRatio(){
  if (!video.duration || !isFinite(video.duration)) return 0;
  try {
    if (!video.buffered.length) return 0;
    return clamp(video.buffered.end(video.buffered.length - 1) / video.duration);
  } catch { return 0; }
}

function bootTick(){
  const elapsed  = (performance.now() - started) / 1000;
  const real     = Math.max(bufferedRatio(), video.readyState >= 3 ? 1 : 0);
  /* never look stuck, never finish before ~0.7s, never hang past 6s */
  const floor    = clamp(elapsed / 6);
  const target   = Math.max(real * 0.9, floor * 0.75, clamp(elapsed / 0.7) * 0.18);
  shown = Math.max(shown, Math.min(target, elapsed < 0.7 ? 0.2 : 1));

  if (real >= 1 || elapsed > 6) shown = lerp(shown, 1, 0.28);

  bootFill.style.width = (shown * 100).toFixed(1) + '%';
  bootPct.textContent  = String(Math.round(shown * 100)).padStart(3, '0');

  if (shown > 0.995){ finishBoot(); return; }
  requestAnimationFrame(bootTick);
}

function finishBoot(){
  if (booted) return;
  booted = true;
  bootFill.style.width = '100%';
  bootPct.textContent = '100';
  boot.classList.add('is-done');
  document.documentElement.classList.remove('is-booting');
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
  setTimeout(() => boot.remove(), 900);
}

if (HAS_HERO){
  if (REDUCED){ finishBoot(); } else { requestAnimationFrame(bootTick); }
  video.load();
} else {
  document.body.classList.add('is-ready');   /* nothing to preload */
}

/* ═══════════ SCROLL-DRIVEN HERO VIDEO ═══════════ */

const track   = $('#heroTrack');
const frame   = $('#heroFrame');
const scrim   = $('#heroScrim');
const copy    = $('#heroCopy');

let heroP = 0, primed = false;

/* iOS/Safari will not honour currentTime until the element has played once. */
function primeVideo(){
  if (primed) return;
  primed = true;
  const p = video.play();
  if (p && p.then) p.then(() => video.pause()).catch(() => {});
  else { try { video.pause(); } catch {} }
}
if (HAS_HERO){
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(ev =>
    addEventListener(ev, primeVideo, { once: true, passive: true }));
  video.addEventListener('loadeddata', () => { try { video.currentTime = 0.001; } catch {} });
}

function heroProgress(){
  const h = track.offsetHeight - innerHeight;
  return h <= 0 ? 0 : clamp(-track.getBoundingClientRect().top / h);
}

/* ── driving the picture ──────────────────────────────────────────────────
   The asset is encoded with a keyframe every 6 frames, so a seek decodes at
   most 5 frames and costs a flat ~6-9ms regardless of how far it jumps. That
   makes position-accurate seeking viable: the picture sits exactly where the
   scroll says, with no lag and no easing.

   (The original export had 2 keyframes across 240 frames, which made seeking
   O(n²) — showing frame N decoded N frames — and forced a playback-rate
   workaround. If the video is ever replaced, re-encode it the same way or
   that comes back. See the README.)

   One seek in flight at a time, always aimed at the latest scroll position and
   re-armed the moment the previous lands: no queue of stale seeks, no wasted
   decode. */

let seeking = false, seekStartedAt = 0, sentTime = -1, raf = 0;
const MIN_STEP = 1 / 60;    /* below a display frame, not worth a seek */
const SEEK_TIMEOUT = 400;   /* watchdog: never deadlock on a lost `seeked` */

function pump(){
  raf = 0;
  const d = video.duration;
  if (!isFinite(d) || video.readyState < 1) return;

  /* a seek is still running — come back next frame rather than piling on */
  if (seeking && performance.now() - seekStartedAt < SEEK_TIMEOUT){ keepPumping(); return; }

  const t = clamp(heroP * (d - 0.05), 0, d - 0.05);
  if (Math.abs(t - sentTime) < MIN_STEP) return;

  seeking = true;
  seekStartedAt = performance.now();
  sentTime = t;
  try { video.currentTime = t; } catch { seeking = false; }
}
function keepPumping(){ if (!raf) raf = requestAnimationFrame(pump); }

if (HAS_HERO){
  video.addEventListener('seeked', () => {
    seeking = false;
    keepPumping();      /* the scroll has probably moved on */
  });
  video.addEventListener('error', () => { seeking = false; });
}

/* ── painting ─────────────────────────────────────────────────────────────
   Only touch a property when its value actually changed; the hero repaints
   on every scroll tick and most of these hold steady between ticks. */

const painted = { so:'', op:'', tr:'' };

function paintHero(p){
  /* Scrim in three beats: heavy while the headline is up and needs contrast,
     lifted once it has gone so the rocket plays unobstructed, then closed to
     black at the end so the hero dissolves into the next section. */
  const so = lerp(
    lerp(0.92, 0.5, norm(p, 0.05, 0.32)),
    1,
    norm(p, 0.62, 1)
  ).toFixed(3);
  if (so !== painted.so){ scrim.style.setProperty('--so', so); painted.so = so; }

  /* No fade-out. The stage stays pinned to the end of the track, so fading
     the video left a full black screen before About scrolled up over it.
     About has an opaque background and sits above the stage, so it simply
     slides over the still-visible frame — no dead space. */

  /* The copy leaves early — within the first couple of screens of scrolling —
     handing the frame to the rocket for the rest of the track. */
  const out = norm(p, 0.05, 0.2);
  const op  = (1 - out).toFixed(3);
  const tr  = `translate3d(0,${(-out * 90).toFixed(1)}px,0) scale(${(1 - out * 0.07).toFixed(4)})`;
  if (op !== painted.op){ copy.style.opacity = op; painted.op = op; }
  if (tr !== painted.tr){ copy.style.transform = tr; painted.tr = tr; }
}

function onScroll(){
  heroP = heroProgress();
  paintHero(heroP);
  keepPumping();
}

if (HAS_HERO && REDUCED){
  video.addEventListener('loadeddata', () => { try { video.currentTime = 2.4; } catch {} });
  frame.style.opacity = 1;
  keepPumping = () => {};
}

/* ═══════════ REVEALS ═══════════ */

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

['[data-reveal]', '.bento__item', '.tl', '.cap', '.cta'].forEach(sel => {
  $$(sel).forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
    io.observe(el);
  });
});

/* ═══════════ PORTRAIT: COLOUR → MONO ═══════════ */

const photo = $('.about__photo');
let grayLast = '';
function scrubPhoto(){
  if (!photo || REDUCED) return;
  const r = photo.getBoundingClientRect();
  if (r.bottom < -100 || r.top > innerHeight + 100) return;

  /* Full colour while it sits in the lower half — the reading position —
     then desaturating as it travels up and out. */
  const centre = r.top + r.height / 2;
  const g = (1 - norm(centre, innerHeight * 0.06, innerHeight * 0.58)).toFixed(3);
  if (g !== grayLast){ photo.style.setProperty('--gray', g); grayLast = g; }
}

/* ═══════════ PROJECT ART PARALLAX ═══════════ */

const artNodes = $$('.bento__img');
function parallaxArt(){
  if (REDUCED) return;
  for (const el of artNodes){
    const r = el.getBoundingClientRect();
    if (r.bottom < -120 || r.top > innerHeight + 120) continue;
    /* -1 (below fold) → 1 (above fold) */
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    el.style.setProperty('--py', (clamp(p, -1, 1) * -26).toFixed(1) + 'px');
  }
}

/* ═══════════ TIMELINE PROGRESS ═══════════ */

const tlEl = $('#timeline');
let tlLast = '';
function scrubTimeline(){
  if (!tlEl) return;
  const r = tlEl.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const p = clamp((innerHeight * 0.65 - r.top) / r.height);
  const v = (p * 100).toFixed(2) + '%';
  if (v !== tlLast){ tlEl.style.setProperty('--tl', v); tlLast = v; }
}

/* ═══════════ NAV ═══════════ */

const nav = $('#nav');
const burger = $('#burger');
const drawer = $('#drawer');

/* The nav stays put — it only changes shape, contracting into the floating
   pill once you leave the top of the page. */
function navState(){
  nav.classList.toggle('is-stuck', scrollY > 40);
}

burger.addEventListener('click', () => {
  const open = drawer.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  $$('a', drawer).forEach((a, i) => a.style.transitionDelay = open ? `${120 + i * 55}ms` : '0ms');
});
$$('a', drawer).forEach(a => a.addEventListener('click', () => {
  drawer.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}));

/* active section in nav */
/* document order matters: activeLink takes the last section past the line */
const sections = ['about', 'experience', 'work'].map(id => $('#' + id)).filter(Boolean);
const navLinks = $$('.nav__links a');
function activeLink(){
  let cur = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= innerHeight * 0.4) cur = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
}

$('#toTop').addEventListener('click', () =>
  scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));

/* ═══════════ MAGNETIC BUTTONS ═══════════ */

if (!REDUCED && matchMedia('(hover:hover) and (pointer:fine)').matches){
  $$('[data-magnetic]').forEach(el => {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const run = () => {
      cx = lerp(cx, tx, 0.18); cy = lerp(cy, ty, 0.18);
      el.style.transform = `translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(run);
      else raf = 0;
    };
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * 0.28;
      ty = (e.clientY - (r.top + r.height / 2)) * 0.42;
      if (!raf) raf = requestAnimationFrame(run);
    });
    el.addEventListener('pointerleave', () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(run);
    });
  });
}

/* ═══════════ FINDINGS CAROUSEL ═══════════
   Follows the WAI tabs pattern: the list of findings is the tablist,
   each finding's copy is its panel, and the evidence panel swaps
   alongside it. Declared top-level; only the call below is gated, so
   nothing here is block-scoped away from other callers. */

function initFindings(root){
  const shots  = $$('[data-fcar-shot]', root);
  const copies = $$('[data-fcar-copy]', root);
  const tabs   = $$('[data-fcar-tab]', root);
  const count  = $('[data-fcar-count]', root);
  const list   = $('[role="tablist"]', root);
  const toggle = $('[data-fcar-playpause]', root);
  /* 2.2.2 Pause, Stop, Hide — a looping clip needs a way to stop it. Under
     reduced motion it starts stopped. */
  let paused = REDUCED;
  const stage  = $('.fcar__shots', root);
  const n = tabs.length;
  if (!n || shots.length !== n || copies.length !== n) return;

  const pad = k => String(k).padStart(2, '0');
  let i = 0;

  const show = (next, focusTab) => {
    i = (next + n) % n;
    shots .forEach((el, k) => el.classList.toggle('is-on', k === i));
    copies.forEach((el, k) => el.classList.toggle('is-on', k === i));
    tabs  .forEach((el, k) => {
      const on = k === i;
      el.classList.toggle('is-on', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      /* roving tabindex — the whole list is one tab stop, arrows move within it */
      el.tabIndex = on ? 0 : -1;
    });
    if (count) count.textContent = `${pad(i + 1)} / ${pad(n)}`;
    /* Only the visible slide's video runs — five looping clips playing behind
       a hidden panel is wasted CPU and battery for something nobody sees. */
    shots.forEach((el, k) => {
      const v = el.querySelector('video');
      if (!v) return;
      if (k === i && !paused) { const p = v.play(); if (p) p.catch(() => {}); }
      else v.pause();
    });
    if (focusTab) tabs[i].focus();
  };

  const PAUSE_ICON = 'M9 5v14M15 5v14';
  const PLAY_ICON  = 'M8 5l11 7-11 7Z';
  const paintToggle = () => {
    if (!toggle) return;
    toggle.querySelector('path').setAttribute('d', paused ? PLAY_ICON : PAUSE_ICON);
    toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  };
  if (toggle){
    toggle.addEventListener('click', () => {
      paused = !paused;
      const v = shots[i] && shots[i].querySelector('video');
      if (v){ if (paused) v.pause(); else { const p = v.play(); if (p) p.catch(() => {}); } }
      paintToggle();
    });
    paintToggle();
  }

  tabs.forEach((tab, k) => tab.addEventListener('click', () => show(k)));

  const prev = $('[data-fcar-prev]', root);
  const next = $('[data-fcar-next]', root);
  if (prev) prev.addEventListener('click', () => show(i - 1));
  if (next) next.addEventListener('click', () => show(i + 1));

  if (list) list.addEventListener('keydown', e => {
    const to = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    show(to, true);
  });

  /* drag / swipe across the evidence panel */
  if (stage){
    let x0 = null;
    stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
    stage.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      /* any real drag ends in a click on the image; don't let it zoom */
      if (Math.abs(dx) > 6) swallowNextClick();
      if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    });
    stage.addEventListener('pointercancel', () => { x0 = null; });
  }

  show(0);
}

$$('[data-fcar]').forEach(initFindings);

/* ═══════════ WIREFRAME TRACK ═══════════
   Native scroll-snap does the scrolling; this only wires the arrows,
   their end states, and pointer dragging on desktop (touch already
   scrolls natively, and hijacking it would be worse than leaving it). */

function initTrack(root){
  const sc   = $('[data-ftrack-scroller]', root);
  const prev = $('[data-ftrack-prev]', root);
  const next = $('[data-ftrack-next]', root);
  if (!sc) return;

  const step = () => {
    const first = sc.firstElementChild;
    if (!first) return sc.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(sc).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };
  const sync = () => {
    const room = sc.scrollWidth - sc.clientWidth;
    /* a viewport wide enough to fit every frame needs no controls at all */
    root.classList.toggle('is-static', room < 2);
    if (prev) prev.disabled = sc.scrollLeft <= 0;
    if (next) next.disabled = sc.scrollLeft >= room - 1;
  };
  const nudge = dir => sc.scrollBy({ left: dir * step(), behavior: REDUCED ? 'auto' : 'smooth' });

  if (prev) prev.addEventListener('click', () => nudge(-1));
  if (next) next.addEventListener('click', () => nudge(1));

  let ticking = false;
  sc.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; sync(); });
  }, { passive: true });

  /* drag with a mouse or pen; touch keeps its native scrolling */
  let from = null, at = 0;
  sc.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    from = e.clientX; at = sc.scrollLeft;
    sc.setPointerCapture(e.pointerId);
  });
  sc.addEventListener('pointermove', e => {
    if (from === null) return;
    sc.scrollLeft = at - (e.clientX - from);
  });
  const release = e => {
    if (from === null) return;
    if (Math.abs(e.clientX - from) > 6) swallowNextClick();
    from = null;
    try { sc.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  sc.addEventListener('pointerup', release);
  sc.addEventListener('pointercancel', release);

  addEventListener('resize', sync, { passive: true });
  sync();
}

$$('[data-ftrack]').forEach(initTrack);

/* ═══════════ LIGHTBOX ═══════════
   Project screenshots are capped so they don't run past the viewport, so
   clicking one has to be able to show it whole. <dialog>.showModal() brings
   focus trapping, Escape and the inert background with it. */

/* A drag on either carousel ends in a click on the image underneath it;
   this swallows that one click so a swipe never opens the lightbox. */
let dragClick = false;
function swallowNextClick(){
  dragClick = true;
  setTimeout(() => { dragClick = false; }, 0);
}

function initLightbox(){
  const shots = $$('.ph__art--photo img, .pshot img, .pshot video, .fcar__shot img, .fcar__shot video');
  if (!shots.length) return;

  /* Best available name: the image's own alt, else its caption, else the
     heading it is paired with. 16 project images still carry alt="". */
  const nameOf = img => {
    if (img.alt) return img.alt;
    const aria = img.getAttribute('aria-label');   /* how a <video> carries its name */
    if (aria) return aria;
    const fig = img.closest('figure');
    const cap = fig && fig.querySelector('figcaption');
    if (cap && cap.textContent.trim()) return cap.textContent.trim();
    const pair = img.closest('.ppair');
    const pt = pair && pair.querySelector('.ppair__t');
    if (pt) return pt.textContent.trim();
    const shot = img.closest('[data-fcar-shot]');
    if (shot){
      const car = shot.closest('[data-fcar]');
      const i = $$('[data-fcar-shot]', car).indexOf(shot);
      const copy = $$('[data-fcar-copy]', car)[i];
      const t = copy && copy.querySelector('.fcar__finding');
      if (t) return t.textContent.trim();
    }
    /* the hero has no alt and no caption of its own — name it for the project */
    if (img.closest('.ph__art')){
      const h1 = $('.ph__title');
      if (h1) return h1.textContent.trim() + ', hero image';
    }
    return 'Project image';
  };

  const dlg = document.createElement('dialog');
  dlg.className = 'lbox';
  dlg.innerHTML =
    '<div class="lbox__in" data-lbox-field>' +
      '<img class="lbox__img" alt="" />' +
      '<video class="lbox__vid" controls loop muted playsinline hidden></video>' +
      '<p class="lbox__cap mono" aria-hidden="true"></p>' +
    '</div>' +
    '<button class="lbox__close" type="button" aria-label="Close image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>' +
    '</button>' +
    '<button class="lbox__step lbox__step--prev" type="button" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>' +
    '</button>' +
    '<button class="lbox__step lbox__step--next" type="button" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" /></svg>' +
    '</button>';
  document.body.append(dlg);

  const big   = $('.lbox__img', dlg);
  const vid   = $('.lbox__vid', dlg);
  const cap   = $('.lbox__cap', dlg);
  const close = $('.lbox__close', dlg);
  const stepPrev = $('.lbox__step--prev', dlg);
  const stepNext = $('.lbox__step--next', dlg);
  let opener = null;   /* the item the modal is currently showing */
  let group = [];      /* the set it can be stepped through */

  /* A set is the zoomable media inside one <section> — the carousel or grid
     you opened from, rather than every image on the page. */
  const groupOf = el => {
    const sec = el.closest('section');
    return sec ? shots.filter(x => x.closest('section') === sec) : [el];
  };

  const show = img => {
    opener = img;
    const name = names.get(img) || nameOf(img);
    const isVideo = img.tagName === 'VIDEO';
    big.hidden = isVideo;
    vid.hidden = !isVideo;
    if (isVideo){
      /* the inline copy keeps running behind the modal otherwise */
      img.pause();
      vid.src = img.currentSrc || img.src;
      vid.setAttribute('aria-label', name);
      const play = vid.play(); if (play) play.catch(() => {});
    } else {
      big.src = img.currentSrc || img.src;
      big.alt = name;
    }
    cap.textContent = name;

    /* Keep the carousel underneath on the same slide, so closing lands the
       reader where they left off — and leaves focus on a visible element. */
    const shot = img.closest('[data-fcar-shot]');
    if (shot){
      const car = shot.closest('[data-fcar]');
      const k = $$('[data-fcar-shot]', car).indexOf(shot);
      const tab = $$('[data-fcar-tab]', car)[k];
      if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    }

    const many = group.length > 1;
    stepPrev.hidden = !many;
    stepNext.hidden = !many;
  };

  const step = dir => {
    if (group.length < 2) return;
    const k = group.indexOf(opener);
    show(group[(k + dir + group.length) % group.length]);
  };

  const open = img => {
    if (dragClick) return;
    group = groupOf(img);
    show(img);
    /* <dialog> makes the background inert but does not stop it scrolling */
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
    close.focus();
  };

  dlg.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    big.removeAttribute('src');
    vid.pause();
    vid.removeAttribute('src');
    if (opener){
      opener.focus();
      /* hand playback back to the slide it came from, if it is still the live one */
      if (opener.tagName === 'VIDEO' && opener.closest('.is-on')){
        const p = opener.play(); if (p) p.catch(() => {});
      }
    }
  });
  close.addEventListener('click', () => dlg.close());
  stepPrev.addEventListener('click', () => step(-1));
  stepNext.addEventListener('click', () => step(1));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'){ e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight'){ e.preventDefault(); step(1); }
  });
  /* clicking the field around the image closes; clicking the image does not */
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.hasAttribute('data-lbox-field')) dlg.close();
  });

  /* Resolve each name BEFORE the loop rewrites aria-label — a <video> carries
     its name there, so deriving it again afterwards would read back
     "Enlarge: ..." and nest the prefix. */
  const names = new Map(shots.map(el => [el, nameOf(el)]));

  shots.forEach(img => {
    img.classList.add('zoom');
    img.setAttribute('role', 'button');
    img.tabIndex = 0;
    img.setAttribute('aria-label', 'Enlarge: ' + names.get(img));
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(img); }
    });
  });
}

initLightbox();

/* ═══════════ MASTER SCROLL LOOP ═══════════ */

let pending = false;
function scrollWork(){
  pending = false;
  if (HAS_HERO) onScroll();   /* hero progress → paint → seek, first: latency matters */
  navState();
  activeLink();
  scrubTimeline();
  scrubPhoto();
  parallaxArt();
}
addEventListener('scroll', () => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(scrollWork);
}, { passive: true });
addEventListener('resize', () => { sentTime = -1; scrollWork(); }, { passive: true });
scrollWork();

})();
