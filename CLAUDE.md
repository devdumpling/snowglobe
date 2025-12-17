# Snowglobe - Year in Review Template

A customizable Year in Review app template. Features multiplayer cursors, a guestbook, and an interactive timeline.

## Architecture

```
Browser ◄──WS──► Gleam (presence + guestbook writes) ──► Postgres
   │
   └── SSR ──► SvelteKit (auth, reads)
```

- **SvelteKit**: Auth (Lucia-style), SSR, initial page loads, read queries
- **Gleam**: WebSocket server, cursor presence (BEAM memory), guestbook writes
- **Postgres**: Users, sessions, guestbook entries

## Configuration

All customizable content lives in `src/lib/config/*.json`:

- `site.json` - Title, year, theme colors, year stats
- `timeline.json` - Events, milestones, new hires
- `team.json` - Avatars and team members
- `month-blurbs.json` - Monthly narratives
- `photos.json` - Photo clusters

Config is validated at build time using Valibot schemas.

## Tech Stack

- SvelteKit 2 + Svelte 5 + Tailwind 4 + shadcn-svelte
- Gleam + Mist (WebSocket server)
- Postgres + Drizzle ORM
- Valibot (config validation)

## Local Dev

```bash
docker compose up -d      # Postgres
pnpm db:push              # Push schema
pnpm db:seed              # Seed users from config
pnpm dev                  # SvelteKit (port 5173)
cd backend && gleam run   # Gleam backend (port 4000)
```

## Svelte MCP Tools

Use the Svelte MCP server for documentation:

- **list-sections**: Discover available documentation sections
- **get-documentation**: Fetch full docs for specific sections
- **svelte-autofixer**: Analyze Svelte code for issues before finalizing
- **playground-link**: Generate Svelte Playground links (ask user first)
