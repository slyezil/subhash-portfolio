# Subhash Chandra Bose Lavu — Portfolio v2.0 "Neon Ghost"

A cyberpunk-styled developer portfolio: interactive Three.js scenes, a markdown-powered blog,
and a HUD-inspired design system. Migrated from Create React App to **Vite**.

Live: [slyezil.github.io/subhash-portfolio](https://slyezil.github.io/subhash-portfolio/)

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
GitHub Actions (requires Pages source set to **GitHub Actions** in repo settings).
Manual alternative: `npm run deploy` (gh-pages branch).

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
