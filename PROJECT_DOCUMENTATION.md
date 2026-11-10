# Project Documentation & Complete File Audit

> **Project Name:** Rijan Shrestha — Creative Studio & Personal Portfolio  
> **Repository Path:** `/Users/rizs/Website`  
> **Production Domain:** `rijanshrestha.info.np` (configured via `CNAME`)  
> **Architecture:** Single-Page Application (SPA) built with React 18, Vite 6, Tailwind CSS, GSAP, Framer Motion, and Lenis Smooth Scroll.  
> **Audit Date:** November 2026  

---

## 1. Executive Summary

This project is a high-end, cinematic portfolio website for **Rijan Shrestha**, a freelance Graphic Designer, Motion Graphics Artist, and Frontend Developer based in Kathmandu, Nepal. 

The website showcases creative identity systems, motion reels, client projects, service offerings, verified testimonials, professional timeline, and an interactive contact inquiry form. Visually, it features a dark aesthetic (`#0B0B0F`), glassmorphism cards, dynamic radial gradients, dual-layer custom cursor, magnetic button interactions, smooth inertia scrolling via Lenis, and character-by-character split text reveals via GSAP.

### Architectural Evolution & Key Finding
The repository has undergone multiple architectural iterations:
1. **Legacy Static Webpage:** Raw HTML/CSS/Vanilla JS prototypes (`index-old.html`, `index-react.html`).
2. **Early React Prototype:** Initial React implementation with burgundy accents (`#6D001A`), bubble floating physics, and older styling (`src/App-old.jsx`, `src/index.css`).
3. **Modular Component Structure:** A planned modular architecture in `src/components/sections/` and `src/components/layout/`.
4. **Current Production State:** The active build runs almost entirely through a **monolithic `src/App.jsx`**, which inlines nearly all sections, navbars, and footers directly. As a result, several modular component files in `src/components/sections/`, `src/components/layout/`, and `src/data/projects.js` exist in the repository but are **not imported or used** by the running application.

---

## 2. Tech Stack & Dependencies Audit

Below is the complete analysis of all dependencies declared in `package.json`, their version constraints, their exact role, and whether they are actively used in the production bundle.

| Package | Version | Type | Usage Status | Description & Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`react`** | `^18.3.1` | Dependency | **Active (Used)** | Core frontend UI library. |
| **`react-dom`** | `^18.3.1` | Dependency | **Active (Used)** | React DOM renderer used in `src/main.jsx`. |
| **`framer-motion`** | `^11.0.0` | Dependency | **Active (Used)** | Powers physics springs (`useSpring`), transforms (`useTransform`), 3D card tilt (`useMotionValue`), scroll progression (`useScroll`), view detection (`useInView`), and menu transitions (`AnimatePresence`). |
| **`gsap`** | `^3.15.0` | Dependency | **Active (Used)** | Powers complex timelines in `Preloader.jsx`, cursor animations in `Cursor.jsx`, magnetic movement in `useMagneticEffect.js`, headline reveals (`split-heading .char`), and infinite marquee animation (`.marquee-track`). |
| **`lenis`** | `^1.3.25` | Dependency | **Active (Used)** | Smooth momentum scrolling engine initialized in `src/hooks/useLenis.js` and mounted in `App.jsx`. |
| **`lucide-react`** | `^0.400.0` | Dependency | **Active (Used)** | Icon library providing icons throughout the UI (`Sparkles`, `Star`, `MapPin`, `ArrowUpRight`, `ChevronDown`, `Menu`, `X`, `Github`, `Linkedin`, `Instagram`, etc.). |
| **`vite`** | `^6.0.0` | DevDependency | **Active (Used)** | Next-generation bundler and local development server. |
| **`@vitejs/plugin-react`** | `^4.3.1` | DevDependency | **Active (Used)** | Official Vite plugin for React fast refresh and JSX transformation. |
| **`tailwindcss`** | `^3.4.1` | DevDependency | **Active (Used)** | Utility-first CSS framework configuring custom fonts, colors, and design tokens. |
| **`postcss`** | `^8.4.33` | DevDependency | **Active (Used)** | Tool for transforming CSS with plugins (Tailwind and Autoprefixer). |
| **`autoprefixer`** | `^10.4.17` | DevDependency | **Active (Used)** | PostCSS plugin adding vendor prefixes to CSS rules. |
| **`@tailwindcss/typography`**| `^0.5.13` | DevDependency | **Configured / Unused** | Plugin registered in `tailwind.config.js`, but `prose` typography classes are not actively referenced in any component JSX. |

