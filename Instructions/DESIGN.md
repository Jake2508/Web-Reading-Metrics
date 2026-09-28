# DESIGN.md — Booked: Forest Night

Supersedes the previous "Neubrutalism" design system. Ignore every rule from the old file: no black borders, hard offset shadows, primary-colour blocks, Inter or oversized bold type.

Reference mock-up: option **2d** in `Booked Directions.dc.html`.

## Direction

A calm, dark reading app. Deep forest-green surfaces, warm cream text, one brass accent, and a literary serif for figures and headings. It should feel like a well-made personal product: quiet, confident and data-forward, not playful.

- Metrics and charts are the content. Show numbers big and let charts carry the page.
- Book covers are the only source of saturated colour. The UI stays muted around them.
- Hierarchy comes from type scale and spacing, not from borders or colour blocks.
- One accent (brass) marks "the top thing": the #1 author, the featured book's rating, active totals.

## Colour tokens

Define these as CSS custom properties on `:root` and use them everywhere. Don't use raw hex values in components.

```css
:root {
  /* surfaces */
  --bg:            #14261C; /* page background */
  --surface:       #1B3125; /* panels, cards, table body */
  --surface-2:     #1F3B2D; /* active nav item, selected states */
  --border:        #28432F; /* panel borders, chips, dividers inside panels */
  --border-subtle: #243C2E; /* sidebar divider, table row lines, bar tracks */
  --axis:          #3A5A46; /* chart baselines */

  /* text */
  --text:          #EDE9DF; /* primary text */
  --text-muted:    #9DB0A3; /* labels, secondary text, axis labels */
  --text-faint:    #8FA497; /* rank numbers, placeholders */

  /* accent */
  --brass:         #D2A450; /* the single accent */
  --sage:          #7FB08F; /* secondary data colour */
  --on-brass:      #14261C; /* text on brass */
}
```

### Chart / genre palette

Fixed order, and each genre always gets the same colour on every chart:

| Genre | Token | Hex |
|---|---|---|
| Fantasy | `--g1` | `#D2A450` |
| Science Fiction | `--g2` | `#7FB08F` |
| Horror | `--g3` | `#C8705C` |
| Mystery & Thriller | `--g4` | `#7C97B8` |
| History | `--g5` | `#E0C890` |
| Nature | `--g6` | `#A9C48F` |
| Self-Help | `--g7` | `#CFC6B0` |
| All other genres (grouped) | `--g-other` | `#5E7466` |

Single-series charts: the top item is `--brass` and the rest are `--sage` (bar charts), or all bars use one colour (histograms: book length = `--sage`, rating = `--brass`).

### Rules
- No gradients except the genre donut (a `conic-gradient` of genre colours).
- No pure black or pure white.
- Keep text contrast at 4.5:1 or better. `--text-muted` on `--surface` passes; don't go dimmer for real content.

## Typography

Google Fonts: **Literata** (serif) and **Karla** (sans).

```html
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600&family=Karla:wght@400;500;700&display=swap" rel="stylesheet">
```

| Role | Font | Size / weight | Notes |
|---|---|---|---|
| Page title ("Overview", "Library") | Literata | 32px / 400 | |
| Hero name (top author) | Literata | 40px / 400, line-height 1 | |
| Big metric (sidebar totals) | Literata | 38px / 400 | |
| Metric in panel | Literata | 26px / 400 | insights, author stats |
| Panel title | Literata | 18px / 600 | |
| Book title (lists) | Literata | 17px / 600 | |
| Wordmark "Booked" | Literata | 26px / 600 | |
| Eyebrow label | Karla | 11–12px / 700, uppercase, letter-spacing .12–.14em | `--text-muted`, or `--brass` for highlighted panels |
| Body / list text | Karla | 14px / 400–500 | |
| Secondary / meta | Karla | 13px / 400 | `--text-muted` |
| Chart values | Karla | 13px / 700 | |
| Axis / chart labels | Karla | 12px / 500 | `--text-muted` |

Rules: numbers are always Literata. UI chrome (labels, buttons, chips) is always Karla. Use `font-variant-numeric: tabular-nums` in tables and chart labels.

## Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 20, 24, 28, 32px.
- Page padding: 28px top, 32px sides, 36px bottom. Gap between panel rows: 16px. Gap between panels in a row: 16px.
- Panel padding: 22px vertical, 24px horizontal. Internal gap: 14–18px.
- Radius: panels 8px, inputs and nav items 6px, chips and pills 99px, bars 3–4px, covers 2px 4px 4px 2px (spine side tighter).
- Borders: 1px `--border` on panels and inputs. Dividers inside panels: 1px `--border`.
- Shadows: only on book covers: `inset 4px 0 0 rgba(0,0,0,.25), 0 14px 24px -10px rgba(0,0,0,.7)`. Nothing else casts a shadow.

## Layout

App shell: CSS grid `240px 1fr`.

