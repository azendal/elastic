# Elastic Next

A modern, pure-CSS, lightweight layout framework. Built with native CSS Grid, Flexbox, Container Queries, and Subgrid. Completely self-contained in a single file with **zero JavaScript** and **zero external dependencies** (no jQuery, no build step, no NPM scripts required).

Developed as the next-generation replacement of the classic Elastic CSS framework.

---

## Features

- **CSS Grid & Flexbox Power**: Semantic grid columns (1-12) and rows (1-6) with automatic spacing.
- **Subgrid Alignment**: Direct support for 2D subgrid track sharing to perfectly align child components across grid lanes.
- **Container Queries**: Components change layouts relative to their *container's width* rather than the global viewport width.
- **App-Centric Viewport Safeties**: Native height subtractions for headers and toolbars (`.h-screen-safe`) to design web application interfaces.
- **Logical Properties**: Implemented with future-proof, RTL-safe logical spacing (`margin-inline`, `padding-block`, etc.).

---

## Installation

Simply copy `elastic.css` to your project and link to it in your HTML:

```html
<link rel="stylesheet" href="elastic.css" />
```

Or copy the production version from the `production/` directory.

---

## Quick Start & API

### 1. The Grid System
Set a container to `display: grid` with `.grid` and apply column template utilities.

> **Note**: Elastic Next separates variable declarations from layouts to support dynamic overrides (e.g. in container queries). Always pair `.grid-cols-X` / `.grid-rows-X` with their base template helper:

```html
<!-- A 3-column layout -->
<div class="grid grid-cols grid-cols-3 gap-4">
  <div class="col-span-1">Column 1</div>
  <div class="col-span-1">Column 2</div>
  <div class="col-span-1">Column 3</div>
</div>
```

#### Column Classes
- **Base Grid Template**: `.grid-cols` (activates column layout)
- **Column Spans**: `.col-span-1` to `.col-span-12`, `.col-full` (covers entire row)
- **Column Templates**: `.grid-cols-1` to `.grid-cols-12` (sets column count)
- **Column Offsets**: `.col-start-1` to `.col-start-13`

#### Row Classes
- **Base Row Template**: `.grid-rows` (activates row layout)
- **Row Spans**: `.row-span-1` to `.row-span-6`, `.row-full` (covers entire column height)
- **Row Templates**: `.grid-rows-1` to `.grid-rows-6` (sets row count)
- **Row Offsets**: `.row-start-1` to `.row-start-7`

---

### 2. Flexbox System
Use 1D flex layouts for rows, headers, and simple content alignment.

```html
<div class="flex flex-row justify-between items-center gap-4">
  <div>Logo</div>
  <nav class="flex gap-2">
    <a href="#">Dashboard</a>
    <a href="#">Settings</a>
  </nav>
</div>
```

- **Container**: `.flex`
- **Direction**: `.flex-row`, `.flex-col`
- **Wrapping**: `.flex-wrap`, `.flex-nowrap`
- **Flex Child Sizing**: `.flex-grow`, `.flex-shrink`, `.flex-none`

---

### 3. Spacing Utilities (Logical Properties)
All padding and margins align to logical properties (`inline-start`/`inline-end` instead of `left`/`right`) for native bi-directional layout support.

- **Base Class**: `.gap`, `.p`, `.px`, `.py`, `.ps` (padding-start), `.pe` (padding-end)
- **Sizes**:
  - `-1`: `0.25rem`
  - `-2`: `0.5rem`
  - `-4`: `1rem`
  - `-8`: `2rem`

Example: `class="flex gap-4 p-4"`

---

### 4. Container Queries
Establish containment with `.container-query` on a parent component. Descendants will adapt layout size classes based on the parent width.

```html
<div class="container-query">
  <!-- Uses 1 column by default, shifts to 2 columns if container width is >= 640px, and 3 columns if >= 768px -->
  <div class="grid grid-cols cq-grid-cols-2 cq-grid-cols-3 gap-4" style="--grid-cols: repeat(1, 1fr);">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>
```

- **Query Classes**: `.cq-grid-cols-2` (triggers >=640px), `.cq-grid-cols-3` (triggers >=768px), `.cq-flex-row` (flex-direction: row if container is >=640px).

---

### 5. CSS Subgrid
Align elements inside nested components perfectly with sibling elements in the parent grid.

```html
<!-- Parent defines 3 columns and 2 rows -->
<div class="grid grid-cols grid-cols-3 grid-rows gap-4" style="--grid-rows: auto 1fr;">
  
  <!-- Child card spanning both rows of parent grid -->
  <div class="grid subgrid-rows" style="gap: inherit;">
    <!-- Title is in Row 1 -->
    <h3 style="background: rgba(0,0,0,0.1);">Card Title</h3>
    <!-- Body text is in Row 2 -->
    <p>Card Description content...</p>
  </div>
  
</div>
```

- **Subgrid Templates**: `.subgrid-cols` (inherits column tracks), `.subgrid-rows` (inherits row tracks).

---

### 6. App Layouts & Viewport Sizing
Elastic Next makes full-page dashboard and tool layout development simple with native viewport units.

- **Full Screen**: `.w-screen`, `.h-screen`
- **Safe Full Screen Height**: `.h-screen-safe` (calculates `100vh - var(--h-toolbar)`).
  Define `--h-toolbar` (e.g. `70px` or `0px`) in your root style sheet to specify header toolbar height:
  ```css
  :root {
    --h-toolbar: 70px;
  }
  ```
- **Overflow scrolling**: `.scrollable-y`, `.scrollable-x`

---

### 7. Modern CSS Advanced Capabilities
Elastic Next incorporates cutting-edge modern CSS features to deliver robust, high-performance interactions entirely in pure CSS:

#### A. Scoped Layout Isolation (`@scope`)
Prevent styles from leaking or being overridden by wrapping a section in `.scoped-layout`. Standard grid and flex layout classes will take isolated priority inside the subtree:
```html
<div class="scoped-layout">
  <div class="grid grid-cols-2 gap-4">
    <div>Scoped Item 1</div>
    <div>Scoped Item 2</div>
  </div>
</div>
```

#### B. Anchor Positioning (Overlay UI)
Natively align popup tooltips, menus, and dropdowns to trigger buttons without JavaScript scroll/resize listeners:
```html
<!-- Trigger Button -->
<button class="anchor-trigger" style="--anchor-name: --my-tooltip;">
  Hover Me
</button>

<!-- Anchored Overlay -->
<div class="anchor-overlay" style="--anchor-target: --my-tooltip; --anchor-area: block-end inline-start;">
  Tooltip Content
</div>
```
*Configurable Variables*: Set `--anchor-name` on the trigger, and `--anchor-target`, `--anchor-area` (e.g. `block-end inline-start`) on the overlay.

#### C. Entry Micro-Animations (`@starting-style`)
Add smooth initial-render scale and fade-in entry transitions to layout containers or items by using the `.transition-entry` utility:
```html
<div class="transition-entry">
  Animate in on render
</div>
```

#### D. Content-Aware Layouts (`:has()`)
Layout spacing and padding dynamically adapt depending on the contents inside:
* **Sidebar expander**: `.grid:has(> .col-full)` automatically increases row-gap to accommodate horizontal splits.
* **Media spacing safety**: `.flex-col:has(> img)` or `.flex-col:has(> video)` automatically expands item gap size to preserve design proportions around media containers.

---

## Interactive Showcase & Testing
To view a live preview showing all these components (sandbox layouts, responsive analytics dashboards, interactive mock IDE interfaces, and modern CSS tooltip/animation showcases), load:

```
documentation/showcase.html
```

directly in any web browser.