---

## 3. Complete File-by-File Inventory & Usage Audit

Every file in the repository has been audited to establish whether it is part of the active production bundle, orphaned/dead code, legacy code, or missing.

### Classification Legend
- 🟢 **ACTIVE / USED**: Directly imported and executed in the active production build.
- 🟡 **PARTIALLY CONFIGURED**: Configured or referenced, but not actively utilized.
- 🔴 **UNUSED / ORPHANED**: Valid code residing in the project, but not imported or executed anywhere.
- ⚪ **LEGACY / DEPRECATED**: Outdated prototypes or superseded iterations from previous versions.
- ⚠️ **MISSING ASSET**: Referenced by code or HTML, but missing from disk.

---

### Root Directory Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `index.html` | 🟢 **ACTIVE** | Main Vite HTML entrypoint. Configures viewport, SEO meta tags, Google Fonts preconnects, and loads `/src/main.jsx`. |
| `package.json` | 🟢 **ACTIVE** | Project manifest defining npm scripts (`dev`, `build`, `preview`) and dependencies. |
| `package-lock.json` | 🟢 **ACTIVE** | Deterministic dependency tree lockfile. |
| `vite.config.js` | 🟢 **ACTIVE** | Vite configuration setting `@` alias to `./src`, dev port to `5174`, and build outDir to `dist`. |
| `tailwind.config.js` | 🟢 **ACTIVE** | Configures content paths, custom font families (`Syne`, `DM Sans`), CSS color variable mappings, and transitions. |
| `postcss.config.js` | 🟢 **ACTIVE** | Configures PostCSS plugins (`tailwindcss`, `autoprefixer`). |
| `.eslintrc.cjs` | 🟢 **ACTIVE** | ESLint linting configuration for React and React Hooks. |
| `.gitignore` | 🟢 **ACTIVE** | Ignores `node_modules`, `dist`, `.DS_Store`, local logs, and environment variables. |
| `.npmrc` | 🟢 **ACTIVE** | Specifies `legacy-peer-deps=true` to prevent dependency resolution conflicts during installation. |
| `CNAME` | 🟢 **ACTIVE** | GitHub Pages custom domain file containing `rijanshrestha.info.np`. |
| `build.sh` | 🟢 **ACTIVE** | Production shell script executing `npm ci && npm run build`. |
| `index-old.html` | ⚪ **LEGACY** | 1,074 lines of standalone vanilla HTML/CSS/JS portfolio with Bebas Neue font and dark/light mode toggle. |
| `index-react.html` | ⚪ **LEGACY** | 827 lines of standalone static HTML prototype with vanilla JavaScript category filtering scripts. |

---

### `src/` Directory Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/main.jsx` | 🟢 **ACTIVE** | React application bootstrap. Mounts `<App />` inside `#root` and imports `globals.css` & `animations.css`. |
| `src/App.jsx` | 🟢 **ACTIVE** | **Primary application file.** Contains all primary state, scroll progress, GSAP scroll triggers, and inlines all page sections. |
| `src/App-old.jsx` | ⚪ **LEGACY** | 425 lines of an earlier React implementation featuring floating bubbles, burgundy accents, and older GSAP hooks. |
| `src/index.css` | 🔴 **UNUSED** | Older stylesheet containing `@tailwind` directives, burgundy root colors (`--accent: #6D001A`), bubble floating animations (`float1`–`float5`), and a custom SVG crosshair cursor. **Not imported by `main.jsx` or any other file.** |

---

