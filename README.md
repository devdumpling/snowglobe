# Snowglobe

A beautiful, interactive Year in Review template. Fork it, customize it, and deploy your own celebration of the year.

## Features

- **Interactive Timeline** - Scroll through 12 months of events, milestones, and memories
- **Real-time Presence** - See who else is viewing with live cursors and online indicators
- **Team Showcase** - Celebrate your team members with customizable avatars
- **Photo Clusters** - Add photo memories throughout the timeline
- **Guestbook** - Let visitors leave messages
- **Cookie Clicker** - Leave cookies on major timeline events
- **Emoji Reactions** - Send floating emoji reactions across the screen
- **Easter Eggs** - Hidden surprises (try the Konami code...)
- **Neobrutalist Design** - Modern pastel palette with playful holiday touches

## Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/snowglobe.git
   cd snowglobe
   pnpm install
   ```

2. **Configure Your Content**
   Edit the JSON files in `src/lib/config/`:
   - `site.json` - Title, subtitle, year, theme colors
   - `timeline.json` - Events, milestones, new hires
   - `team.json` - Team members and avatars
   - `month-blurbs.json` - Monthly narratives
   - `photos.json` - Photo cluster definitions

3. **Add Your Avatars**
   - Place default avatars in `static/images/avatars/defaults/`
   - Place custom avatars in `static/images/avatars/custom/`
   - Recommended: 128x128px WebP, pixelated style

4. **Start Development**
   ```bash
   # Start the database
   pnpm db:start

   # Push database schema
   pnpm db:push

   # Seed users from config
   pnpm db:seed

   # Terminal 1: SvelteKit
   pnpm dev

   # Terminal 2: Gleam backend
   cd backend && gleam run
   ```

5. **Deploy**
   Deploy to your favorite platform (Fly.io, Vercel, Railway, etc.)

## Configuration

### `src/lib/config/site.json`

```json
{
  "site": {
    "title": "Year in Review",
    "subtitle": "A celebration of our journey",
    "year": 2025,
    "partyCode": "celebrate2025",
    "footer": "Made with love"
  },
  "theme": {
    "colors": {
      "primary": "oklch(0.55 0.22 25)",
      "secondary": "oklch(0.45 0.12 145)",
      "accent": "oklch(0.75 0.14 85)"
    }
  },
  "yearStats": [
    { "label": "New Hires", "value": "10", "emoji": "👥" }
  ]
}
```

### `src/lib/config/timeline.json`

Define your major events (one per month), minor events (sticky notes), and new hires:

```json
{
  "majorEvents": [
    {
      "id": "jan-kickoff",
      "date": "2025-01-15",
      "title": "New Year Kickoff",
      "description": "Starting the year with fresh goals.",
      "category": "milestone",
      "emoji": "🚀",
      "month": 0,
      "stats": [{ "label": "Goals", "value": "12", "emoji": "🎯" }]
    }
  ],
  "minorEvents": [
    { "id": "jan-note", "title": "Welcome!", "emoji": "✨", "afterMonth": 0 }
  ],
  "newHires": [
    { "id": "hire-1", "name": "Alex", "avatarId": "guest_1", "afterMonth": 0 }
  ]
}
```

### `src/lib/config/team.json`

Define avatars and team members:

```json
{
  "avatars": {
    "guest_1": {
      "id": "guest_1",
      "name": "Team Member",
      "image": "defaults/avatar-red.webp",
      "accentColor": "var(--holiday-red)"
    }
  },
  "teamMembers": [
    {
      "id": "guest_1",
      "name": "Alex Smith",
      "title": "Engineer",
      "image": "defaults/avatar-red.webp",
      "accentColor": "var(--holiday-red)"
    }
  ],
  "guestAvatars": ["guest_1", "guest_2"],
  "defaultPassword": "CHANGE_ME_2025"
}
```

## Avatar Creation

For the pixelated avatar style:

1. Start with a photo (128x128px recommended)
2. Apply pixelation effect (8-16px blocks)
3. Export as WebP for best compression
4. Place in `static/images/avatars/custom/`

## Architecture

```
Browser <──WS──> Gleam (presence + writes) ──> Postgres
   │
   └── SSR ──> SvelteKit (auth, reads)
```

| Layer         | Responsibility                                      | Port                     |
| ------------- | --------------------------------------------------- | ------------------------ |
| **SvelteKit** | Auth (Lucia-style), SSR, read queries               | 5173 (dev) / 3000 (prod) |
| **Gleam**     | WebSocket server, cursor presence, guestbook writes | 4000                     |
| **Postgres**  | Users, sessions, guestbook entries, cookie likes    | 5432                     |

## Tech Stack

**Frontend**
- SvelteKit 2 + Svelte 5 (runes)
- Tailwind CSS 4
- shadcn-svelte components
- Valibot (config validation)

**Backend**
- Gleam on the BEAM
- Mist (WebSocket server)
- Pog (Postgres driver)

**Database**
- PostgreSQL
- Drizzle ORM (migrations & queries)

**Auth**
- Lucia-style sessions
- Argon2 password hashing
- SHA256 session tokens

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
PARTY_CODE=celebrate2025
PUBLIC_WS_URL=ws://localhost:4000/ws
```

## Available Scripts

| Command            | Description                 |
| ------------------ | --------------------------- |
| `pnpm dev`         | Start SvelteKit dev server  |
| `pnpm build`       | Build for production        |
| `pnpm preview`     | Preview production build    |
| `pnpm check`       | Type-check the codebase     |
| `pnpm lint`        | Lint with ESLint + Prettier |
| `pnpm format`      | Format code with Prettier   |
| `pnpm test`        | Run tests with Vitest       |
| `pnpm db:start`    | Start Postgres via Docker   |
| `pnpm db:push`     | Push schema to database     |
| `pnpm db:studio`   | Open Drizzle Studio         |
| `pnpm db:generate` | Generate migrations         |
| `pnpm db:migrate`  | Run migrations              |
| `pnpm db:seed`     | Seed database from config   |

## Project Structure

```
snowglobe/
├── src/
│   ├── lib/
│   │   ├── config/           # Configuration (edit these JSON files!)
│   │   │   ├── site.json
│   │   │   ├── timeline.json
│   │   │   ├── team.json
│   │   │   ├── month-blurbs.json
│   │   │   ├── photos.json
│   │   │   ├── schemas.ts    # Valibot validation
│   │   │   └── loader.ts     # Config loading
│   │   ├── components/       # Svelte components
│   │   ├── data/             # Data accessors
│   │   ├── realtime/         # WebSocket client & stores
│   │   └── server/           # Auth & database utilities
│   └── routes/               # SvelteKit pages
├── static/
│   └── images/
│       └── avatars/
│           ├── defaults/     # Default geometric avatars
│           └── custom/       # Your custom avatars
├── backend/                  # Gleam WebSocket server
│   └── src/snowglobe/
├── drizzle/                  # Database migrations
└── scripts/                  # Utility scripts
```

## Deployment

The app can be deployed to Fly.io via GitHub Actions:

- **Frontend**: SvelteKit Node adapter → Fly.io (port 3000)
- **Backend**: Gleam → Fly.io (port 4000)

See `.github/workflows/fly-deploy.yml` for CI/CD configuration.

## License

MIT - Fork it, customize it, make it yours!

---

Built with SvelteKit, Gleam, and lots of holiday cheer.
