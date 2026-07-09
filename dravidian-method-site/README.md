# The Dravidian Method Site

An Astro + Starlight long-form digital book for *The Dravidian Method*.

## Requirements

- Node.js 22.12 or newer
- npm

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production site |
| `npm run preview` | Preview the production build locally |

## Content

Book chapters live in `src/content/docs/book/`.
Appendices live in `src/content/docs/appendices/`.
The homepage is `src/content/docs/index.md`.

The sidebar is generated from the `book` and `appendices` folders in `astro.config.mjs`.

## Vercel

Use the default npm install and build settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