### `src/components/ui/` Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/components/ui/Preloader.jsx` | 🟢 **ACTIVE** | **Used.** Multi-stage loading screen. Animates logo scale, counts progress 0% → 100%, and reveals the site with split-screen vertical blinds. |
| `src/components/ui/Cursor.jsx` | 🟢 **ACTIVE** | **Used.** Dual-layer custom mouse cursor with a centered dot (`#3B82F6`) and a trailing spring ring that expands over interactive elements. |
| `src/components/ui/MagneticButton.jsx` | 🟢 **ACTIVE** | **Used.** Reusable interactive button that pulls itself toward the user's cursor using `useMagneticEffect`. |
| `src/components/ui/SplitText.jsx` | 🟢 **ACTIVE** | **Used.** Typography utility that breaks sentences into `.char`, `.word`, or `.line` spans for GSAP character reveal animations. |
| `src/components/ui/ProjectCard.jsx` | 🔴 **UNUSED** | **Orphaned.** Standalone component for project cards with GSAP scroll-triggered reveals. Only referenced by `src/components/sections/Work.jsx` (which is itself unused). |

---

### `src/components/sections/` Files (Modular vs Monolithic)

> **Important Note:** In the current version of the application, `src/App.jsx` inlines its own sections (`HeroSection`, `AboutSection`, `ProjectsSection`, `ServicesSection`, `SkillsSection`, `ExperienceSection`, `TestimonialsSection`, `ProcessSection`, `ContactSection`). As a result, all files under `src/components/sections/` are currently **unused**:

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/components/sections/Hero.jsx` | 🔴 **UNUSED** | Standalone hero section featuring an animated role cycler (`Motion Designer`, `Visual Storyteller`, `Creative Designer`). |
| `src/components/sections/Work.jsx` | 🔴 **UNUSED** | Standalone work section that renders `ProjectCard` items from `src/data/projects.js`. |
| `src/components/sections/Philosophy.jsx`| 🔴 **UNUSED** | Creative philosophy quotes with scroll-driven character highlights. (Does not exist in `App.jsx`). |
| `src/components/sections/Process.jsx` | 🔴 **UNUSED** | 5-step workflow section (`Discover`, `Concept`, `Design`, `Animate`, `Refine`) with vertical progress line. |
| `src/components/sections/Contact.jsx` | 🔴 **UNUSED** | Minimal contact section with mouse follower gradient and social link pills. |

---

### `src/components/layout/` Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/components/layout/Navbar.jsx` | 🔴 **UNUSED** | Standalone navigation bar with scroll direction detection (auto-hiding on scroll down). `App.jsx` instead uses its own inline `SiteNav` and `MobileMenu`. |
| `src/components/layout/Footer.jsx` | 🔴 **UNUSED** | Standalone 2-column footer with link groups (`Quick Links`, `Resources`). `App.jsx` instead uses its own inline `SiteFooter`. |

---

### `src/hooks/`, `src/utils/`, & `src/data/` Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/hooks/useLenis.js` | 🟢 **ACTIVE** | **Used.** Custom React hook configuring and running Lenis smooth scroll with `window.requestAnimationFrame`. |
| `src/hooks/useMagneticEffect.js` | 🟢 **ACTIVE** | **Used.** Custom React hook calculating distance to cursor and applying GSAP elastic transforms. Used by `MagneticButton.jsx`. |
| `src/utils/gsap-register.js` | 🟢 **ACTIVE** | **Used.** Central registration of GSAP core, `ScrollTrigger`, and `Observer`. Checks `prefers-reduced-motion` to throttle timeline duration for accessibility. |
| `src/data/projects.js` | 🔴 **UNUSED** | Array of 6 sample projects (`Neural Flow`, `Brand Evolution`, `Digital Canvas`, etc.). `App.jsx` instead defines its own inline `projectData` array with 7 client projects. |

---

### `src/styles/` Files

| File | Status | Description & Purpose |
| :--- | :---: | :--- |
| `src/styles/globals.css` | 🟢 **ACTIVE** | **Used.** Imported in `main.jsx`. Imports Google Fonts (`Syne`, `DM Sans`), declares `@tailwind` directives, sets CSS custom variables, custom scrollbars, selection colors, glassmorphism, and accessibility focus states. |
| `src/styles/animations.css` | 🟢 **ACTIVE** | **Used.** Imported in `main.jsx`. Contains keyframes for `textReveal`, `fadeInUp`, `scaleIn`, `floatOrb`, `marquee`, `pulseGlow`, along with animation utility classes and staggered animation delays. |

---

### `public/` Directory & Asset Health

