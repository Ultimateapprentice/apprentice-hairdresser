# Apprentice Hairdresser Competency & Compliance Platform

Standalone React application extracted from the original Ivorey-hosted prototype.

## Source of Truth

**`SoT.md` is the authoritative development specification.**

Read it before making architectural or functional changes.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-compatible component structure
- React Router
- GitHub
- Cloudflare

## Local development

Requirements:
- Node.js 20+ recommended
- npm
- Git

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm test
```

## Repository workflow

1. Clone this repository in Visual Studio Community.
2. Open the folder containing `package.json`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Make changes.
6. Run lint/tests/build.
7. Commit changes.
8. Push to GitHub.

## Environment

Copy:

```text
.env.example
```

to:

```text
.env.local
```

Never commit real credentials.

## Cloudflare

`wrangler.jsonc` is the deployment configuration entry point.

The current scaffold is intentionally lightweight. Database, authentication and evidence-storage providers should be added behind the service layer defined in `SoT.md`.

## Important

Do not reintroduce Ivorey-specific dependencies or deployment assumptions.

Do not treat the old Bubble plan as the target architecture.

See `SoT.md` for the complete build specification.
