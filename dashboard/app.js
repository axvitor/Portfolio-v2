/* =========================================================
   Element Dashboard — data, charts, motion
   Hand-drawn SVG, no chart library.
   All figures are demo data.
   ========================================================= */

const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const raf = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = n =>
  n >= 1e6 ? +(n / 1e6).toFixed(1) + 'M' :
  n >= 1e3 ? +(n / 1e3).toFixed(n % 1e3 ? 1 : 0) + 'k' : String(n);

/* =========================================================
   DATA — one bundle per period
   ========================================================= */
const PERIODS = ['Today', 'Week', 'Month', 'Year'];

// the phone layout swaps in its own geometry and its own Month series
const MQ_MOBILE = matchMedia('(max-width: 640px)');
const isMobile = () => MQ_MOBILE.matches;

const REVENUE_DATA = {
  Today: {
    total: 12480.55,
    labels: ['9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p'],
    values: [620, 1180, 1540, 980, 1720, 2040, 1360, 1610, 1430],
    caps:   [180, 220, 260, 190, 240, 300, 210, 250, 280],
  },
  Week: {
    total: 68940.20,
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    values: [5400, 9200, 11800, 8600, 13400, 12200, 7100],
    caps:   [900, 1200, 1400, 1100, 1600, 1500, 1000],
  },
  Month: {
    labels: ['1–5', '6–10', '11–15', '16–20', '21–25', '26–31'],
    total: 289610.40,
    values: [38200, 52400, 46800, 61200, 44600, 58900],
    caps:   [6200, 7100, 6600, 8200, 6400, 7800],
  },
  Year: {
    total: 335274.94,
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [14000, 20200, 23400, 17200, 17600, 9000, 10400, 18400, 24400, 20600, 33000, 21400],
    caps:   [3200, 3000, 3000, 3000, 3200, 3400, 3800, 3000, 3000, 3000, 3800, 4000],
  },
};

// on a phone "Month" reads as the last six months, matching the app design
const MOBILE_REVENUE_DATA = {
  Month: {
    total: 335274.94,
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
    values: [1020, 1580, 2280, 1880, 2860, 2040],
    caps:   [140, 110, 190, 120, 200, 160],
  },
};

const SERIES_META = [
  { key: 'transactions', name: 'Transactions', color: '#3DC79A', fill: true },
  { key: 'customers',    name: 'Customers',    color: '#F2A65A', fill: false },
  { key: 'subscribers',  name: 'Subscribers',  color: '#67C9CE', fill: false },
];

const OVERVIEW_DATA = {
  Today: {
    labels: ['9a', '11a', '1p', '3p', '5p', '7p', '9p'],
    series: [[4, 9, 7, 14, 21, 17, 11], [2, 5, 4, 9, 7, 6, 8], [0, 1, 1, 3, 4, 4, 6]],
    metrics: [{ v: 37, d: 55 }, { v: 21, d: 12 }, { v: 8, d: -12 }],
  },
  Week: {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    series: [[112, 96, 118, 143, 208, 216, 154], [64, 88, 71, 104, 76, 68, 73], [18, 24, 29, 34, 41, 47, 55]],
    metrics: [{ v: 264, d: 18 }, { v: 148, d: 9 }, { v: 42, d: -4 }],
  },
  Month: {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
    series: [[420, 512, 466, 604, 548], [268, 244, 312, 286, 330], [86, 104, 121, 138, 162]],
    metrics: [{ v: 1104, d: 24 }, { v: 612, d: 6 }, { v: 186, d: 31 }],
  },
  Year: {
    labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'],
    series: [[820, 1140, 980, 1320, 1680, 2140, 1760], [560, 610, 720, 690, 880, 940, 1010],
             [180, 240, 310, 390, 480, 610, 690]],
    metrics: [{ v: 11248, d: 41 }, { v: 6402, d: 15 }, { v: 2071, d: 22 }],
  },
};