| File / Asset | Status | Description & Purpose |
| :--- | :---: | :--- |
| `public/_headers` | 🟢 **ACTIVE** | Cloudflare Pages / Netlify security headers and static asset caching rules (`Cache-Control: max-age=31536000` for `/assets/*`). |
| `public/_redirects` | 🟢 **ACTIVE** | SPA routing redirect rule (`/* /index.html 200`) preventing 404s on page reloads. |
| `public/favicon.svg` | ⚠️ **MISSING** | **Referenced in `index.html` line 15**, but the file does not exist in `public/`. Browsers request this and receive a 404. |
| `public/apple-touch-icon.png` | ⚠️ **MISSING** | **Referenced in `index.html` line 16**, but the file does not exist in `public/`. iOS bookmarking requests this and receives a 404. |

---

## 4. Deep Architectural Comparison: Monolithic `App.jsx` vs Modular Components

The project currently contains two parallel implementations of the portfolio sections:

```
src/
├── App.jsx  <─── [CURRENTLY ACTIVE IN BUNDLE]
│   ├── Preloader (from ui/Preloader.jsx)
│   ├── Cursor (from ui/Cursor.jsx)
│   ├── SiteNav (inlined)
│   ├── MobileMenu (inlined)
│   ├── HeroSection (inlined with 3D mouse spring physics & portrait)
│   ├── AboutSection (inlined with animated counter & timeline)
│   ├── ProjectsSection (inlined with 7 masonry project cards)
│   ├── ServicesSection (inlined with 6 pricing cards)
│   ├── SkillsSection (inlined with Design & Dev pill badges)
│   ├── ExperienceSection (inlined with GSAP scrubbed line)
│   ├── TestimonialsSection (inlined with infinite marquee track)
│   ├── ProcessSection (inlined with SVG connecting thread)
│   ├── ContactSection (inlined with interactive input form)
│   └── SiteFooter (inlined)
│
└── components/  <─── [CURRENTLY ORPHANED / UNUSED]
    ├── layout/
    │   ├── Navbar.jsx (Unused - has scroll-hide logic)
    │   └── Footer.jsx (Unused - has multi-column sitemap)
    ├── sections/
    │   ├── Hero.jsx (Unused - has 3-second role cycler)
    │   ├── Work.jsx (Unused - consumes src/data/projects.js)
    │   ├── Philosophy.jsx (Unused - has scroll quote highlighter)
    │   ├── Process.jsx (Unused - 5-step process)
    │   └── Contact.jsx (Unused - minimal contact layout)
    └── ui/
        └── ProjectCard.jsx (Unused - consumes projects.js data format)
```

### Key Differences Between the Two Implementations:
1. **Hero Section:**
   - Inlined `HeroSection` in `App.jsx` uses Framer Motion's `useMotionValue` and `useSpring` to create an interactive 3D perspective tilt on the portrait card, complete with floating background particles and quick-stat cards.
   - Modular `sections/Hero.jsx` uses a simple interval role cycler (`Motion Designer`, `Visual Storyteller`, `Creative Designer`) without the 3D card tilt.
2. **Projects / Work:**
   - Inlined `ProjectsSection` in `App.jsx` renders a 3-column CSS masonry layout featuring 7 realistic client projects (e.g., *Equator Money Changer*, *Cafe Anytime*, *Dear Doughnut*) with custom aspect ratios.
   - Modular `sections/Work.jsx` renders 6 generic tech/AI mock projects (*Neural Flow*, *Brand Evolution*, etc.) defined in `src/data/projects.js`.
3. **Philosophy Section:**
   - Exists exclusively in `src/components/sections/Philosophy.jsx`. It has creative quotes with character-by-character scroll highlighting, but was omitted from `App.jsx`.
4. **Process Section:**
   - Inlined `ProcessSection` in `App.jsx` features a 4-step workflow (*Discover, Design, Develop, Deliver*) joined by an SVG spline curved thread line.
   - Modular `sections/Process.jsx` features a 5-step workflow (*Discover, Concept, Design, Animate, Refine*).
5. **Contact Section:**
   - Inlined `ContactSection` in `App.jsx` includes a working interactive inquiry form (Name, Email, Project, Budget, Message) with submission state, plus location badge and direct email.
   - Modular `sections/Contact.jsx` only displays email and social links with no form inputs.

---

## 5. Active Feature Breakdown in Production

