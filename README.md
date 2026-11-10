# Rijan Shrestha — Portfolio & Creative Studio
# Rijan Shrestha — Creative Full-Stack Developer & Design Studio

A minimal, cinematic personal portfolio website for **Rijan Shrestha**, a freelance Graphic Designer, Photographer, and Motion Artist based in Kathmandu, Nepal.
A cyberpunk portfolio and studio hub for **Rijan Shrestha**, a Kathmandu-based Creative Full-Stack Developer (Next.js, React, Databases, Cloud Deployment), Brand Designer, Photographer, and Motion Artist.

- **Live URL / Domain:** [rijanshrestha.info.np](https://rijanshrestha.info.np)
- **Design Identity:** Cyberpunk obsidian (`#07080D`), Volt Acid Lime (`#D5FF3F`), Holographic Cyan (`#00F0FF`), Hyper Magenta (`#FF2A6D`), Electric Iris (`#6B5CFF`), and Warm Cream (`#F4F2E9`) typography using `Orbitron`, `Rajdhani`, `Unbounded`, and `JetBrains Mono`. Includes a toggleable Daylight Lab mode (`#EBEAE2`).
- **Logo Integration:** Exact 45°-chamfered geometric `R` monogram embedded as an inline `<symbol>` (`#rijan-logo-mark`), RGB glitch-split floating corner badge, holographic hero watermark, procedural card stamps, and favicon ([public/favicon.svg](./public/favicon.svg)).
- **Hero Architecture:** 3-column cyberpunk editorial hero pairing a real-time 3D perspective wireframe synth-grid canvas with a transparent character cutout sandwiched between solid display lettering (`BRAND DESIGN`) behind and neon stroke outline in front.
- **Core Technologies:** Vanilla HTML5, CSS Grid (dense auto-flow), Lenis 1.1 smooth scroll, GSAP 3, FLIP category animations, accessible video lightbox, and interactive canvas/SVG placeholders.
- **Logo Integration:** Exact 45°-chamfered geometric `R` monogram embedded as an inline `<g id="rijan-logo-mark">` definition, RGB glitch-split floating corner badge, holographic hero watermark, procedural card stamps, and favicon ([public/favicon.svg](./public/favicon.svg)).
- **Hero Architecture:** 3-column cyberpunk editorial hero pairing a real-time 3D perspective wireframe synth-grid canvas with a transparent character cutout sandwiched between solid display lettering (`CODE & DESIGN`) behind and neon stroke outline in front.
- **Core Technologies:** Vanilla HTML5, CSS Grid & Subgrid, Lenis 1.1 smooth scroll, GSAP 3, FLIP category animations across `fullstack`, `graphics`, `photo`, and `motion` projects, native `<dialog>` video lightbox, and interactive canvas/SVG placeholders.

---

## 🎨 Asset Customization & Content Guide

### 1. Swapping the Hero Character Cutout
Replace `hero-character.png` and `public/hero-character.png` with any transparent PNG portrait or character illustration:
* Keep the dimensions roughly square or 3:4 portrait (`1024x1024` recommended).
* Use a transparent background so the `BRAND DESIGN` typography renders behind and wraps cleanly over the subject with its foreground outline stroke.
* Use a transparent background so the `CODE & DESIGN` typography renders behind and wraps cleanly over the subject with its foreground outline stroke.

### 2. Swapping Portfolio Projects & Images
Open [`index.html`](./index.html) and locate the `PROJECTS` array at the top of the `<script>` tag:
Open [`index.html`](./index.html) and locate the `PROJECTS` array inside the `<script>` tag (`category` supports `"fullstack"`, `"graphics"`, `"photo"`, or `"motion"`):

```javascript
const PROJECTS = [
  {
    id: "p1",
    title: "Himalayan Botanical Apothecary",
    category: "graphics",
    categoryLabel: "Brand Identity",
    title: "Equator Nexus — Full-Stack Treasury App",
    category: "fullstack",
    categoryLabel: "Full-Stack Architecture",
    year: "2025",
    aspect: "span-hero", // 'span-hero' (8 cols), 'span-tall' (4 cols), 'span-wide' (6 cols), 'span-square' (4 cols)
    client: "Langtang Herbals",
    image: "", // <-- Paste your image URL here (e.g. "/images/apothecary.jpg" or "https://...")
    summary: "Visual identity system, custom typography, and tactile packaging...",
    artTitle: "BOTANICA",
    palette: ["#24150b", "#c8763a", "#0d0d11"],
    tags: ["Branding", "Packaging", "Art Direction"]
    client: "Equator Finance",
    image: "", // <-- Paste your image URL here (e.g. "/images/nexus.jpg" or "https://...")
    summary: "Production Next.js App Router platform backed by PostgreSQL ledger schemas...",
    artTitle: "NEXUS // OS",
    palette: ["#091318", "#D5FF3F", "#00F0FF"],
    tags: ["Next.js", "PostgreSQL", "Docker", "REST API"]
  },
  ...
];
```
* **Leave `image: ""` empty**: The card renders rich procedural typography and geometric gradient poster artwork automatically.
* **Provide an image URL**: The card seamlessly renders your image with hover zoom and dark scrim overlays.

### 3. Updating the Motion Reel
In [`index.html`](./index.html), locate the `<dialog class="video-modal">` element:
```html
<iframe 
  id="reel-iframe" 
  src="about:blank" 
  data-src="https://www.youtube-nocookie.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=0&controls=1" 
  title="Rijan Shrestha Motion Reel" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```
Replace `YOUR_VIDEO_ID` with your YouTube video ID, or swap for a Vimeo embed or native `<video controls src="/reel.mp4">`.

---

## 📖 Technical Documentation & Audits

- **[PROJECT_DOCUMENTATION.html](./PROJECT_DOCUMENTATION.html)**: Interactive, self-contained single-page technical audit with live interactive sandboxes, dependency graph, and cleanup checklist.
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**: Complete Markdown technical audit, file-by-file inventory, and used vs. unused codebase analysis.
- **`index-vite.html`**: Backup of the earlier Vite + React monolithic entrypoint.

---

## 🚀 Build & Deployment

### Build for Production
```bash
npm run build
```
Vite transforms and optimizes [`index.html`](./index.html) directly into the `/dist` output directory.

### Preview Local Build
```bash
npm run preview
```

