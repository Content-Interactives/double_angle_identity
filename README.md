# Double Angle Identity

React SPA for exploring trigonometric double-angle identities (sin, cos, tan) with interactive inputs and feedback.

**Live:** [https://content-interactives.github.io/double_angle_identity](https://content-interactives.github.io/double_angle_identity)

Curriculum alignment: [Standards.md](Standards.md).

## Stack

- React 19, Vite
- Tailwind CSS, PostCSS
- GitHub Pages via `gh-pages`

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | ESLint |
| `npm run deploy` | Build and deploy to GitHub Pages |

## Configuration

`vite.config.js`: `base: '/double_angle_identity/'` must match the Pages project path.

Primary UI: `src/` (e.g. `App.jsx`, components).