### 1. Preloader Screen (`src/components/ui/Preloader.jsx`)
- Fullscreen `#0B0B0F` overlay that prevents page flash.
- GSAP timeline animates an initial logo badge (`RS`), increments a numerical counter from `0` to `100%`, and scales a horizontal loading bar.
- On completion, top and bottom curtain panels slide open vertically (`yPercent: -100` and `yPercent: 100`), unmounting the preloader and initiating site animations.

### 2. Dual-Layer Cursor (`src/components/ui/Cursor.jsx`)
- Detects `(pointer: fine)` to ensure it only activates on desktop mouse devices (bypassed on touch devices).
- Inner dot tracks mouse position instantly with high precision.
- Outer ring tracks with GSAP easing (`duration: 0.15s`), expanding and morphing when hovering interactive buttons or links.

### 3. Smooth Momentum Scrolling (`src/hooks/useLenis.js`)
- Initializes `@studio-freight/lenis` (Lenis v1.3).
- Synchronizes wheel and touch physics with a smooth lerp factor of `0.08` and duration of `1.1s`.
- Drives smooth scroll coordinates for both Framer Motion and GSAP ScrollTrigger.

### 4. Typography & Split Text (`src/components/ui/SplitText.jsx`)
- Uses `Syne` for high-impact display headings and `DM Sans` for body copy.
- Splits headline strings into `.char` spans, allowing GSAP ScrollTrigger to stagger words and letters up from an offset with an easing curve (`power3.out`).

### 5. Infinite Testimonial Marquee
- Duplicates client testimonials in memory (`useMemo(() => [...testimonials, ...testimonials])`).
- Uses GSAP to loop `.marquee-track` endlessly at `xPercent: -50` over a 28-second cycle.
- Styled with CSS `mask-image` linear gradients on either edge to create a fade-in/fade-out edge blur.

### 6. Interactive Contact Form & Resume Download
- Controlled form with client feedback upon clicking "Send Inquiry".
- "Download Resume" button generates and triggers an in-browser download of an embedded text resume via `data:text/plain;charset=utf-8`.

---

## 6. Build & Bundle Performance Analysis

Executing `npm run build` using Vite 6 compiles cleanly with zero errors:

```bash
> vite build
✓ 1877 modules transformed.
dist/index.html                   1.23 kB │ gzip:   0.57 kB
dist/assets/index-CIAQJMa5.css   36.42 kB │ gzip:   7.52 kB
dist/assets/index-BscZw89I.js   457.46 kB │ gzip: 151.66 kB
✓ built in 1.32s
```

### Asset Breakdown:
- **HTML:** `1.23 kB` (minified, lightweight entry point).
- **CSS:** `36.42 kB` (Gzip: `7.52 kB`), containing Tailwind utility classes, Google Font imports, custom keyframe animations, and design tokens.
- **JavaScript:** `457.46 kB` (Gzip: `151.66 kB`), combining React, ReactDOM, Framer Motion, GSAP, Lenis, and Lucide Icons.

---

## 7. Recommended Cleanup & Optimization Actions

To transition this codebase into a cleaner, production-hardened repository, the following actions are recommended:

### Step 1: Add Missing Assets in `public/`
- Add `favicon.svg` to the `public/` folder so browsers don't trigger a 404 request on line 15 of `index.html`.
- Add `apple-touch-icon.png` to the `public/` folder for iOS bookmarking support.

### Step 2: Delete Legacy Prototypes
These files are superseded and take up space without being referenced:
- Delete `index-old.html` (1,074 lines of outdated static HTML).
- Delete `index-react.html` (827 lines of static HTML prototype).
- Delete `src/App-old.jsx` (old prototype with burgundy styling).
- Delete `src/index.css` (old unused stylesheet).

### Step 3: Choose an Architecture for `src/components/`
You have two architectural options:
- **Option A (Modularize):** Break `src/App.jsx` into smaller files by importing the modular components from `src/components/sections/` and updating those components to match the latest design in `App.jsx`.
- **Option B (Clean Up):** If you prefer keeping the single-file `App.jsx` structure, safely delete the unused files in `src/components/sections/`, `src/components/layout/`, `src/components/ui/ProjectCard.jsx`, and `src/data/projects.js` to eliminate confusion.

