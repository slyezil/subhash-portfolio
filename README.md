# Subhash Chandra Bose Lavu — Portfolio v2.0 "Neon Ghost"

A cyberpunk-styled developer portfolio: interactive Three.js scenes, a markdown-powered blog,
and a HUD-inspired design system. Migrated from Create React App to **Vite**.

Live: [slyezil.github.io/subhash-portfolio](https://slyezil.github.io/subhash-portfolio/)

## Routes

| Path | What it is |
| --- | --- |
| `/` | Gateway — choose **Minimalist** (for recruiters) or **Continue to the journey**. Keys `1` / `2` also work. |
| `/minimal` | One-page, print-friendly résumé view. No 3D; the HUD chrome and scanlines are off. |
| `/journey` | The full Neon Ghost experience (chapters, 3D stages, projects, epilogue). |
| `/blog`, `/post/:slug` | Writing.Log, unchanged. |

Identity and résumé content for the gateway and minimalist page live in `src/data/siteConfig.js`
(`IDENTITY`, `RESUME`); projects come from `src/data/projects.js`. Keep `RESUME` in sync with
the PDF under `public/assets/resume/`.

## Features

- **Cyberpunk UI** — neon cyan/magenta palette, glitch text effects, scanlines, grid backdrop,
  corner-bracket HUD panels, digital-rain divider
- **Interactive 3D** — floating neon pyramids (drag to orbit) + cursor-repulsive particle field,
  both lazy-loaded and code-split away from the main bundle
- **Dark / Light themes** — persisted in `localStorage`, defaults to your OS preference
- **Markdown blog** — posts live in `src/posts/*.md`; frontmatter drives title/date/tags;
  reading time and syntax-highlighted code blocks included
- **SEO** — meta/OG/Twitter tags, JSON-LD Person schema, canonical URL, generated sitemap
- **Analytics** — GA4 via `react-ga4`, ID injected through env vars (never committed)

## Tech Stack

| Layer | Tools |
| --- | --- |
| Build | Vite 5, @vitejs/plugin-react |
| UI | React 18, React Router 6 |
| 3D | three.js r160, @react-three/fiber, @react-three/drei |
| Blog | react-markdown, remark-gfm, rehype-highlight, gray-matter |
| Quality | ESLint 9 (flat config), Prettier, GitHub Actions CI |

## Getting Started

Requires Node.js ≥ 18 (`.nvmrc` pins 20).

```bash
git clone https://github.com/slyezil/subhash-portfolio.git
cd subhash-portfolio
npm install
```

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at `http://localhost:5173/subhash-portfolio/` |
| `npm run build` | Production build to `dist/` (regenerates posts index + sitemap first) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the repo |
| `npm run format` | Prettier write |
| `npm run deploy` | Manual deploy of `dist/` to GitHub Pages |

> Note: on Windows, if `npm install` fails with `EBUSY`/`EPERM` errors, close any running
> dev servers and retry — antivirus or stale Node processes can lock `node_modules`.

## Environment Variables

Copy `.env.example` → `.env.local`:

| Variable | Purpose |
| --- | --- |
| `VITE_GA_ID` | Google Analytics 4 measurement ID (app runs fine without it) |

## Writing a Blog Post

Drop a `.md` file into `src/posts/`:

```markdown
---
title: "My Post Title"
date: "2026-08-22"
tags: ["Java", "AI"]
description: "One-line summary shown in the blog list."
---

Your content here. GFM tables, code blocks with syntax highlighting, etc.
```

The post index is regenerated automatically on `dev`/`build`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes via
GitHub Actions (Pages source: **GitHub Actions**; `main` allowed in the `github-pages`
environment). The GA ID comes from the `VITE_GA_ID` repository variable.

`npm run deploy` (gh-pages branch) only takes effect if the Pages source is switched back to
the `gh-pages` branch.

**Cloudflare Pages:** connect the repo with build command `npm run build` and output directory
`dist`. The app is built for the `/subhash-portfolio/` base path (see `vite.config.js`), so either
serve it from that path or change `base` for a root-domain deploy. `public/_redirects` makes deep
links such as `/minimal` resolve on Cloudflare.

## Project Structure

```
├── index.html               # SEO meta, fonts, theme bootstrap
├── vite.config.js           # base path, chunk splitting
├── scripts/
│   ├── generate-posts.js    # src/posts/*.md -> postsIndex.js
│   └── generate-sitemap.js  # -> public/sitemap.xml
├── public/
│   ├── favicon.svg          # neon pyramid glyph
│   ├── 404.html             # GH Pages SPA redirect
│   └── assets/resume/
└── src/
    ├── components/          # Header, Footer, SpinningPyramids, FloatingNodes,
    │                        # DigitalRain, ProjectCard, ThemeToggle, ErrorBoundary
    ├── pages/               # Home, Blog, Post, NotFound
    ├── hooks/               # useTheme, useTypewriter, useCountUp, usePageTracking
    ├── data/                # siteConfig.js, projects.js
    └── posts/               # blog content (*.md)
```

## License

[MIT](LICENSE)
