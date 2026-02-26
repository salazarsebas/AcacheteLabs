<p align="center">
  <img src="public/AcacheteLabs.png" alt="Acachete Labs" width="80" />
</p>

<h1 align="center">Acachete Labs</h1>

<p align="center">
  A research-grade software laboratory.<br/>
  Protocol utilities, real-world asset infrastructure, and AI systems.
</p>

<p align="center">
  <a href="#projects">Projects</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## Projects

| Project | Description | Status |
|---------|-------------|--------|
| [Faucet](https://faucet-stellar.acachete.xyz/) | Deterministic testnet funding utility for Stellar developers | Active |
| [Explorer](https://stellar-explorer.acachete.xyz/en) | Block-level inspection tool for Stellar network analysis | Active |
| [Akkuea](https://github.com/akkuea/akkuea) | Real-world asset infrastructure on Stellar | In Progress |
| [PromptOS](https://github.com/salazarsebas/PromptOS) | AI infrastructure efficiency stack | Experimental |

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Runtime** — Bun
- **Language** — TypeScript (strict mode)
- **Styling** — Tailwind CSS 4
- **Animation** — GSAP + Motion (Framer Motion)
- **Analytics** — Vercel Analytics
- **Font** — Geist Sans / Geist Mono

## Getting Started

```bash
# Install dependencies
bun install

# Development server
bun dev

# Type check
bun run typecheck

# Lint
bun run lint

# Production build
bun run build

# Full check (lint + typecheck + build)
bun run check
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/            # Next.js App Router (layout, page, styles)
├── components/
│   ├── intro/      # Intro animation (door, letter reveal, scan)
│   ├── hub/        # Project modules and orchestrator
│   ├── decorative/ # Ambient visuals (grid, particles, waveform)
│   └── ui/         # Shared UI components
├── hooks/          # Custom React hooks
├── lib/            # Animation constants, GSAP config, utilities
├── data/           # Project data
└── types/          # TypeScript type definitions
```

## License

MIT
