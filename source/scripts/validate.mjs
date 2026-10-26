#!/usr/bin/env node
// Validate a Marp deck against the GalaxiTech layout contract by rendering it in headless Chrome
// and measuring every slide. Layout values are read from the theme's CSS tokens, never hard-coded.
//   node scripts/validate.mjs [deck.md] [--shots <dir>] [--json]
// Exit code 0 = no errors (warnings allowed), 1 = errors, 2 = could not run.
import { marpCli } from '@marp-team/marp-cli'
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const option = (name) => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1] }
const shotsDir = option('--shots')
const asJson = args.includes('--json')
const deck = path.resolve(args.find((a) => !a.startsWith('--')) ?? 'example.md')
if (!existsSync(deck)) { console.error(`Deck not found: ${deck}`); process.exit(2) }

const HERO = ['title', 'divider', 'statement', 'end', 'map'] // no eyebrow/title anchor; map is full-bleed
const KNOWN = [...HERO, 'code', 'component', 'split', 'reverse', 'show-grid', 'exercise', 'inset']

const browserPath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync)
if (!browserPath) { console.error('No Chrome/Edge found; set CHROME_PATH.'); process.exit(2) }

// Render next to the deck so relative asset paths resolve; the "bare" template lays every slide out at once.
const out = path.join(path.dirname(deck), `.${path.basename(deck, '.md')}.validate.html`)
const code = await marpCli([deck, '--template', 'bare', '--html', '-o', out, '--quiet'])
if (code !== 0 || !existsSync(out)) { console.error('marp failed to render the deck'); process.exit(2) }