const ACTIVITY = [
  { icon: 'i-doc',      name: 'Mary Falk',               text: 'Opened a dispute',             time: 'just now' },
  { icon: 'i-userplus', name: 'Mark Scott',              text: 'Purchased a new subscription', time: 'just now' },
  { icon: 'i-bag',      name: 'Michael Fay (Affiliate)', text: 'Someone purchased NBA Weekly', time: 'just now' },
  { icon: 'i-userplus', name: 'Mark Scott',              text: 'Purchased a new subscription', time: 'just now' },
  { icon: 'i-bag',      name: 'Michael Fay (Affiliate)', text: 'Someone purchased NBA Weekly', time: '1h ago' },
  { icon: 'i-userplus', name: 'Mark Scott',              text: 'Purchased a new subscription', time: '1h ago' },
  { icon: 'i-userplus', name: 'Mark Scott',              text: 'Purchased a new subscription', time: '1h ago' },
  { icon: 'i-bag',      name: 'Michael Fay (Affiliate)', text: 'Someone purchased NBA Weekly', time: '1h ago' },
  { icon: 'i-bag',      name: 'Michael Fay (Affiliate)', text: 'Someone purchased NBA Weekly', time: '1h ago' },
  { icon: 'i-bag',      name: 'Michael Fay (Affiliate)', text: 'Someone purchased NBA Weekly', time: 'just now' },
  { icon: 'i-doc',      name: 'Mary Falk',               text: 'Opened a dispute',             time: '2h ago' },
  { icon: 'i-userplus', name: 'Mark Scott',              text: 'Purchased a new subscription', time: '2h ago' },
];

/* =========================================================
   AXIS HELPERS
   ========================================================= */
// "nice" ceiling + step so an axis always lands on round numbers
function niceScale(max, targetTicks = 4) {
  if (max <= 0) return { max: 1, step: 1 };
  const rough = max / targetTicks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].find(m => m * mag >= rough) * mag;
  return { max: Math.ceil(max / step) * step, step };
}
const ticksFor = ({ max, step }) => {
  const out = [];
  for (let v = 0; v <= max + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
};

/* =========================================================
   TOOLTIP
   ========================================================= */
function makeTip(host) {
  const tip = document.createElement('div');
  tip.className = 'tip';
  host.appendChild(tip);
  return {
    show(html, x, y) {
      tip.innerHTML = html;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
      tip.classList.add('is-on');
    },
    hide() { tip.classList.remove('is-on'); },
  };
}

/* =========================================================
   1. REVENUE BAR CHART
   ========================================================= */
const BAR_VB        = { w: 1000, h: 268 };
const BAR_VB_MOBILE = { w: 380,  h: 300 };

function barChart(host, data) {
  host.querySelector('svg')?.remove();
  const phone = isMobile();

  const { w: W, h: H } = phone ? BAR_VB_MOBILE : BAR_VB;
  const pad = phone ? { t: 10, r: 42, b: 34, l: 2 } : { t: 8, r: 62, b: 30, l: 4 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;

  const peak = Math.max(...data.values.map((v, i) => v + data.caps[i]));
  const scale = niceScale(peak);
  const y = v => pad.t + plotH * (1 - v / scale.max);

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img',
                          'aria-label': 'Revenue per period' });

  ticksFor(scale).forEach(t => {
    svg.appendChild(el('line', {
      x1: pad.l, x2: pad.l + plotW, y1: y(t), y2: y(t),
      stroke: '#D8DDE5', 'stroke-width': 1, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round',
    }));
    const label = el('text', { x: pad.l + plotW + 18, y: y(t) + 4, class: 'axis-label' });
    label.textContent = t === 0 ? '0' : compact(t);
    svg.appendChild(label);
  });

  const n = data.values.length;
  const slot = plotW / n;
  // desktop centres each bar in its slot; the phone spreads them edge to edge
  // so the first bar lines up with the card's text margin
  const bw = phone ? Math.min(46, plotW / n * 0.82) : Math.min(70, slot * 0.8);
  const step = phone ? (plotW - bw) / (n - 1) : slot;
  const r = phone ? 5 : 7;
  const base = y(0);

  const bars = el('g', { class: 'bars' });
  const hits = el('g', { class: 'hits' });
  const tip = host._tip || (host._tip = makeTip(host));
  const geo = [];

  data.values.forEach((v, i) => {
    const x = phone ? pad.l + step * i : pad.l + slot * i + (slot - bw) / 2;
    const cx = x + bw / 2;
    const topBlue = y(v);
    const topCap = y(v + data.caps[i]);

    const g = el('g', { class: 'bar' });
    g.style.transformOrigin = `${cx}px ${base}px`;
    g.style.transitionDelay = REDUCED ? '0s' : `${0.05 + i * 0.045}s`;
    // grey silhouette first, blue over it — one shared rounded top
    if (data.caps[i] > 0)
      g.appendChild(el('path', { d: roundedTop(x, topCap, bw, base - topCap, r), fill: '#E4E7EC' }));
    g.appendChild(el('path', { class: 'bar__fill', d: roundedTop(x, topBlue, bw, base - topBlue, r) }));
    bars.appendChild(g);

    const hit = el('rect', { x: cx - step / 2, y: pad.t, width: step, height: plotH, fill: 'transparent' });
    hits.appendChild(hit);
    geo.push({ g, cx, topCap, v, cap: data.caps[i], label: data.labels[i] });

    const label = el('text', { x: cx, y: H - 8, 'text-anchor': 'middle', class: 'tick-label' });
    label.textContent = data.labels[i];
    svg.appendChild(label);
  });

  svg.appendChild(bars);
  svg.appendChild(hits);
  host.appendChild(svg);

  // hover: highlight one column, dim the rest, follow with a tooltip
  hits.addEventListener('pointerover', e => {
    const i = [...hits.children].indexOf(e.target);
    if (i < 0) return;
    const d = geo[i];
    bars.classList.add('is-hovering');
    geo.forEach((o, j) => o.g.classList.toggle('is-hot', j === i));
    const px = host.clientWidth / W;
    tip.show(
      `<span class="tip__head">${d.label}</span>
       <span class="tip__row"><i style="background:var(--blue)"></i>Revenue<b>${money(d.v)}</b></span>
       <span class="tip__row"><i style="background:#E4E7EC"></i>Projected<b>${money(d.cap)}</b></span>`,
      d.cx * px, d.topCap * px - 10
    );
  });
  hits.addEventListener('pointerleave', () => {
    bars.classList.remove('is-hovering');
    geo.forEach(o => o.g.classList.remove('is-hot'));
    tip.hide();
  });

  raf(() => bars.classList.add("is-in"));
  setTimeout(() => geo.forEach(o => (o.g.style.transitionDelay = "0s")), 1400);
}