### Sidebar (240px, full height)
- Right border 1px `--border-subtle`. Padding 28px 24px. Vertical gap 32px.
- Wordmark "Booked" + sub-line "Reading dashboard" (Karla 13 muted).
- Nav: Dashboard, Library. Item padding 10px 12px, radius 6px. Active item: `--surface-2` background, `--text`. Inactive items: `--text-muted`.
- **Dashboard only:** below a 1px divider, show the three headline totals stacked (Books read, Pages read, Words read), each as eyebrow + Literata 38 value + muted sub-line.

### Dashboard (main column)
1. Header row: "Overview" (left) and "86 books · 46 authors · 19 genres" (right, muted).
2. Row, 2 equal columns:
   - **Top author panel**: brass eyebrow "Top author · No. 1" plus a `‹ 1 / 3 ›` pager; name; 3 stats (books / % of library / avg pages) above a top divider; 6px share bar (track `--border`, fill `--brass`). The pager cycles the top 3 authors.
   - **Featured book panel**: cover (112×168) on the left. Brass eyebrow "Featured · Highest rated", title, author, genre chip, then pages and rating at the bottom (rating value in `--brass`).
3. Row, 2 columns:
   - **Genre distribution**: 180px donut (116px hole showing total books) plus a legend. Each legend row shows swatch, name, count and % share. Show the top 7 genres, then "N other genres".
   - **Top authors**: ranked rows `01…06`: rank (faint), name, 8px bar (track `--border-subtle`, #1 `--brass`, others `--sage`), count.
4. Row, 2 columns (new metrics, built from existing per-book data):
   - **Book length**: histogram of page counts in buckets `<200, 200s, 300s, 400s, 500–699, 700+`. Bars `--sage`, value above each bar, labels below, baseline `--axis`.
   - **Rating spread**: histogram in buckets `<3.0, 3.0–3.4, 3.5–3.9, 4.0–4.4, 4.5–5`. Bars `--brass`. Show the average rating in the panel header.
5. **Quick insights**: one strip of 6 equal cells joined by 1px `--border` gaps (grid `gap:1px` on a `--border` background, cells `--surface`, outer radius 8px). The cells are Avg pages, Longest book, Shortest book, Avg rating, Genres, Authors. Each cell has an eyebrow, a Literata 26 value and a single-line ellipsised sub-line.

### Library
- Same shell. Sidebar shows nav only, with Library active.
- Header: "Library" title and a Books / Authors segmented toggle (track `--surface`, 1px border; active segment `--border` background).
- Controls row: search input (flex 1), genre dropdown, result count in brass bold ("86 books").
- Table inside one panel. Columns: `52px | 1.5fr | 120px | 80px | 1fr`, i.e. cover, title + author, genre chip, rating, length.
  - Header row: Karla 11 / 700 uppercase muted.
  - Rows: 12px 20px padding, 1px `--border-subtle` bottom border. Cover 44×66.
  - Rating: `★ 4.8` in `--brass`, bold.
  - Length: 6px bar relative to the longest book (track `--border-subtle`, fill `--sage`) plus the page count right-aligned.
- Author view uses the same table pattern: avatar or cover stack, name, books count, avg rating, share bar.

## Components

- **Panel**: `--surface`, 1px `--border`, radius 8, padding 22/24. Title row: Literata 18/600 title on the left, muted context on the right, baseline-aligned.
- **Eyebrow**: Karla 11–12 / 700, uppercase, tracking .12–.14em.
- **Chip**: Karla 12/500, padding 3px 10px, radius 99, `--border` background.
- **Tag (e.g. "New")**: Karla 10/700 uppercase, `--brass` background, `--on-brass` text, radius 3.
- **Input / select**: `--surface`, 1px `--border`, radius 6, padding 12px 16px, placeholder `--text-faint`. Focus: border `--brass`, no glow.
- **Bars**: flat fills and rounded ends. No outlines or gradients. Tracks use `--border-subtle`.
- **Cover**: real cover image, `object-fit: cover`, aspect ratio 2:3, cover radius and shadow as above. Fallback: a `--surface-2` block with the title in Literata.

## Interaction and motion

- Transitions 150–200ms ease-out, on colour, background and opacity only. No translate or bounce.
- Hover: panels and rows lighten to `#203829`. Nav items and toggles move to `--surface-2`. Links and pager arrows turn `--brass`.
- Chart hover: show a small tooltip panel (`--surface-2`, 1px `--border`, radius 6) with the exact value. Dim the other series to 50%.
- Focus-visible: 2px `--brass` outline with 2px offset on every interactive element.
- Respect `prefers-reduced-motion`.

## Don't

- Black outlines, offset or hard shadows, primary-colour blocks.
- More than one accent colour in UI chrome. Genre colours belong only in charts.
- Emoji. Use simple SVG icons (1.5px stroke, `currentColor`) only where needed.
- Filler cards or decorative stats. If a section is empty, cut it.
- Light mode for now. The design is dark-only.