// CI runners need --no-sandbox for headless Chrome
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ['--allow-file-access-from-files', ...(process.env.CI ? ['--no-sandbox'] : [])] })
const pageErrors = []
let report
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 })
  page.on('pageerror', (e) => pageErrors.push(`script error: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && pageErrors.push(`console error: ${m.text()}`))
  page.on('requestfailed', (r) => pageErrors.push(`failed to load: ${decodeURI(r.url())}`))
  await page.goto(pathToFileURL(out).href, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await new Promise((r) => setTimeout(r, 400)) // let React islands mount

  report = await page.evaluate((HERO, KNOWN) => {
    const TOL = 1
    const CONTENT = 'h1, h2, h3, h4, h5, h6, p, li, pre, table, blockquote, img, iframe, .stage, .panel, .btn, .stat'
    // fonts are loaded lazily, so only a font the page tried and failed to load is an error
    const missingFonts = [...document.fonts].filter((f) => f.status === 'error').map((f) => `${f.family} ${f.weight}`)
    // tokens are calc() expressions, so resolve them by measuring a probe; NaN must never pass a check silently
    const px = (s, v) => {
      const probe = document.createElement('div')
      probe.style.cssText = `position:absolute;visibility:hidden;width:var(${v})`
      s.appendChild(probe); const w = probe.getBoundingClientRect().width / (s.getBoundingClientRect().width / 1280); probe.remove()
      if (!getComputedStyle(s).getPropertyValue(v).trim() || !Number.isFinite(w)) throw new Error(`theme token ${v} is missing`)
      return Math.round(w * 100) / 100
    }
    const text = (e) => (e?.textContent || '').trim().replace(/\s+/g, ' ')
    const label = (e) => `<${e.tagName.toLowerCase()}${typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : ''}>${text(e) ? ` "${text(e).slice(0, 40)}"` : ''}`
    const outside = (e) => e.closest('header, footer, script, style, link, .media, .brand')

    const slides = [...document.querySelectorAll('section')].map((s, i) => {
      const box = s.getBoundingClientRect(), k = box.width / 1280, H = box.height / k, W = 1280
      const rel = (e) => { const r = e.getBoundingClientRect(); return { top: (r.top - box.top) / k, bottom: (r.bottom - box.top) / k, left: (r.left - box.left) / k, right: (r.right - box.left) / k, h: r.height } }
      const t = { margin: px(s, '--margin'), top: px(s, '--margin-top'), bottom: px(s, '--margin-bottom'), eyebrowSize: px(s, '--eyebrow-size'), titleSize: px(s, '--title-size'), titleTop: px(s, '--title-top'), column: px(s, '--column'), gutter: px(s, '--gutter') }
      const classes = s.className.split(/\s+/).filter(Boolean)
      const hero = classes.some((c) => HERO.includes(c)), split = classes.includes('split')
      const errors = [], warnings = []
      for (const c of classes) if (!KNOWN.includes(c)) warnings.push(`unknown slide class "${c}"`)
      if (classes.includes('show-grid')) errors.push('show-grid is an authoring aid; remove it before presenting')

      const content = [...s.querySelectorAll(CONTENT)].filter((e) => !outside(e) && rel(e).h > 0)
      const eyebrow = content.find((e) => e.tagName === 'H3')
      const title = content.find((e) => e.tagName === 'H1' || e.tagName === 'H2')

      // 1. Fixed anchor: on content slides the eyebrow and title have the same position and size everywhere
      if (!hero) {
        if (!title) errors.push('content slide has no # or ## title')
        if (!eyebrow) warnings.push('content slide has no ### eyebrow')
        const expectTitleTop = eyebrow ? t.titleTop : t.top
        if (eyebrow && Math.abs(rel(eyebrow).top - t.top) > TOL) errors.push(`eyebrow at y=${Math.round(rel(eyebrow).top)}, expected ${t.top}`)
        if (title && Math.abs(rel(title).top - expectTitleTop) > TOL) errors.push(`title at y=${Math.round(rel(title).top)}, expected ${expectTitleTop}`)
        if (eyebrow && Math.abs(parseFloat(getComputedStyle(eyebrow).fontSize) - t.eyebrowSize) > 0.5) errors.push(`eyebrow is ${getComputedStyle(eyebrow).fontSize}, expected ${t.eyebrowSize}px`)
        if (title && Math.abs(parseFloat(getComputedStyle(title).fontSize) - t.titleSize) > 0.5) errors.push(`title is ${getComputedStyle(title).fontSize}, expected ${t.titleSize}px`)
        if (title && rel(title).h / k > parseFloat(getComputedStyle(title).lineHeight) * 2 + TOL) warnings.push('title wraps to 3+ lines; shorten it')
        const first = content[0]
        if (first && first !== eyebrow && first !== title) errors.push(`${label(first)} sits above the title; the eyebrow/title must come first`)
      }

      // 2. Overflow: content stays inside the margins and nothing is clipped inside a box
      const bottomLimit = H - t.bottom, rightLimit = W - t.margin
      const fullBleed = classes.includes('map'), inFigure = (e) => fullBleed && (e.matches('img') || !!e.querySelector('img'))
      const low = content.filter((e) => !inFigure(e) && rel(e).bottom > bottomLimit + TOL).sort((a, b) => rel(b).bottom - rel(a).bottom)[0]
      if (low) errors.push(`overflows the bottom margin: ${label(low)} ends at y=${Math.round(rel(low).bottom)}, limit ${bottomLimit}`)
      if (!split) for (const e of content) if (!inFigure(e) && rel(e).right > rightLimit + TOL) errors.push(`${label(e)} runs past the right margin (x=${Math.round(rel(e).right)}, limit ${rightLimit})`)
      for (const e of s.querySelectorAll('pre, .panel, .stage, td, iframe')) {
        if (outside(e)) continue
        if (e.scrollWidth > e.clientWidth + 2) errors.push(`${label(e)} is clipped horizontally by ${e.scrollWidth - e.clientWidth}px (line too long)`)
        if (e.scrollHeight > e.clientHeight + 2) errors.push(`${label(e)} is clipped vertically by ${e.scrollHeight - e.clientHeight}px`)
      }

      // 3. 12-column grid: every .cols child starts and ends on a column line; split text stays in columns 1-6
      const step = t.column + t.gutter
      const starts = Array.from({ length: 12 }, (_, c) => t.margin + c * step)
      const ends = Array.from({ length: 12 }, (_, c) => t.margin + c * step + t.column)
      const near = (x, lines) => lines.some((l) => Math.abs(x - l) <= TOL)
      for (const cols of s.querySelectorAll('.cols')) {
        if (outside(cols)) continue
        // the container itself must keep the 12 equal tracks; an override makes children wrap and stack
        const tracks = getComputedStyle(cols).gridTemplateColumns.split(' ').map(parseFloat).map((w) => w / k)
        if (tracks.length !== 12 || tracks.some((w) => Math.abs(w - t.column) > 0.5)) {
          errors.push(`${label(cols)} overrides the 12-column grid (${tracks.length} tracks); remove the inline style and use presets or .span-N`)
          continue
        }
        for (const child of cols.children) {
          const r = rel(child)
          if (!r.h) continue
          if (!near(r.left, starts) || !near(r.right, ends))
            errors.push(`${label(child)} is off the 12-column grid (x=${Math.round(r.left)}–${Math.round(r.right)}); use the .cols presets or .span-N classes, not custom widths`)
        }
      }
      if (split && classes.includes('reverse')) {
        // split reverse: media on the left half, text on columns 7-12
        const textStart = starts[6]
        for (const e of content) if (!e.closest('.media') && rel(e).left < textStart - TOL) errors.push(`${label(e)} crosses into the media half (x=${Math.round(rel(e).left)}, limit ${Math.round(textStart)})`)
        const footer = s.querySelector('footer')
        if (footer && rel(footer).h && rel(footer).left < textStart - TOL) errors.push(`footer runs into the media half (x=${Math.round(rel(footer).left)}, limit ${Math.round(textStart)})`)
      } else if (split) {
        const textEnd = ends[5]
        for (const e of content) if (!e.closest('.media') && rel(e).right > textEnd + TOL) errors.push(`${label(e)} crosses into the media half (x=${Math.round(rel(e).right)}, limit ${Math.round(textEnd)})`)
        const footer = s.querySelector('footer')
        if (footer && rel(footer).h && rel(footer).right > textEnd + TOL) errors.push(`footer runs into the media half (x=${Math.round(rel(footer).right)}, limit ${Math.round(textEnd)}); set a shorter <!-- _footer: "…" --> on this slide`)
      }

      // 3b. Overlapping text: no two blocks of text on the slide may cover each other (header, footer, page
      // number and positioned elements included). Inline children are part of their block, so only blocks count.
      const textBlocks = [...s.querySelectorAll('*')].filter((e) => {
        // Marp wraps every slide in an <svg>, so only an svg inside the slide is excluded
        if (e.closest('pre, .stage, script, style') || e.closest('svg') !== s.closest('svg') || !rel(e).h) return false
        if (getComputedStyle(e).display.startsWith('inline') && e.parentElement !== s) return false
        return [...e.childNodes].some((n) => n.nodeType === 3 && n.data.trim())
      })
      textBlocks.forEach((a, i) => textBlocks.slice(i + 1).forEach((b) => {
        if (a.contains(b) || b.contains(a)) return
        const ra = rel(a), rb = rel(b)
        if (ra.left < rb.right - TOL && rb.left < ra.right - TOL && ra.top < rb.bottom - TOL && rb.top < ra.bottom - TOL)
          errors.push(`text overlaps: ${label(a)} and ${label(b)}`)
      }))

      // 3c. map slides: the figure must be 16:9 so it fills the slide without bars, and nothing but the label may sit on it
      if (fullBleed) {
        const img = s.querySelector('img')
        if (!img) errors.push('map slide has no image')
        else if (img.naturalWidth && Math.abs(img.naturalWidth / img.naturalHeight - 16 / 9) > 0.01) warnings.push(`map image is ${img.naturalWidth}×${img.naturalHeight}, not 16:9; render it at 1280 × 720 to fill the slide`)
        for (const e of content) if (!inFigure(e) && e.tagName !== 'H3') errors.push(`${label(e)} on a map slide; only a ### label is allowed`)
      }

      // 4. Assets and islands
      for (const img of s.querySelectorAll('img')) if (!img.complete || !img.naturalWidth) errors.push(`broken image: ${img.getAttribute('src')}`)
      for (const isl of s.querySelectorAll('[data-gx]')) if (!isl.children.length && !isl.shadowRoot) errors.push(`React island "${isl.dataset.gx}" did not render`)

      // 5. Typography: a single short word alone on the last line of a title, subtitle or paragraph
      for (const e of content.filter((e) => /^(H1|H2|P|LI)$/.test(e.tagName) && !e.closest('pre, .stage, table'))) {
        // measure each word's line; skip nested lists so an <li>'s own text is judged alone
        const words = []
        const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest('ul ul, ol ol, li li, li ul, li ol') && n.parentElement.closest('li') !== e ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT })
        for (let n; (n = walker.nextNode());) for (const m of n.data.matchAll(/\S+/g)) {
          const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length)
          const rect = r.getClientRects()[0]; if (rect) words.push({ w: m[0], mid: (rect.top + rect.bottom) / 2 })
        }
        // group words into lines by vertical midpoint: inline `code` sits a few px off the text around it,
        // so a new line starts only when a word is lower by more than half a line
        const half = parseFloat(getComputedStyle(e).lineHeight) * k / 2 || 12
        const lines = []
        for (const w of words.sort((a, b) => a.mid - b.mid)) {
          if (lines.length && w.mid - lines.at(-1).mid < half) lines.at(-1).words.push(w)
          else lines.push({ mid: w.mid, words: [w] })
        }
        if (lines.length < 2) continue
        const lastLine = lines.at(-1).words
        if (lastLine.length === 1) warnings.push(`${label(e)} leaves "${lastLine[0].w}" alone on its last line; rephrase or shorten`)
      }

      // fill: how much of the body area (below the margin, above the bottom margin) is used
      const used = content.length ? Math.max(...content.map((e) => rel(e).bottom)) : t.top
      const fill = hero ? null : Math.round(((used - t.top) / (H - t.top - t.bottom)) * 100)

      // 6. House style
      const marks = s.querySelectorAll('mark').length - s.querySelectorAll('pre mark').length
      if (marks > 1) warnings.push(`${marks} <mark> highlights; use one per slide`)

      return { n: i + 1, classes, fill, title: text(title || s).slice(0, 50), errors: [...new Set(errors)], warnings }
    })
    return { missingFonts, slides }
  }, HERO, KNOWN)

  if (shotsDir) {
    mkdirSync(shotsDir, { recursive: true })
    for (const [i, el] of (await page.$$('section')).entries())
      await el.screenshot({ path: path.join(shotsDir, `slide-${String(i + 1).padStart(2, '0')}.png`) })
  }
} finally {
  await browser.close()
  rmSync(out, { force: true })
}

report.pageErrors = [...new Set(pageErrors)]
const errorCount = report.slides.reduce((n, s) => n + s.errors.length, 0) + report.pageErrors.length + report.missingFonts.length
if (asJson) console.log(JSON.stringify(report, null, 2))
else {
  for (const s of report.slides) {
    console.log(`${s.errors.length ? 'FAIL' : s.warnings.length ? 'warn' : 'ok  '} ${String(s.n).padStart(2)} ${s.fill == null ? '    ' : (s.fill + '%').padStart(4)} [${s.classes.join(' ') || 'default'}] ${s.title}`)
    for (const e of s.errors) console.log(`       error: ${e}`)
    for (const w of s.warnings) console.log(`       warn:  ${w}`)
  }
  for (const f of report.missingFonts) console.log(`FAIL font not loaded: ${f}`)
  for (const e of report.pageErrors) console.log(`FAIL ${e}`)
  console.log(`\n${report.slides.length} slides, ${errorCount} error(s)${shotsDir ? `, screenshots in ${shotsDir}` : ''}`)
}
process.exit(errorCount ? 1 : 0)
