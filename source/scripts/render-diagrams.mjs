#!/usr/bin/env node
// Render every diagrams/*.mmd to assets/diagrams/<name>.svg in the GalaxiTech look.
//   node scripts/render-diagrams.mjs            (all diagrams)
//   node scripts/render-diagrams.mjs wardley    (names containing "wardley")
//   node scripts/render-diagrams.mjs --check path/to/map.mmd   (run the checks only, write nothing)
// The SVG is used on slides as a plain <img>, so it works in the dev server, HTML, PDF and the VS Code preview.
// An SVG shown as an image can't use the page's fonts, so the brand fonts are embedded in it.
// Wardley maps also get label layout, user and need marks, and overlap checks (see layoutWardley below).
// Exit code: 0 = all rendered without errors (warnings allowed), 1 = a diagram failed or has errors.
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// A deck and its maps live in a workspace: workspaces/<name>/diagrams -> workspaces/<name>/assets/diagrams.
//   node scripts/render-diagrams.mjs -w ddd-belgium-wardley [filter]     (or WORKSPACE=ddd-belgium-wardley)
// Without a workspace the root diagrams/ (the example maps) are rendered.
const argv = [...process.argv.slice(2)]
const wIdx = argv.findIndex((a) => a === '-w' || a === '--workspace')
const workspace = wIdx >= 0 ? argv.splice(wIdx, 2)[1] : process.env.WORKSPACE
const base = workspace ? path.join(root, 'workspaces', workspace) : root
if (workspace && !existsSync(base)) { console.error(`No workspace "${workspace}" (expected ${base})`); process.exit(2) }
const checkOnly = argv[0] === '--check'
const srcDir = checkOnly ? path.dirname(path.resolve(argv[1] ?? '')) : path.join(base, 'diagrams')
const outDir = path.join(base, 'assets', 'diagrams')
const filter = checkOnly ? path.basename(argv[1] ?? '') : argv[0] ?? ''
const sources = existsSync(srcDir) ? readdirSync(srcDir).filter((f) => f.endsWith('.mmd') && (checkOnly ? f === filter : f.includes(filter))) : []
if (!sources.length) { console.error(checkOnly ? `Not found: ${argv[1]}` : `No diagrams/*.mmd matching "${filter}"`); process.exit(2) }

const browserPath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync)
if (!browserPath) { console.error('No Chrome/Edge found; set CHROME_PATH.'); process.exit(2) }

// design-system tokens (same values as themes/galaxitech.css)
const T = { void: '#05070c', deep900: '#0a1122', deep800: '#0f1a2e', line: '#1f2c47', lineStrong: '#56678a', ink: '#e6e8ee', inkMuted: '#9aa3b5', inkSubtle: '#7f889c', gold: '#eebd2b' }
const fonts = [
  ['Sora', 400, 'sora-latin-400-normal.woff2'],
  ['Sora', 600, 'sora-latin-600-normal.woff2'],
  ['JetBrains Mono', 400, 'jetbrains-mono-latin-400-normal.woff2'],
]
const fontCss = fonts.map(([family, weight, file]) =>
  `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(path.join(root, 'assets', 'fonts', file)).toString('base64')}) format("woff2")}`).join('')

const config = {
  startOnLoad: false, theme: 'base', securityLevel: 'strict', fontFamily: 'Sora, sans-serif',
  themeVariables: {
    fontFamily: 'Sora, sans-serif', fontSize: '16px', background: T.deep900,
    primaryColor: T.deep800, primaryTextColor: T.ink, primaryBorderColor: T.lineStrong, lineColor: T.lineStrong,
    secondaryColor: T.deep800, tertiaryColor: T.deep900, textColor: T.ink,
    // red is reserved for the red switch, so evolution arrows are gold
    wardley: {
      backgroundColor: T.deep900, axisColor: T.lineStrong, axisTextColor: T.inkMuted, gridColor: 'rgba(86,103,138,.25)',
      componentFill: T.deep900, componentStroke: T.ink, componentLabelColor: T.ink, linkStroke: T.lineStrong,
      evolutionStroke: T.gold, annotationStroke: T.gold, annotationTextColor: T.ink, annotationFill: T.deep800,
    },
  },
  // sized for projection: the slide shows the SVG at 1:1 when its size matches the body area
  'wardley-beta': { axisFontSize: 15, labelFontSize: 17, nodeRadius: 8, padding: 40, showGrid: false },
}