// rect with only the two top corners rounded
function roundedTop(x, y, w, h, r) {
  r = Math.min(r, w / 2, Math.max(h, 0.001));
  h = Math.max(h, r);
  return `M${x},${y + h} V${y + r} a${r},${r} 0 0 1 ${r},${-r} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} V${y + h} Z`;
}

/* =========================================================
   2. OVERVIEW LINE CHART
   ========================================================= */
const LINE_VB = { w: 640, h: 268 };

function lineChart(host, data) {
  host.querySelector('svg')?.remove();

  const { w: W, h: H } = LINE_VB;
  const pad = { t: 14, r: 8, b: 30, l: 48 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const n = data.labels.length;

  const peak = Math.max(...data.series.flat());
  const scale = niceScale(peak, 5);
  const X = i => pad.l + (plotW / (n - 1)) * i;
  const Y = v => pad.t + plotH * (1 - v / scale.max);

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img',
                          'aria-label': 'Overview trend' });

  ticksFor(scale).reverse().forEach(t => {
    svg.appendChild(el('line', {
      x1: pad.l, x2: pad.l + plotW, y1: Y(t), y2: Y(t),
      stroke: '#E1E5EB', 'stroke-width': 1, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round',
    }));
    const label = el('text', { x: pad.l - 12, y: Y(t) + 4, 'text-anchor': 'end', class: 'axis-label' });
    label.textContent = compact(t);
    svg.appendChild(label);
  });

  const paths = [];
  SERIES_META.forEach((s, si) => {
    const pts = data.series[si].map((v, i) => [X(i), Y(v)]);
    const d = smooth(pts);
    const g = el('g', { class: 'series', 'data-series': si });

    if (s.fill) {
      const area = el('path', {
        class: 'series__area',
        d: `${d} L${X(n - 1)},${Y(0)} L${X(0)},${Y(0)} Z`,
        fill: s.color,
      });
      g.appendChild(area);
    }
    const line = el('path', {
      class: 'series__line', d, fill: 'none', stroke: s.color,
      'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    });
    g.appendChild(line);
    svg.appendChild(g);
    paths.push(line);
  });

  // crosshair + dots, parked on the peak of the first series until hover
  const focus = el('g', { class: 'focus' });
  const vline = el('line', { class: 'focus__line', stroke: '#F2A65A', 'stroke-width': 1.4 });
  focus.appendChild(vline);
  const dots = SERIES_META.map(s => {
    const c = el('circle', { r: 6, fill: '#fff', stroke: s.color, 'stroke-width': 2.6 });
    focus.appendChild(c);
    return c;
  });
  svg.appendChild(focus);

  data.labels.forEach((d, i) => {
    const label = el('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', class: 'tick-label' });
    label.textContent = d;
    svg.appendChild(label);
  });

  const hit = el('rect', { x: pad.l - 12, y: 0, width: plotW + 24, height: H, fill: 'transparent' });
  svg.appendChild(hit);
  host.appendChild(svg);

  const tip = host._tip || (host._tip = makeTip(host));

  function setFocus(i, withTip) {
    vline.setAttribute('x1', X(i)); vline.setAttribute('x2', X(i));
    vline.setAttribute('y1', Y(data.series[0][i])); vline.setAttribute('y2', H - 22);
    dots.forEach((c, si) => {
      c.setAttribute('cx', X(i));
      c.setAttribute('cy', Y(data.series[si][i]));
      c.style.opacity = withTip || si === 0 ? 1 : 0;
    });
    if (!withTip) return tip.hide();
    const px = host.clientWidth / W;
    tip.show(
      `<span class="tip__head">${data.labels[i]}</span>` +
      SERIES_META.map((s, si) =>
        `<span class="tip__row"><i style="background:${s.color}"></i>${s.name}<b>${data.series[si][i].toLocaleString()}</b></span>`
      ).join(''),
      X(i) * px, Y(Math.max(...data.series.map(r => r[i]))) * px - 12
    );
  }

  const peakIndex = data.series[0].indexOf(Math.max(...data.series[0]));
  setFocus(peakIndex, false);

  hit.addEventListener('pointermove', e => {
    const box = host.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    const i = Math.max(0, Math.min(n - 1, Math.round((vx - pad.l) / (plotW / (n - 1)))));
    host.classList.add('is-hovering');
    setFocus(i, true);
  });
  hit.addEventListener('pointerleave', () => {
    host.classList.remove('is-hovering');
    setFocus(peakIndex, false);
  });

  // draw the strokes on
  if (!REDUCED) {
    paths.forEach((p, i) => {
      let len = 0;
      try { len = p.getTotalLength(); } catch { return; }
      if (!len) return;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = `stroke-dashoffset .95s cubic-bezier(.4,0,.2,1) ${0.08 + i * 0.12}s`;
      raf(() => { p.style.strokeDashoffset = 0; });
    });
  }
  raf(() => host.classList.add('is-in'));
}

