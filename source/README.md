# Sources

The files the workshop was built from: the deck source, every map as source, the theme, the build
scripts and the research notes. They come from the earlier draft repository,
`DDD-Belgium-Wardley-Map-2026`, with their paths kept, so the scripts run from this folder as they did there.

The finished results are in the rest of this repository: the deck in [`../deck/`](../deck/) (HTML and PDF),
the rendered maps in [`../deck/assets/diagrams/`](../deck/assets/diagrams/), the exercises and the handout.

## What is here

| Path | What it is |
| --- | --- |
| `workspaces/ddd-belgium-wardley/ddd-belgium-wardley.md` | The deck, a Marp markdown file |
| `workspaces/ddd-belgium-wardley/diagrams/*.mmd` | Every map as Mermaid `wardley-beta` source, one file per map (119) |
| `workspaces/ddd-belgium-wardley/diagrams/*.owm` | The same maps in OnlineWardleyMaps format, one per map family (11), written by `gen-reveal.mjs` |
| `workspaces/ddd-belgium-wardley/workshop-plan.md` | The plan: the company, the storyline through the exercises, timings |
| `workspaces/ddd-belgium-wardley/wardley-sources.md` | The reading list: the books that use Wardley maps, with page references and the map redrawn from each |
| `workspaces/ddd-belgium-wardley/pipeline-sources.md` | Research notes on pipelines in Wardley mapping |
| `workspaces/ddd-belgium-wardley/ooda-fivefactors-sources.md` | Research notes on the OODA loop and the five factors |
| `workspaces/ddd-belgium-wardley/schon-annex-maps.md` | Erik Schön's annex of 168 Wardley maps, indexed by mapper |
| `themes/galaxitech.css` | The Marp theme |
| `scripts/gen-reveal.mjs` | Writes the step-by-step reveal maps (`*-reveal-NN.mmd`) and the `.owm` files |
| `scripts/render-diagrams.mjs` | Renders each `.mmd` to SVG in the GalaxiTech look and checks for overlaps |
| `scripts/validate.mjs` | Checks the deck slide by slide (overflow, overlaps, unknown classes) |
| `package.json`, `.marprc.yml` | The npm scripts and the Marp configuration |

## Rebuild it

Needs Node 20 or newer and a local Chrome or Edge (set `CHROME_PATH` if it is not in the default place).
Run everything from this folder:

```bash
npm install
npm run assets   # copy the images and fonts from ../deck/assets, which the deck and the renderer need
npm run ddd      # reveal maps, render every map, validate the deck, build the HTML
```

`npm run diagrams` renders the maps only, `npm run validate` checks the deck only, and `npm run dev`
serves the deck on http://localhost:8080.

The output lands next to the sources, as it did in the draft repository: the maps in
`workspaces/ddd-belgium-wardley/assets/diagrams/` and the deck as `workspaces/ddd-belgium-wardley/ddd-belgium-wardley.html`.
Those folders are ignored by git here. To publish a change, copy the new SVGs to `../deck/assets/diagrams/`
and the HTML to `../deck/`.

`npm run assets` is the only addition to the draft's `package.json`. The images and fonts already live in
`../deck/assets/`, so they are copied in rather than kept twice.

## Held back

Three maps redrawn from all-rights-reserved books are not here: *Enabling Microservice Success* (Sarah Wells)
and the two from *The Value Flywheel Effect* (David Anderson, Mark McCann, Michael O'Reilly). They wait until
the authors answer the request for permission. `wardley-sources.md` says so where they would be.

## Licence

Everything in this folder is CC BY-SA 4.0, as the draft repository was; the full text is in
[`LICENSE`](LICENSE). This includes the maps redrawn from Simon Wardley's CC BY-SA figures, which must keep
that licence. Maps marked "after" another author are redrawn from one figure in that author's book, with
the figure and page named on the map; see `wardley-sources.md`.