// CI runners need --no-sandbox for headless Chrome
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: process.env.CI ? ['--no-sandbox'] : [] })
let failed = 0
try {
  const page = await browser.newPage()
  await page.setContent(`<!doctype html><style>${fontCss} body{margin:0;font-family:Sora}</style><div id="out"></div>`)
  await page.addScriptTag({ path: path.join(root, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js') })
  // Wardley post-processing, in three steps:
  // 1. Users (anchors) get a person icon at their position. User needs (components a user links to) get a
  //    gold ring with a centre dot and a semibold label, so they read differently from other components.
  // 2. Labels: a node on the left half of the map gets its label to its left, one on the right half to its
  //    right, vertically centred and clear of the node's own marks (icon, buy ring, inertia bar). A right-side
  //    label whose component has an evolve arrow would sit on the arrow, so it goes above instead.
  // 3. Returns the problems a person should fix: labels outside the map, overlapping labels or nodes.
  await page.addScriptTag({ content: `window.layoutWardley = ${function (svg, { overrides, needs, manual, allowCrossing, gold, ink, fill, hideX, hideY, brackets, constraints, submaps, forceCaptionOff, arrowScale = 2.5, arrowSpan = null, moves = [], futures = [], pasts = [], futureLinks = [], pipeArrows = [], pictures = [], highlights = [], noteFor = [], comments = [], zones = [], dots = [], labelSize = 16, red = '#ff2436', muted = '#9aa3b5' }) {
    const NS = 'http://www.w3.org/2000/svg', GAP = 6
    const make = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e }
    const vb = svg.viewBox.baseVal, mid = vb.x + vb.width / 2
    const trends = [...svg.querySelectorAll('.wardley-trend')].map((l) => ({ x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'), x2: +l.getAttribute('x2') }))
    // %% zone "Label" "#colour" v,e v,e ...: a soft area behind the map, as in Peña's page 153 or the
    // problem/solution split. A polygon of 3 to 10 corners, each corner rounded: the path runs along
    // each edge to a point 40% short of the corner (less on short edges) and turns through the corner
    // with a quadratic curve, so the shape stays one connected area with no sharp angles. Drawn behind
    // everything, translucent, with its label at the top left inside the shape. %% dot V E draws an
    // unnamed component ring, for the crowd of things a zone holds.
    const zoneX = (e) => vb.x + 40 + e * (vb.width - 80), zoneY = (v) => vb.y + vb.height - 40 - v * (vb.height - 80)
    if (zones.length || dots.length) {
      const layer = make('g', { class: 'gx-zones' })
      svg.insertBefore(layer, svg.firstChild.nextSibling)
      for (const { label: text, color, pts } of zones) {
        const P = pts.map(([v, e]) => [zoneX(e), zoneY(v)])
        const n = P.length, d = []
        const corner = (i) => {
          const [px, py] = P[i], [ax, ay] = P[(i - 1 + n) % n], [bx, by] = P[(i + 1) % n]
          const la = Math.hypot(ax - px, ay - py), lb = Math.hypot(bx - px, by - py)
          const r = Math.min(la, lb) * 0.4
          return { p1: [px + ((ax - px) / la) * r, py + ((ay - py) / la) * r], p: [px, py], p2: [px + ((bx - px) / lb) * r, py + ((by - py) / lb) * r] }
        }
        const c0 = corner(0)
        d.push(`M${c0.p2[0]} ${c0.p2[1]}`)
        for (let i = 1; i <= n; i++) { const c = corner(i % n); d.push(`L${c.p1[0]} ${c.p1[1]}`, `Q${c.p[0]} ${c.p[1]} ${c.p2[0]} ${c.p2[1]}`) }
        d.push('Z')
        layer.append(make('path', { d: d.join(' '), fill: color, 'fill-opacity': 0.16, stroke: color, 'stroke-opacity': 0.6, 'stroke-width': 1.2, 'stroke-dasharray': '5 4', class: 'gx-zone' }))
        const minX = Math.min(...P.map((q) => q[0])), minY = Math.min(...P.map((q) => q[1]))
        const t = make('text', { x: minX + 14, y: minY + 10, fill: color, 'font-size': 13, 'font-weight': 600, 'letter-spacing': 0.4, 'dominant-baseline': 'hanging', class: 'gx-zone-label' })
        t.textContent = text; layer.append(t)
      }
      for (const { v, e } of dots) layer.append(make('circle', { cx: zoneX(e), cy: zoneY(v), r: 6, fill, stroke: ink, 'stroke-width': 1.5, class: 'gx-dot' }))
    }
    // Reveal layers: the two axes can wake up on their own clicks, so hide what hasn't been shown yet.
    if (hideY || hideX) {
      for (const t of svg.querySelectorAll('.wardley-axes text')) {
        const s = t.textContent.trim()
        if ((hideY && s === 'Visibility') || (hideX && s === 'Evolution')) t.remove()
      }
      for (const l of svg.querySelectorAll('.wardley-axes line')) {
        const vert = +l.getAttribute('x1') === +l.getAttribute('x2')
        if ((hideY && vert && +l.getAttribute('x1') < mid - vb.width / 4) || (hideX && !vert && +l.getAttribute('y1') > vb.y + vb.height / 2)) l.remove()
      }
      if (hideX) svg.querySelector('.wardley-stages')?.remove()
    }
    // Domain brackets: a gold bracket on the left edge with a rotated title (Susanne Kaiser's
    // problem domain / solution domain marking). %% domain-bracket "Title" topV bottomV
    // Accelerator / deaccelerator: Mermaid already draws the standard block arrow (a rectangle
    // shaft with a triangle head) — but hard-codes a white fill that glares on the dark theme,
    // and renders it tiny with a caption. Scale it up, recolor to the house palette (hollow on
    // dark, ink outline), and drop the caption when the row label already says it (%% force-caption-off).
    // %% arrow-span E1 E2 redraws each block arrow as a slim arrow spanning that evolution range at its
    // own height, as long as an evolve arrow: push and hold are forces on the move, so they sit on its line.
    const px = (e) => vb.x + 40 + e * (vb.width - 80)
    for (const p of svg.querySelectorAll('.wardley-accelerators path, .wardley-deaccelerators path')) {
      const b = p.getBBox(), m = b.x + b.width / 2, n = b.y + b.height / 2
      if (arrowSpan) {
        const left = p.closest('.wardley-deaccelerators') !== null
        const x1 = px(arrowSpan[0]), x2 = px(arrowSpan[1]), shaft = 10, head = 24, len = 24
        const pts = left
          ? [[x2, n - shaft / 2], [x1 + len, n - shaft / 2], [x1 + len, n - head / 2], [x1, n], [x1 + len, n + head / 2], [x1 + len, n + shaft / 2], [x2, n + shaft / 2]]
          : [[x1, n - shaft / 2], [x2 - len, n - shaft / 2], [x2 - len, n - head / 2], [x2, n], [x2 - len, n + head / 2], [x2 - len, n + shaft / 2], [x1, n + shaft / 2]]
        p.setAttribute('d', `M${pts.map(([x, y]) => `${x} ${y}`).join('L')}Z`)
        p.removeAttribute('transform')
      } else p.setAttribute('transform', `translate(${m} ${n}) scale(${arrowScale}) translate(${-m} ${-n})`)
      p.setAttribute('fill', fill)
      p.setAttribute('stroke', ink)
      p.setAttribute('stroke-width', 1.5)
    }
    if (forceCaptionOff) for (const t of svg.querySelectorAll('.wardley-accelerators text, .wardley-deaccelerators text')) t.remove()
    // Sourcing overlays: Mermaid draws buy and build as near-identical pale discs. Rent keeps
    // the solid disc, make becomes hollow, both in ink outline — distinguishable at a glance.
    for (const c of svg.querySelectorAll('.wardley-buy-overlay, .wardley-build-overlay')) {
      c.setAttribute('stroke', ink)
      c.setAttribute('fill', c.classList.contains('wardley-build-overlay') ? fill : '#ccc')
    }
    const bracketSegs = []
    for (const { title, top, bottom } of brackets) {
      const py = (v) => vb.y + vb.height - 40 - v * (vb.height - 80)
      const yT = py(top), yB = py(bottom), x = 72
      const g = make('g', { class: 'gx-bracket' })
      g.append(make('path', { d: `M${x + 14} ${yT}H${x}V${yB}H${x + 14}`, fill: 'none', stroke: gold, 'stroke-width': 1.5 }))
      bracketSegs.push({ x1: x, y1: yT, x2: x, y2: yB }, { x1: x, y1: yT, x2: x + 14, y2: yT }, { x1: x, y1: yB, x2: x + 14, y2: yB })
      const t = make('text', { x: x - 14, y: (yT + yB) / 2, fill: gold, 'font-size': 12, 'font-weight': 600, 'text-anchor': 'middle', 'letter-spacing': 1.5, transform: `rotate(-90 ${x - 14} ${(yT + yB) / 2})` })
      t.textContent = title
      g.append(t)
      svg.append(g)
    }

    for (const g of svg.querySelectorAll('.wardley-node--anchor')) {
      const label = g.querySelector('.wardley-node-label'), x = +label.getAttribute('x'), y = +label.getAttribute('y')
      // person: head and shoulders, 20px tall, centred on the anchor point; the circle stands in for the node
      const icon = make('g', { class: 'gx-user' })
      icon.append(make('circle', { cx: x, cy: y, r: 11, fill, stroke: ink, 'stroke-width': 1.5, class: 'gx-user-node' }))
      icon.append(make('circle', { cx: x, cy: y - 3.5, r: 3.5, fill: ink }))
      icon.append(make('path', { d: `M${x - 6.5} ${y + 7}a6.5 6 0 0 1 13 0z`, fill: ink }))
      g.insertBefore(icon, label)
      label.setAttribute('font-weight', '600')
    }
    for (const g of svg.querySelectorAll('.wardley-node--component')) {
      const label = g.querySelector('.wardley-node-label'), circle = g.querySelector('circle')
      if (!needs.includes(label?.textContent) || !circle) continue
      g.classList.add('gx-need')
      circle.setAttribute('r', 10); circle.setAttribute('stroke', gold); circle.setAttribute('stroke-width', 2)
      g.insertBefore(make('circle', { cx: circle.getAttribute('cx'), cy: circle.getAttribute('cy'), r: 3.5, fill: gold }), circle.nextSibling)
      label.setAttribute('font-weight', '600')
    }
    // %% constraint "Component": a horizontal striped bar behind the component — the striped
    // twin of the solid inertia bar (Slominski's inertia-vs-constraint pair).
    if (constraints.length) {
      if (!svg.querySelector('#gx-caution')) {
        const defs = make('defs', {})
        defs.innerHTML = `<pattern id="gx-caution" width="8" height="4" patternUnits="userSpaceOnUse"><line x1="0" y1="2" x2="8" y2="2" stroke="${ink}" stroke-width="1.6"/></pattern>`
        svg.prepend(defs)
      }
      const nodesWithBars = [...svg.querySelectorAll('.wardley-node--component, .wardley-node--anchor')]
      for (const g of nodesWithBars) {
        const label = g.querySelector('.wardley-node-label'), circle = g.querySelector('.gx-user-node') ?? g.querySelector('circle')
        if (!label || !circle || !constraints.includes(label.textContent)) continue
        const cx = +circle.getAttribute('cx'), cy = +circle.getAttribute('cy'), r = +circle.getAttribute('r')
        // A user's circle sits inside its icon group, so insert the bar before that group.
        g.insertBefore(make('rect', { x: cx - r - 14, y: cy - 5, width: 2 * r + 28, height: 10, fill: 'url(#gx-caution)' }), circle.parentNode === g ? circle : circle.parentNode)
      }
    }

    // Inertia on a component that also evolves: Wardley draws the bar on the evolution path, in
    // the way of the move. Mermaid puts it right next to the node, so slide it 40% along the arrow.
    for (const l of svg.querySelectorAll('.wardley-inertia')) {
      const x = +l.getAttribute('x1'), y1 = +l.getAttribute('y1'), y2 = +l.getAttribute('y2'), ym = (y1 + y2) / 2
      const t = trends.find((t) => Math.abs(t.y1 - ym) < 3 && t.x2 > t.x1 && x - t.x1 > -5 && x - t.x1 < 40)
      if (!t) continue
      const nx = t.x1 + (t.x2 - t.x1) * 0.4
      l.setAttribute('x1', nx); l.setAttribute('x2', nx); l.setAttribute('y1', y1 - 4); l.setAttribute('y2', y2 + 4)
    }

    // Notes: Mermaid draws them at 11px in a muted grey, unreadable from the back of a room.
    // Give them the component label size (17px) in ink, so a note reads like part of the map.
    for (const t of svg.querySelectorAll('.wardley-notes text')) {
      t.setAttribute('font-size', labelSize); t.setAttribute('fill', ink); t.setAttribute('font-weight', 400)
    }
    // %% label-size N: component names (default 16px since 13 Oct, CJ found 17 a bit big; the projection size)
    for (const t of svg.querySelectorAll('.wardley-node-label')) t.setAttribute('font-size', labelSize)
    // %% note-for "Note text" "Component": the note is a comment on that component. It gets a smaller size
    // (15px, still ink) and a thin line from the note to the component's node, like a comment on a drawing.
    for (const { note, target } of noteFor) {
      const t = [...svg.querySelectorAll('.wardley-notes text')].find((x) => x.textContent.trim() === note)
      const g = [...svg.querySelectorAll('.wardley-node--component, .wardley-node--anchor')].find((x) => x.querySelector('.wardley-node-label')?.textContent === target)
      const c = g && (g.querySelector('.gx-user-node') ?? g.querySelector('circle'))
      if (!t || !c) continue
      t.setAttribute('font-size', labelSize - 2)
      const b = t.getBBox(), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r')
      // start on the note's edge nearest the node, end at the node's ring
      const sx = Math.min(Math.max(cx, b.x), b.x + b.width), sy = cy < b.y ? b.y - 3 : cy > b.y + b.height ? b.y + b.height + 3 : b.y + b.height / 2
      const dx = cx - sx, dy = cy - sy, len = Math.hypot(dx, dy) || 1
      const line = make('line', { x1: sx, y1: sy, x2: cx - (dx / len) * (r + 4), y2: cy - (dy / len) * (r + 4), stroke: ink, 'stroke-opacity': 0.55, 'stroke-width': 1, class: 'gx-note-link' })
      svg.insertBefore(line, svg.firstChild.nextSibling)
    }

    // %% submap "Component": a square around the node — "there is a whole map inside this
    // one" (Wardley's submap). Drawn before label layout so labels clear the square.
    for (const g of svg.querySelectorAll('.wardley-node--component')) {
      const label = g.querySelector('.wardley-node-label'), circle = g.querySelector('circle')
      if (!label || !circle || !submaps.includes(label.textContent)) continue
      const h = +circle.getAttribute('r') + 6
      g.insertBefore(make('rect', { x: +circle.getAttribute('cx') - h, y: +circle.getAttribute('cy') - h, width: 2 * h, height: 2 * h, rx: 2, fill: 'none', stroke: ink, 'stroke-width': 1.5, class: 'gx-submap' }), circle)
    }

    // Evolve: Mermaid stops at a dashed line with a 6px arrowhead and nothing to point at.
    // Wardley's notation ends the move in a ghost of the component at its future position,
    // so draw a dashed gold ring there, end the line at the ring's edge, and enlarge the head.
    const GHOST_R = 9, ghosts = []
    for (const l of svg.querySelectorAll('.wardley-trend')) {
      const x1 = +l.getAttribute('x1'), x2 = +l.getAttribute('x2'), y = +l.getAttribute('y2'), dir = Math.sign(x2 - x1) || 1
      const ring = make('circle', { cx: x2, cy: y, r: GHOST_R, fill: fill, stroke: gold, 'stroke-width': 1.5, 'stroke-dasharray': '3 3', class: 'gx-ghost' })
      l.parentNode.append(ring)
      ghosts.push(ring)
      l.setAttribute('x2', x2 - dir * (GHOST_R + 3))
      l.setAttribute('stroke-width', 1.5)
    }
    for (const m of svg.querySelectorAll('marker[id^="arrow-"]')) { m.setAttribute('markerWidth', 7); m.setAttribute('markerHeight', 7) }

    // Movement notation (CJ's InfoQ Fig. 5, decided 8-11 Oct): a dashed line is natural evolution,
    // past or future; a solid double-line arrow is an intended move, our own push; red is the
    // future state. `evolve` stays the dashed future line; these directives add the rest:
    //   %% move "Name" E            intended move to evolution E: solid double arrow to a red ring
    //   %% future "Name" ["Label"]  the evolve line and its ghost are the future state: red, labelled
    //   %% past "Name" E ["Label"]  where it came from: dashed ring at E, dashed line into the node
    //   %% future-link "A" "B"      red line between the future positions of A and B
    const posE = (e) => vb.x + 40 + e * (vb.width - 80)
    const nodeAt = (name) => {
      for (const g of svg.querySelectorAll('.wardley-node--component, .wardley-node--anchor')) {
        const label = g.querySelector('.wardley-node-label')
        if (label?.textContent !== name) continue
        const c = g.querySelector('.gx-user-node') ?? g.querySelector('circle')
        if (c) return { cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), r: +c.getAttribute('r'), g }
      }
      return null
    }
    const movesLayer = make('g', { class: 'gx-moves' }), moveLabels = make('g', { class: 'wardley-notes gx-move-labels' })
    svg.append(movesLayer); svg.append(moveLabels)
    const futurePos = {}
    const label = (text, x, y, color, anchor = 'middle') => {
      const t = make('text', { x, y, fill: color, 'font-size': labelSize, 'text-anchor': anchor, 'dominant-baseline': 'hanging', 'font-weight': 400 })
      t.textContent = text; moveLabels.append(t)
    }
    for (const { name, e } of moves) {
      const n = nodeAt(name); if (!n) continue
      const x2 = posE(e), y = n.cy, R = GHOST_R, dir = Math.sign(x2 - n.cx) || 1
      const xs = n.cx + dir * (n.r + 3), xe = x2 - dir * (R + 4), head = 12
      for (const off of [-3, 3]) movesLayer.append(make('line', { x1: xs, y1: y + off, x2: xe - dir * head * 0.6, y2: y + off, stroke: ink, 'stroke-width': 1.5 }))
      movesLayer.append(make('path', { d: `M${xe - dir * head} ${y - 8}L${xe} ${y}L${xe - dir * head} ${y + 8}`, fill: 'none', stroke: ink, 'stroke-width': 1.5 }))
      movesLayer.append(make('circle', { cx: x2, cy: y, r: R, fill, stroke: red, 'stroke-width': 2, class: 'gx-future' }))
      futurePos[name] = [x2, y]
    }
    for (const l of svg.querySelectorAll('.wardley-trend')) {
      const x1 = +l.getAttribute('x1'), y1 = +l.getAttribute('y1')
      const f = futures.find((f) => { const n = nodeAt(f.name); return n && Math.abs(n.cx - x1) < 1 && Math.abs(n.cy - y1) < 1 })
      if (!f) continue
      const ring = [...l.parentNode.querySelectorAll('.gx-ghost')].find((c) => Math.abs(+c.getAttribute('cy') - y1) < 1)
      l.setAttribute('stroke', red)
      const marker = l.getAttribute('marker-end')
      if (marker) l.removeAttribute('marker-end')
      if (ring) {
        ring.setAttribute('stroke', red); ring.removeAttribute('stroke-dasharray')
        const gx = +ring.getAttribute('cx')
        movesLayer.append(make('path', { d: `M${gx - GHOST_R - 12} ${y1 - 6}L${gx - GHOST_R - 2} ${y1}L${gx - GHOST_R - 12} ${y1 + 6}Z`, fill: red }))
        futurePos[f.name] = [gx, y1]
        if (f.label) label(f.label, gx, y1 + GHOST_R + GAP, red)
      }
    }
    for (const { name, e, label: pastLabel } of pasts) {
      const n = nodeAt(name); if (!n) continue
      const x0 = posE(e), y = n.cy
      movesLayer.append(make('circle', { cx: x0, cy: y, r: GHOST_R, fill, stroke: muted, 'stroke-width': 1.5, 'stroke-dasharray': '3 3', class: 'gx-past' }))
      const xe = n.cx - Math.sign(n.cx - x0) * (n.r + 3)
      movesLayer.append(make('line', { x1: x0 + Math.sign(n.cx - x0) * (GHOST_R + 2), y1: y, x2: xe - Math.sign(n.cx - x0) * 9, y2: y, stroke: muted, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }))
      const s = Math.sign(n.cx - x0)
      movesLayer.append(make('path', { d: `M${xe - s * 10} ${y - 6}L${xe} ${y}L${xe - s * 10} ${y + 6}Z`, fill: muted }))
      const t = make('text', { x: x0, y: y - GHOST_R - GAP, fill: muted, 'font-size': labelSize, 'text-anchor': 'middle', 'dominant-baseline': 'auto', 'font-weight': 400 })
      t.textContent = pastLabel ?? name; moveLabels.append(t)
    }
    //   %% picture "assets/file.webp" V E W H   a small image with its top-left corner at [V, E], W x H px
    //   %% highlight "Text"   a gold ring around the text on the map with exactly that content (e.g. a stage label)
    for (const word of highlights) {
      for (const t of svg.querySelectorAll('text')) {
        if (t.textContent.trim() !== word) continue
        const b = t.getBBox(), padX = 18, padY = 10
        t.setAttribute('fill', ink); t.setAttribute('font-weight', 600)
        svg.append(make('rect', { x: b.x - padX, y: b.y - padY, width: b.width + 2 * padX, height: b.height + 2 * padY, rx: (b.height + 2 * padY) / 2, fill: 'none', stroke: gold, 'stroke-width': 2.5, class: 'gx-highlight' }))
      }
    }
    for (const { href, v, e, w, h } of pictures) {
      const py = vb.y + vb.height - 40 - v * (vb.height - 80)
      svg.append(make('image', { href, x: posE(e), y: py, width: w, height: h, preserveAspectRatio: 'xMidYMid meet', class: 'gx-picture' }))
    }
    for (const { a, b } of futureLinks) {
      const pa = futurePos[a] ?? (() => { const n = nodeAt(a); return n && [n.cx, n.cy] })()
      const pb = futurePos[b] ?? (() => { const n = nodeAt(b); return n && [n.cx, n.cy] })()
      if (!pa || !pb) continue
      const dx = pb[0] - pa[0], dy = pb[1] - pa[1], len = Math.hypot(dx, dy) || 1, k = (GHOST_R + 2) / len
      movesLayer.prepend(make('line', { x1: pa[0] + dx * k, y1: pa[1] + dy * k, x2: pb[0] - dx * k, y2: pb[1] - dy * k, stroke: red, 'stroke-width': 1.2 }))
    }

    const nodes = [...svg.querySelectorAll('.wardley-node--component, .wardley-node--anchor, .wardley-node--pipeline-component')]
    for (const g of nodes) {
      if (g.classList.contains('wardley-node--pipeline-component')) continue // placed with its pipeline below
      const circle = g.querySelector('.gx-user-node') ?? g.querySelector('circle'), label = g.querySelector('.wardley-node-label')
      if (!circle || !label || manual.includes(label.textContent)) continue // Mermaid's own `label [dx, dy]` wins
      const cx = +circle.getAttribute('cx'), cy = +circle.getAttribute('cy'), r = +circle.getAttribute('r')
      let left = cx - r, right = cx + r
      for (const s of g.children) if (s !== label) { const b = s.getBBox(); left = Math.min(left, b.x); right = Math.max(right, b.x + b.width) }
      const side = overrides[label.textContent] ?? (cx < mid ? 'left' : 'right')
      const evolvesRight = trends.some((t) => Math.abs(t.x1 - cx) < 1 && Math.abs(t.y1 - cy) < 1 && t.x2 > t.x1)
      if (side === 'above' || side === 'below') {
        label.setAttribute('text-anchor', 'middle'); label.setAttribute('x', cx)
        label.setAttribute('y', side === 'above' ? cy - r - GAP : cy + r + GAP)
        label.setAttribute('dominant-baseline', side === 'above' ? 'auto' : 'hanging')
        continue
      }
      label.setAttribute('text-anchor', side === 'left' ? 'end' : 'start')
      label.setAttribute('x', side === 'left' ? left - GAP : right + GAP)
      if (side === 'right' && evolvesRight) { label.setAttribute('y', cy - r - GAP); label.setAttribute('dominant-baseline', 'auto') }
      else { label.setAttribute('y', cy); label.setAttribute('dominant-baseline', 'central') }
    }
    // Pipelines: Mermaid writes each stage label above-right of its node, on the box edge, and the
    // parent's label lands on top of the middle stage. Stage labels go centred below the box; the
    // parent (drawn as a small square on the box's top edge) gets its label above the box's left end,
    // so the row reads as a name followed by its stages.
    for (const box of svg.querySelectorAll('.wardley-pipeline-box')) {
      const bx = +box.getAttribute('x'), by = +box.getAttribute('y'), bw = +box.getAttribute('width'), bh = +box.getAttribute('height')
      const inBox = (x, y) => x >= bx - 1 && x <= bx + bw + 1 && y >= by - 12 && y <= by + bh + 1
      for (const g of svg.querySelectorAll('.wardley-node--pipeline-component')) {
        const c = g.querySelector('circle'), label = g.querySelector('.wardley-node-label')
        if (!c || !label || manual.includes(label.textContent) || overrides[label.textContent]) continue
        const cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy')
        if (!inBox(cx, cy)) continue
        label.setAttribute('text-anchor', 'middle'); label.setAttribute('x', cx)
        label.setAttribute('y', by + bh + GAP); label.setAttribute('dominant-baseline', 'hanging')
      }
      for (const g of svg.querySelectorAll('.wardley-node--component')) {
        const sq = g.querySelector(':scope > rect'), label = g.querySelector('.wardley-node-label')
        if (!sq || !label || g.querySelector('circle') || manual.includes(label.textContent) || overrides[label.textContent]) continue
        if (!inBox(+sq.getAttribute('x') + +sq.getAttribute('width') / 2, +sq.getAttribute('y') + +sq.getAttribute('height') / 2)) continue
        label.setAttribute('text-anchor', 'start'); label.setAttribute('x', bx)
        label.setAttribute('y', by - 12 - GAP); label.setAttribute('dominant-baseline', 'auto')
      }
    }
    //   %% pipeline-arrow "A" "B"   inside a pipeline, people move from option A to option B (Wardley's
    //   server -> cloud): red dashed arrow from A's node to B's, and B's ring red
    const pipeNode = (name) => {
      for (const g of svg.querySelectorAll('.wardley-node--pipeline-component')) {
        if (g.querySelector('.wardley-node-label')?.textContent !== name) continue
        const c = g.querySelector('circle'); if (c) return c
      }
      return null
    }
    for (const { a, b } of pipeArrows) {
      const ca = pipeNode(a), cb = pipeNode(b); if (!ca || !cb) continue
      const xa = +ca.getAttribute('cx'), xb = +cb.getAttribute('cx'), y = +ca.getAttribute('cy'), s = Math.sign(xb - xa) || 1
      const x1 = xa + s * (+ca.getAttribute('r') + 3), x2 = xb - s * (+cb.getAttribute('r') + 3)
      movesLayer.append(make('line', { x1, y1: y, x2: x2 - s * 10, y2: y, stroke: red, 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }))
      movesLayer.append(make('path', { d: `M${x2 - s * 12} ${y - 6}L${x2} ${y}L${x2 - s * 12} ${y + 6}Z`, fill: red }))
      cb.setAttribute('stroke', red)
    }
    const errors = [], warnings = []
    const inset = (b, d = 2) => ({ x: b.x + d, y: b.y + d, width: b.width - 2 * d, height: b.height - 2 * d })
    const hit = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
    // segment against rectangle (Liang-Barsky clipping)
    const crosses = (l, r) => {
      let t0 = 0, t1 = 1; const dx = l.x2 - l.x1, dy = l.y2 - l.y1
      for (const [p, q] of [[-dx, l.x1 - r.x], [dx, r.x + r.width - l.x1], [-dy, l.y1 - r.y], [dy, r.y + r.height - l.y1]]) {
        if (p === 0) { if (q < 0) return false; continue }
        const t = q / p; if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t } else { if (t < t0) return false; if (t < t1) t1 = t }
      }
      return true
    }
    const seg = (e) => ({ x1: +e.getAttribute('x1'), y1: +e.getAttribute('y1'), x2: +e.getAttribute('x2'), y2: +e.getAttribute('y2') })
    // Rotated text (bracket titles, axis labels) needs its transform measured: wrap it in a
    // throwaway group and take that group's box, which includes the rotation.
    const wrapBBox = (t) => { const w = make('g', {}); t.parentNode.insertBefore(w, t); w.append(t); return w.getBBox() }

    // %% comment "Line one | line two" "Component": a boxed, multi-line comment on a component, placed
    // by the renderer in a free area of the map, with a thin diagonal line to the component's node
    // (a horizontal or vertical line is too easy to miss). Placement is a search over a grid of
    // candidate positions: the box must not touch any label, node, note or line, its connector must
    // cross nothing, and it must leave diagonally; among those spots the one closest to the node wins.
    const commentBoxes = [], commentLines = []
    if (comments.length) {
      const CS = 14, PAD = 9, MARGIN = 10, STEP = 12
      const obstacles = [
        ...[...svg.querySelectorAll('.wardley-node-label, .wardley-notes text, .gx-move-labels text')].map((t) => t.getBBox()),
        ...[...svg.querySelectorAll('.gx-bracket text, .wardley-axes text')].map((t) => wrapBBox(t)),
        ...[...svg.querySelectorAll('.wardley-node--component circle, .wardley-node--anchor circle, .wardley-node--pipeline-component circle, .gx-ghost, .gx-future, .gx-past, .wardley-pipeline-box, .gx-picture, .gx-highlight, .wardley-node--component rect, .gx-dot, .gx-zone-label')].map((e) => e.getBBox()),
      ]
      // the axis bands (stage names along the bottom, the visibility axis on the left), and on a
      // full-slide map the chrome: the label chip top-left, the star bottom-left, the page number bottom-right
      obstacles.push({ x: vb.x, y: vb.y + vb.height - 52, width: vb.width, height: 52 }, { x: vb.x, y: vb.y, width: 44, height: vb.height })
      if (vb.width >= 1200) obstacles.push({ x: vb.x, y: vb.y, width: 520, height: 52 }, { x: vb.x + vb.width - 120, y: vb.y + vb.height - 40, width: 120, height: 40 })
      const mutedLabels = [...svg.querySelectorAll('.gx-move-labels text')].map((t) => t.getBBox())
      const blockers = [
        ...[...svg.querySelectorAll('.wardley-links line, .wardley-trend, .gx-moves line, .gx-note-link')].map(seg),
      ]
      const grow = (b, d) => ({ x: b.x - d, y: b.y - d, width: b.width + 2 * d, height: b.height + 2 * d })
      for (const { text, target } of comments) {
        const g = [...svg.querySelectorAll('.wardley-node--component, .wardley-node--anchor, .wardley-node--pipeline-component')].find((x) => x.querySelector('.wardley-node-label')?.textContent === target)
        const c = g && (g.querySelector('.gx-user-node') ?? g.querySelector('circle'))
        const sq = g && !c && g.querySelector(':scope > rect') // a pipeline's parent is drawn as a small square
        if (!c && !sq) { warnings.push(`comment "${text}": no component "${target}"`); continue }
        const cx = c ? +c.getAttribute('cx') : +sq.getAttribute('x') + +sq.getAttribute('width') / 2
        const cy = c ? +c.getAttribute('cy') : +sq.getAttribute('y') + +sq.getAttribute('height') / 2
        const r = c ? +c.getAttribute('r') : +sq.getAttribute('width') / 2
        const lines = text.split('|').map((s) => s.trim())
        const grp = make('g', { class: 'gx-comment' })
        const t = make('text', { 'font-size': CS, fill: ink, 'font-weight': 400, 'dominant-baseline': 'hanging' })
        lines.forEach((ln, i) => { const ts = make('tspan', { x: 0, dy: i ? CS * 1.35 : 0 }); ts.textContent = ln; t.append(ts) })
        grp.append(t); svg.append(grp)
        const tb = t.getBBox(), w = tb.width + 2 * PAD, h = tb.height + 2 * PAD
        // Three passes, each looser than the last: 1 the connector leaves from the box's centre line;
        // 2 it may leave from a corner or an edge midpoint; 3 it may cross a muted past/future label
        // (reported as a warning, so the map's author sees it).
        // the node's own ring, and whatever box holds it (a pipeline box, a submap square), never block its own connector
        const isNode = (o) => cx >= o.x - 1 && cx <= o.x + o.width + 1 && cy >= o.y - 1 && cy <= o.y + o.height + 1
        const isMuted = (o) => mutedLabels.some((m) => m.x === o.x && m.y === o.y && m.width === o.width)
        let best = null, pass = 0
        for (pass = 1; pass <= 3 && !best; pass++) {
          for (let y = vb.y + MARGIN; y + h <= vb.y + vb.height - MARGIN; y += STEP) for (let x = vb.x + MARGIN; x + w <= vb.x + vb.width - MARGIN; x += STEP) {
            const box = { x, y, width: w, height: h }, big = grow(box, 8)
            if (obstacles.some((o) => hit(big, o)) || commentBoxes.some((o) => hit(big, o.b))) continue
            if (blockers.some((l) => crosses(l, big))) continue
            const bx = x + w / 2, by = y + h / 2
            const starts = []
            { const dx = cx - bx, dy = cy - by, k = Math.min((w / 2 + 2) / Math.abs(dx || 1e-9), (h / 2 + 2) / Math.abs(dy || 1e-9)); starts.push([bx + dx * k, by + dy * k, 0]) }
            if (pass >= 2) for (const [sx, sy] of [[x - 2, y - 2], [x + w + 2, y - 2], [x - 2, y + h + 2], [x + w + 2, y + h + 2], [bx, y - 2], [bx, y + h + 2], [x - 2, by], [x + w + 2, by]]) starts.push([sx, sy, 40])
            for (const [sx, sy, penalty] of starts) {
              // the connector: diagonal, crossing no label or node
              const ang = Math.atan2(Math.abs(cy - sy), Math.abs(cx - sx)) * 180 / Math.PI
              if (ang < 18 || ang > 72) continue
              const len = Math.hypot(cx - sx, cy - sy)
              const line = { x1: sx, y1: sy, x2: cx - ((cx - sx) / len) * (r + 4), y2: cy - ((cy - sy) / len) * (r + 4) }
              const ownBox = grow(box, 1)
              let crossedMuted = false
              const blocked = obstacles.some((o) => {
                if (isNode(o) || (hit(o, ownBox) && o.width <= w)) return false
                if (!crosses(line, grow(o, 2))) return false
                if (pass >= 3 && isMuted(o)) { crossedMuted = true; return false }
                return true
              })
              if (blocked || commentBoxes.some((o) => crosses(line, o.b))) continue
              const score = len + penalty + (len < 60 ? 200 : 0)
              if (!best || score < best.score) best = { box, line, score, crossedMuted }
            }
          }
        }
        if (!best) { warnings.push(`comment "${text}" on "${target}": no free area found; shorten it, split lines with |, or move components`); grp.remove(); continue }
        if (best.crossedMuted) warnings.push(`comment "${lines[0]}": its line crosses a past/future label; move a component if it matters`)
        const { box, line } = best
        t.setAttribute('transform', `translate(${box.x + PAD}, ${box.y + PAD})`)
        grp.prepend(make('rect', { x: box.x, y: box.y, width: box.width, height: box.height, rx: 4, fill, stroke: ink, 'stroke-opacity': 0.45, 'stroke-width': 1 }))
        grp.prepend(make('line', { ...line, stroke: ink, 'stroke-opacity': 0.55, 'stroke-width': 1, class: 'gx-comment-link' }))
        commentBoxes.push({ name: `comment "${lines[0]}"`, b: box, g: grp })
        commentLines.push(['a comment line', line])
      }
    }

    // checks. Errors: a label off the map, on another label, or on another node. Warnings: a label crossed by a
    // link, an evolve arrow or an axis. Text boxes are inset 2px so glyph padding doesn't count as a touch.
    const boxes = [
      ...commentBoxes,
      ...[...svg.querySelectorAll('.gx-zone-label')].map((t) => ({ name: `zone "${t.textContent}"`, b: inset(t.getBBox()), g: t.parentNode })),
      ...[...svg.querySelectorAll('.wardley-node-label')].map((t) => ({ name: t.textContent, b: inset(t.getBBox()), g: t.parentNode })),
      ...[...svg.querySelectorAll('.wardley-notes text')].map((t) => ({ name: `note "${t.textContent}"`, b: inset(t.getBBox()), g: t.parentNode })),
      ...[...svg.querySelectorAll('.gx-bracket text')].map((t) => ({ name: `bracket "${t.textContent}"`, b: inset(wrapBBox(t)), g: t.closest('.gx-bracket') })),
      ...[...svg.querySelectorAll('.wardley-axes text')].map((t) => ({ name: `axis "${t.textContent.trim()}"`, b: inset(wrapBBox(t)), g: t.parentNode })),
    ]
    const lines = [
      ...commentLines,
      ...[...svg.querySelectorAll('.wardley-links line')].map((e) => ['a link', seg(e)]),
      ...[...svg.querySelectorAll('.wardley-trend')].map((e) => ['an evolve arrow', seg(e)]),
      ...[...svg.querySelectorAll('.wardley-axes line')].map((e) => ['an axis', seg(e)]),
      ...bracketSegs.map((s) => ['a domain bracket', s]),
    ]
    for (const { name, b } of boxes) if (b.x < vb.x || b.x + b.width > vb.x + vb.width || b.y < vb.y) errors.push(`label "${name}" runs off the map; move the component or set %% label-side`)
    boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => { if (hit(a.b, b.b)) errors.push(`labels "${a.name}" and "${b.name}" overlap; move a component or set %% label-side`) }))
    for (const a of boxes) for (const g of nodes) if (g !== a.g) {
      const c = g.querySelector('.gx-user-node') ?? g.querySelector('circle')
      if (c && hit(a.b, c.getBBox())) errors.push(`label "${a.name}" covers the node of "${g.querySelector('.wardley-node-label')?.textContent}"`)
    }
    for (const a of boxes) for (const ring of ghosts) if (hit(a.b, ring.getBBox())) errors.push(`label "${a.name}" covers an evolve target; move a component or set %% label-side`)
    for (const a of boxes) for (const [kind, l] of lines) if (!allowCrossing.includes(a.name) && crosses(l, a.b)) warnings.push(`label "${a.name}" is crossed by ${kind}; consider %% label-side or moving the component`)
    return { errors, warnings: [...new Set(warnings)] }
  }}` })
  await page.evaluate(async (config) => { await document.fonts.load('16px Sora'); await document.fonts.load('600 16px Sora'); await document.fonts.load('16px "JetBrains Mono"'); window.mermaid.initialize(config) }, config)
  mkdirSync(outDir, { recursive: true })
  for (const file of sources) {
    const name = path.basename(file, '.mmd')
    const source = readFileSync(path.join(srcDir, file), 'utf8')
    try {
      // Wardley customisation lives in Mermaid comments, so the file stays valid Mermaid anywhere else:
      //   %% label-side "Component" left|right|above|below   force a label side
      //   %% need "Component"                     mark a user need the links don't show
      //   %% not-need "Component"                 a component a user links to that isn't a need
      //   %% allow-crossing "Component"           accept lines crossing this label (hubs); labels have a halo
      //   %% hide-x-axis | %% hide-y-axis         reveal layers: hide an axis until its click
      //   %% domain-bracket "Title" topV bottomV  gold bracket on the left edge over a visibility range
      //   %% constraint "Component"               cross-striped bar: the ToC bottleneck mark
      //   %% submap "Component"                   square: this component has its own map
      //   %% move / future / past / future-link   movement notation, see layoutWardley
      // and Mermaid's own `component X [v, e] label [dx, dy]` keeps Mermaid's placement for that component.
      const unq = (s) => s.trim().replace(/^"(.*)"$/, '$1')
      const directive = (word) => [...source.matchAll(new RegExp(`^\\s*%%\\s*${word}\\s+"([^"]+)"(?:\\s+(left|right|above|below))?\\s*$`, 'gm'))]
      const sideOverrides = Object.fromEntries(directive('label-side').filter((m) => m[2]).map((m) => [m[1], m[2]]))
      const users = [...source.matchAll(/^\s*anchor\s+("[^"]+"|.+?)\s*\[/gm)].map((m) => unq(m[1]))
      const notNeeds = directive('not-need').map((m) => m[1])
      const needs = [
        ...[...source.matchAll(/^\s*("[^"]+"|[^"%\n]+?)\s*(?:->|-->|\+>|-\.->)\s*("[^"]+"|[^;\n]+?)\s*(?:;.*)?$/gm)]
          .filter((m) => users.includes(unq(m[1]))).map((m) => unq(m[2])),
        ...directive('need').map((m) => m[1]),
      ].filter((n) => !notNeeds.includes(n))
      const manual = [...source.matchAll(/^\s*component\s+("[^"]+"|.+?)\s*\[[^\]]*\]\s*label\s*\[/gm)].map((m) => unq(m[1]))
      const hideX = /^\s*%%\s*hide-x-axis\s*$/m.test(source)
      const hideY = /^\s*%%\s*hide-y-axis\s*$/m.test(source)
      const brackets = [...source.matchAll(/^\s*%%\s*domain-bracket\s+"([^"]+)"\s+([\d.]+)\s+([\d.]+)\s*$/gm)].map((m) => ({ title: m[1], top: +m[2], bottom: +m[3] }))
      const constraints = directive('constraint').map((m) => m[1])
      const forceCaptionOff = /^\s*%%\s*force-caption-off\s*$/m.test(source)
      //   %% arrow-scale N   size of the accelerator / deaccelerator block arrows (default 2.5)
      const arrowScale = +(source.match(/^\s*%%\s*arrow-scale\s+([\d.]+)\s*$/m)?.[1] ?? 2.5)
      //   %% arrow-span E1 E2   draw push / hold block arrows slim, spanning evolution E1 to E2
      const spanMatch = source.match(/^\s*%%\s*arrow-span\s+([\d.]+)\s+([\d.]+)\s*$/m)
      const arrowSpan = spanMatch ? [+spanMatch[1], +spanMatch[2]] : null
      // movement notation, see layoutWardley
      const moves = [...source.matchAll(/^\s*%%\s*move\s+"([^"]+)"\s+([\d.]+)\s*$/gm)].map((m) => ({ name: m[1], e: +m[2] }))
      const pasts = [...source.matchAll(/^\s*%%\s*past\s+"([^"]+)"\s+([\d.]+)(?:\s+"([^"]+)")?\s*$/gm)].map((m) => ({ name: m[1], e: +m[2], label: m[3] }))
      const futures = [...source.matchAll(/^\s*%%\s*future\s+"([^"]+)"(?:\s+"([^"]+)")?\s*$/gm)].map((m) => ({ name: m[1], label: m[2] }))
      const pictures = [...source.matchAll(/^\s*%%\s*picture\s+"([^"]+)"\s+([\d.]+)\s+([\d.]+)\s+(\d+)\s+(\d+)\s*$/gm)].map((m) => {
        const file = path.join(base, m[1]), ext = path.extname(file).slice(1).replace('jpg', 'jpeg') // relative to the workspace, like the deck's own image paths
        return { href: `data:image/${ext};base64,${readFileSync(file).toString('base64')}`, v: +m[2], e: +m[3], w: +m[4], h: +m[5] }
      })
      const highlights = [...source.matchAll(/^\s*%%\s*highlight\s+"([^"]+)"\s*$/gm)].map((m) => m[1])
      const labelSize = +(source.match(/^\s*%%\s*label-size\s+(\d+)\s*$/m)?.[1] ?? 16)
      //   %% comment "Line one | line two" "Component"   a boxed comment the renderer places in free space, see layoutWardley
      const comments = [...source.matchAll(/^\s*%%\s*comment\s+"([^"]+)"\s+"([^"]+)"\s*$/gm)].map((m) => ({ text: m[1], target: m[2] }))
      const noteFor = [...source.matchAll(/^\s*%%\s*note-for\s+"([^"]+)"\s+"([^"]+)"\s*$/gm)].map((m) => ({ note: m[1], target: m[2] }))
      const futureLinks = [...source.matchAll(/^\s*%%\s*future-link\s+"([^"]+)"\s+"([^"]+)"\s*$/gm)].map((m) => ({ a: m[1], b: m[2] }))
      const pipeArrows = [...source.matchAll(/^\s*%%\s*pipeline-arrow\s+"([^"]+)"\s+"([^"]+)"\s*$/gm)].map((m) => ({ a: m[1], b: m[2] }))
      //   %% zone "Label" "#colour" v,e v,e v,e ...   a soft area behind the map: a polygon of 3 to 10 corners in map
      //                                              coordinates, drawn with rounded corners; one connected shape
      //   %% dot V E                                  an unnamed component ring, for a crowd of things inside a zone
      const zones = [...source.matchAll(/^\s*%%\s*zone\s+"([^"]+)"\s+"([^"]+)"\s+([\d.,\s]+)$/gm)].map((m) => ({ label: m[1], color: m[2], pts: m[3].trim().split(/\s+/).map((p) => p.split(',').map(Number)) }))
      for (const z of zones) if (z.pts.length < 3 || z.pts.length > 10 || z.pts.some((p) => p.length !== 2 || p.some(isNaN))) throw new Error(`zone "${z.label}": 3 to 10 corners as v,e pairs`)
      const dots = [...source.matchAll(/^\s*%%\s*dot\s+([\d.]+)\s+([\d.]+)\s*$/gm)].map((m) => ({ v: +m[1], e: +m[2] }))
      // Graph checks on the source, before anything is drawn: what the links mean, not where they sit.
      //   error    a link runs upward: the dependent must sit higher than what it depends on
      //   warning  a component no user reaches (orphan): who needs it?
      //   warning  a shortcut, A -> C when A -> B -> C exists: redundant, or a real direct need? (%% direct-need "A" "C" accepts it)
      //   warning  a component with nothing below it outside commodity: what does it depend on? (%% leaf "X" accepts it)
      //   %% partial          a reveal step, not a finished map: only the upward-link check runs (gen-reveal adds it)
      //   %% no-graph-check   a legend or a notation sample: no graph checks at all
      const graph = (() => {
        const errs = [], warns = []
        if (/^\s*%%\s*no-graph-check\s*$/m.test(source)) return { errs, warns }
        const partial = /^\s*%%\s*partial\s*$/m.test(source)
        const pos = {}
        for (const m of source.matchAll(/^\s*(anchor|component)\s+("[^"]+"|[^\[\n]+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/gm)) pos[unq(m[2])] = { v: +m[3], e: +m[4], user: m[1] === 'anchor' }
        const stages = {}
        for (const m of source.matchAll(/^\s*pipeline\s+("[^"]+"|[^{\n]+?)\s*\{([\s\S]*?)\}/gm)) for (const c of m[2].matchAll(/component\s+("[^"]+"|[^\[\n]+?)\s*\[/g)) stages[unq(c[1])] = unq(m[1])
        const links = [...source.matchAll(/^\s*("[^"]+"|[^"%\n]+?)\s*(?:->|-->|\+>|-\.->)\s*("[^"]+"|[^;\n]+?)\s*(?:;.*)?$/gm)].map((m) => [unq(m[1]), unq(m[2])]).filter(([a, b]) => pos[a] && pos[b])
        const directNeeds = [...source.matchAll(/^\s*%%\s*direct-need\s+"([^"]+)"\s+"([^"]+)"\s*$/gm)].map((m) => `${m[1]} -> ${m[2]}`)
        const leaves = [...source.matchAll(/^\s*%%\s*leaf\s+"([^"]+)"\s*$/gm)].map((m) => m[1])
        for (const [a, b] of links) if (pos[a].v <= pos[b].v) errs.push(`link "${a}" -> "${b}" runs upward: "${a}" depends on "${b}", so it must sit higher`)
        if (partial) return { errs, warns }
        const below = {}; for (const [a, b] of links) (below[a] ??= []).push(b)
        const seen = new Set(); const walk = (n) => { if (seen.has(n)) return; seen.add(n); for (const b of below[n] ?? []) walk(b) }
        for (const n in pos) if (pos[n].user) walk(n)
        const hasUser = Object.values(pos).some((p) => p.user)
        for (const n in pos) if (hasUser && !seen.has(n) && !stages[n]) warns.push(`"${n}" is reachable from no user: who needs it? Link it, or remove it`)
        const reach = (from, to, skip) => { const s = new Set(); const go = (n) => { for (const b of below[n] ?? []) { if (n === from && b === skip) continue; if (b === to) return true; if (!s.has(b)) { s.add(b); if (go(b)) return true } } return false }; return go(from) }
        for (const [a, c] of links) if (!directNeeds.includes(`${a} -> ${c}`) && reach(a, c, c)) warns.push(`"${a}" -> "${c}" is a shortcut: "${a}" already reaches "${c}" through another component. A real direct need? Then add %% direct-need "${a}" "${c}"`)
        const parents = Object.values(stages) // a pipeline's stages are what it is made of; it needs no link below
        for (const n in pos) if (!pos[n].user && !below[n] && !stages[n] && !parents.includes(n) && pos[n].e < 0.75 && !leaves.includes(n) && seen.has(n)) warns.push(`"${n}" depends on nothing and is not a commodity: what does it need to work? Add a link, or %% leaf "${n}"`)
        return { errs, warns }
      })()
      let { svg, errors, warnings } = await page.evaluate(async (id, text, opts) => {
        const out = document.getElementById('out')
        out.innerHTML = (await window.mermaid.render(id, text)).svg
        const el = out.querySelector('svg')
        const result = el.getAttribute('aria-roledescription') === 'wardley' ? window.layoutWardley(el, opts) : { errors: [], warnings: [] }
        return { svg: el.outerHTML, ...result }
      }, `gx-${name}`, source, { overrides: sideOverrides, needs, manual, allowCrossing: directive('allow-crossing').map((m) => m[1]), gold: T.gold, ink: T.ink, fill: T.deep900, hideX, hideY, brackets, constraints, submaps: directive('submap').map((m) => m[1]), forceCaptionOff, arrowScale, arrowSpan, moves, futures, pasts, futureLinks, pipeArrows, pictures, highlights, noteFor, comments, zones, dots, labelSize })
      errors = [...graph.errs, ...errors]; warnings = [...graph.warns, ...warnings]
      // embed the fonts (some renderers emit no <style> at all) and give the SVG its real size, so an <img>
      // shows it at 1:1 when the viewBox matches the slide's body area
      const [, w, h] = svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/) ?? []
      svg = svg
        .replace(/ style="max-width: [^"]*"/, '')
        // Mermaid's Wardley beta hard-codes black for anchor labels; nothing is black on this dark ground
        .replace(/fill="#000"/g, `fill="${T.ink}"`)
        .replace(/ width="100%"/, w ? ` width="${w}" height="${h}"` : '')
        .replace(/(<svg[^>]*>)/, `$1<style>${fontCss} text{font-family:Sora,sans-serif} .wardley-node-label{paint-order:stroke;stroke:${T.deep900};stroke-width:5px;stroke-linejoin:round}</style>`)
      if (!checkOnly) writeFileSync(path.join(outDir, `${name}.svg`), svg)
      console.log(`${errors.length ? 'FAIL' : warnings.length ? 'warn' : 'ok  '} ${checkOnly ? path.relative(root, path.join(srcDir, file)) : `diagrams/${file} -> assets/diagrams/${name}.svg`}`)
      for (const p of errors) console.log(`       error: ${p}`)
      for (const p of warnings) console.log(`       warn:  ${p}`)
      if (errors.length) failed++
    } catch (e) {
      failed++
      console.log(`FAIL diagrams/${file}: ${e.message.split('\n')[0]}`)
    }
  }
} finally {
  await browser.close()
}
process.exit(failed ? 1 : 0)