// Catmull-Rom → cubic bezier, so curves read as drawn rather than jagged
function smooth(p, tension = 0.85) {
  if (p.length < 2) return '';
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* =========================================================
   3. COUNT-UP
   ========================================================= */
function countTo(node, to, { decimals = 0, prefix = '', suffix = '', ms = 900 } = {}) {
  const from = node._val ?? 0;
  node._val = to;
  const fmt = v => prefix + v.toLocaleString('en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  // rAF is paused while the tab is hidden — land on the value instead of freezing mid-count
  if (REDUCED || document.hidden) return void (node.textContent = fmt(to));

  const t0 = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 4);
  (function step(now) {
    const t = Math.min(1, (now - t0) / ms);
    node.textContent = fmt(from + (to - from) * ease(t));
    if (t < 1) requestAnimationFrame(step);
  })(t0);
}

/* =========================================================
   4. WIRING
   ========================================================= */
const barHost  = document.getElementById('barChart');
const lineHost = document.getElementById('lineChart');
const segs     = [...document.querySelectorAll('[data-segmented]')];
const [revenueSeg, overviewSeg] = segs;

let revenuePeriod = 'Year';
let overviewPeriod = 'Today';

const revenueFor = p => (isMobile() && MOBILE_REVENUE_DATA[p]) || REVENUE_DATA[p];

function renderRevenue(period) {
  revenuePeriod = period;
  const d = revenueFor(period);
  barChart(barHost, d);
  countTo(document.getElementById('revenueTotal'), d.total, { decimals: 2 });
}

function renderOverview(period) {
  overviewPeriod = period;
  const d = OVERVIEW_DATA[period];
  lineChart(lineHost, d);
  document.querySelectorAll('.metric').forEach((row, i) => {
    const m = d.metrics[i];
    countTo(row.querySelector('.metric__value'), m.v, { ms: 700 });
    const pill = row.querySelector('.pill');
    pill.textContent = (m.d > 0 ? '+' : '') + m.d + '%';
    pill.classList.toggle('pill--up', m.d > 0);
    pill.classList.toggle('pill--down', m.d <= 0);
  });
}

segs.forEach(group => {
  group.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.classList.contains('is-active')) return;
    group.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
    (group === revenueSeg ? renderRevenue : renderOverview)(btn.textContent.trim());
  });
});