### Step 4: Update Social Links & Contact Details
In `src/App.jsx`:
- Replace placeholder social URLs (`https://github.com/`, `https://www.linkedin.com/`, `https://www.instagram.com/`, `https://www.behance.net/`) with Rijan's actual profiles.
- Replace `rijan@example.com` with Rijan's real business email.

### Step 5: Clean Up Unused Tailwind Plugins
- `@tailwindcss/typography` is listed in `package.json` and `tailwind.config.js`, but prose classes are not used. You can safely remove it from `package.json` and `tailwind.config.js` to save install time and config overhead.

---

## 8. Summary Table of All Repository Files

```
/Users/rizs/Website
├── .eslintrc.cjs                     [🟢 ACTIVE - ESLint config]
├── .gitignore                        [🟢 ACTIVE - Git ignore rules]
├── .npmrc                            [🟢 ACTIVE - legacy-peer-deps config]
├── CNAME                             [🟢 ACTIVE - Custom domain config]
├── build.sh                          [🟢 ACTIVE - CI deployment script]
├── index.html                        [🟢 ACTIVE - Vite HTML entrypoint]
├── package.json                      [🟢 ACTIVE - Dependencies and scripts]
├── package-lock.json                 [🟢 ACTIVE - Locked dependency tree]
├── postcss.config.js                 [🟢 ACTIVE - PostCSS plugins]
├── tailwind.config.js                [🟢 ACTIVE - Tailwind configuration]
├── vite.config.js                    [🟢 ACTIVE - Vite bundler configuration]
│
├── index-old.html                    [⚪ LEGACY - Vanilla HTML/CSS portfolio]
├── index-react.html                  [⚪ LEGACY - Vanilla HTML category filter prototype]
│
├── public/
│   ├── _headers                      [🟢 ACTIVE - Security and caching headers]
│   ├── _redirects                    [🟢 ACTIVE - SPA 200 rewrite rule]
│   ├── favicon.svg                   [⚠️ MISSING - Referenced in index.html]
│   └── apple-touch-icon.png          [⚠️ MISSING - Referenced in index.html]
│
└── src/
    ├── main.jsx                      [🟢 ACTIVE - React root mounting]
    ├── App.jsx                       [🟢 ACTIVE - Primary monolithic application]
    ├── App-old.jsx                   [⚪ LEGACY - Burgundy bubble prototype]
    ├── index.css                     [🔴 UNUSED - Unimported burgundy stylesheet]
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Preloader.jsx         [🟢 ACTIVE - Multi-stage loading screen]
    │   │   ├── Cursor.jsx            [🟢 ACTIVE - Dual-layer custom mouse cursor]
    │   │   ├── MagneticButton.jsx    [🟢 ACTIVE - Interactive magnetic button]
    │   │   ├── SplitText.jsx         [🟢 ACTIVE - Text splitting utility]
    │   │   └── ProjectCard.jsx       [🔴 UNUSED - Orphaned component]
    │   ├── sections/
    │   │   ├── Hero.jsx              [🔴 UNUSED - Superseded by App.jsx]
    │   │   ├── Work.jsx              [🔴 UNUSED - Superseded by App.jsx]
    │   │   ├── Philosophy.jsx        [🔴 UNUSED - Omitted from App.jsx]
    │   │   ├── Process.jsx           [🔴 UNUSED - Superseded by App.jsx]
    │   │   └── Contact.jsx           [🔴 UNUSED - Superseded by App.jsx]
    │   └── layout/
    │       ├── Navbar.jsx            [🔴 UNUSED - Superseded by App.jsx]
    │       └── Footer.jsx            [🔴 UNUSED - Superseded by App.jsx]
    │
    ├── hooks/
    │   ├── useLenis.js               [🟢 ACTIVE - Smooth momentum scrolling hook]
    │   └── useMagneticEffect.js      [🟢 ACTIVE - Magnetic button physics hook]
    │
    ├── utils/
    │   └── gsap-register.js          [🟢 ACTIVE - GSAP plugins & accessibility check]
    │
    ├── data/
    │   └── projects.js               [🔴 UNUSED - Replaced by inline array in App.jsx]
    │
    └── styles/
        ├── globals.css               [🟢 ACTIVE - Theme tokens, fonts, & base styles]
        └── animations.css            [🟢 ACTIVE - Keyframe animations & delay utilities]
```

