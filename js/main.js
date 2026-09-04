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
    name: 'MUNI',
    tag: 'Case study',
    desc: 'Digital signage interface developed to be displayed at bus stops in San Francisco, California, USA. Arrival times and route information for transit riders.',
    role: 'UI/UX Designer',
    client: 'Digital signage · San Francisco',
    year: '2022',
    outcome: '800+ screens deployed. Approved by the client and the City of San Francisco.',
    art: 'flow'
  },
  {
    name: 'Careers Page',
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
    tag: 'Case study',
    desc: 'A dashboard redesign built around the numbers users actually needed, with a live activity feed. The metrics driving decisions moved up front instead of sitting several clicks deep.',
    role: 'Product Designer',
    client: 'Element',
    year: '2024 to 2025',
    outcome: "Within the first day of going out, the client's own team was calling it a huge upgrade.",
    art: 'bars'
  },
  {
    name: 'Digital Signage Interfaces',
    tag: 'Case study',
    desc: '40+ fully responsive apps built for the OnSign TV platform, covering weather, news, exchange rates and social feeds, across landscape, portrait, bar and square screens.',
    role: 'UI Designer',
    client: 'OnSign TV · Digital signage',
    year: '2019',
    outcome: 'More than 40 interfaces, all 100% responsive.',
    art: 'stack'
  },
  {
    name: 'Gym&Bet',
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
    note: 'Awesomic can be described as a Trello with top talent embedded inside. Companies from all around the world create diverse tasks, and designers work to deliver the best possible results. Only 1% of candidates secure a place on the platform.' },
  { yr: '2022 to 2023', role: 'Product Designer',        co: 'Soap Health',     type: 'Healthtech',
    note: 'Integrated patient intake, risk assessment, and SOAP note recording for the optimal user experience, aiming to reduce diagnostic mistakes and provide a better patient history to improve medical decisions.' },
  { yr: '2021 to 2022', role: 'UI/UX Designer',          co: 'Checklist Fácil', type: 'B2B SaaS',
    note: 'Worked with the product team on innovation projects and integration with different platforms, PLG (Product Led Growth), and improvements to the design system with a main focus on user experience.' },
  { yr: '2017 to 2021', role: 'UI/UX Designer',          co: 'OnSign',          type: 'Digital signage',
    note: "Head of design, responsible for the whole company's digital products, including the widget for the OnSign platform, website, and system redesign, using User Interface and User Experience methodologies." },
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

$('#projects').innerHTML = PROJECTS.map((p, i) => `
  <li class="project">
    <div class="project__visual">
      ${ART[p.art]()}
      <span class="pv-scan"></span>
      <span class="project__idx mono">${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</span>
      <span class="project__tag mono">${p.tag}</span>
    </div>
    <div class="project__body">
      <h3 class="project__name">${p.name}</h3>
      <p class="project__desc">${p.desc}</p>
      <dl class="project__meta">
        ${[['Role', p.role], ['Industry', p.client], ['Year', p.year]]
            .filter(([, v]) => v)
            .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
      </dl>
      ${p.outcome ? `<div class="project__out">
        <span class="project__outK">Impact</span>
        <span class="project__outV">${p.outcome}</span>
      </div>` : ''}
    </div>
  </li>`).join('');

$('#timeline').innerHTML = TIMELINE.map(t => `
  <li class="tl">
    <span class="tl__yr mono">${t.yr}</span>
    <div>
      <h3 class="tl__role">${t.role}</h3>
      <span class="tl__co"><b>${t.co}</b> · ${t.type}</span>
      <p class="tl__note">${t.note}</p>
    </div>
  </li>`).join('');

$('#caps').innerHTML = CAPS.map(([t, d], i) => `
  <li class="cap">
    <span class="cap__n mono">${String(i + 1).padStart(2, '0')}</span>
    <h3 class="cap__t">${t}</h3>
    <p class="cap__d">${d}</p>
  </li>`).join('');


/* ═══════════ BOOT SEQUENCE ═══════════ */

const video = $('#heroVideo');
const boot  = $('#boot');
const bootFill = $('#bootFill');
const bootPct  = $('#bootPct');
document.documentElement.classList.add('is-booting');

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

if (REDUCED){ finishBoot(); } else { requestAnimationFrame(bootTick); }
video.load();

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
['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(ev =>
  addEventListener(ev, primeVideo, { once: true, passive: true }));
video.addEventListener('loadeddata', () => { try { video.currentTime = 0.001; } catch {} });

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

video.addEventListener('seeked', () => {
  seeking = false;
  keepPumping();        /* the scroll has probably moved on */
});
video.addEventListener('error', () => { seeking = false; });

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

if (REDUCED){
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

['[data-reveal]', '.project', '.tl', '.cap', '.cta'].forEach(sel => {
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

const artNodes = $$('.project__visual svg');
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

/* ═══════════ MASTER SCROLL LOOP ═══════════ */

let pending = false;
function scrollWork(){
  pending = false;
  onScroll();        /* hero progress → paint → seek, first: latency matters */
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