// hovering a metric row spotlights its line
document.querySelectorAll('.metric').forEach(row => {
  const si = row.dataset.series;
  row.addEventListener('pointerenter', () => {
    lineHost.classList.add('is-isolating');
    lineHost.querySelectorAll('.series').forEach(g =>
      g.classList.toggle('is-muted', g.dataset.series !== si));
  });
  row.addEventListener('pointerleave', () => {
    lineHost.classList.remove('is-isolating');
    lineHost.querySelectorAll('.series').forEach(g => g.classList.remove('is-muted'));
  });
});

/* feed */
document.getElementById('feed').innerHTML = ACTIVITY.map((a, i) => `
  <li class="feed__item reveal" style="--d:${(0.35 + i * 0.05).toFixed(2)}s">
    <div class="feed__top">
      <span class="feed__icon"><svg class="ic"><use href="#${a.icon}"/></svg></span>
      <span class="feed__name">${a.name}</span>
      <span class="feed__time">${a.time}</span>
    </div>
    <p class="feed__text">${a.text}</p>
  </li>`).join('');

/* stat cards count up too */
[['+', 3052, 0], ['$', 53478.75, 2], ['$', 53000, 0]].forEach(([prefix, v, dec], i) => {
  const node = document.querySelectorAll('.stat__value')[i];
  setTimeout(() => countTo(node, v, { prefix, decimals: dec }), 260 + i * 90);
});

/* entrance stagger — sequenced here so the markup stays clean */
const sequence = [
  ['.brand', 0],
  ...[...document.querySelectorAll('.nav__item')].map((n, i) => [n, 0.06 + i * 0.045]),
  ['.user', 0.5],
  ...[...document.querySelectorAll('.stat')].map((n, i) => [n, 0.08 + i * 0.09]),
  ['.revenue', 0.26],
  ['.overview', 0.34],
  ['.projects', 0.42],
  ['.activity__head', 0.3],
  ...[...document.querySelectorAll('.table tbody tr')].map((n, i) => [n, 0.5 + i * 0.07]),
];
sequence.forEach(([target, delay]) => {
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (!node) return;
  node.style.setProperty('--d', delay + 's');
  node.classList.add('reveal');
});

// Year has no place on the phone, so the small screen opens on Month
function selectPeriod(group, period) {
  group.querySelectorAll('button').forEach(b =>
    b.classList.toggle('is-active', b.textContent.trim() === period));
  (group === revenueSeg ? renderRevenue : renderOverview)(period);
}

MQ_MOBILE.addEventListener('change', () => {
  if (isMobile() && revenuePeriod === 'Year') selectPeriod(revenueSeg, 'Month');
  else renderRevenue(revenuePeriod);
  renderOverview(overviewPeriod);
});

selectPeriod(revenueSeg, isMobile() ? 'Month' : 'Year');
renderOverview('Today');
document.body.classList.add('is-ready');
