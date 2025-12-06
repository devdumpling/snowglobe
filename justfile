# Snowglobe - Task Runner
# Install Just: https://github.com/casey/just

set dotenv-load
set positional-arguments

# Default: show available commands
default:
    @just --list

# ─────────────────────────────────────────────────────────────
# Development
# ─────────────────────────────────────────────────────────────

# Start all services for local development
dev: db-up
    #!/usr/bin/env bash
    trap 'kill 0' EXIT
    just dev-backend &
    just dev-frontend &
    wait

# Start Gleam backend (port 4000)
dev-backend:
    cd backend && gleam run

# Start SvelteKit frontend (port 5173)
dev-frontend:
    pnpm dev

# ─────────────────────────────────────────────────────────────
# Build
# ─────────────────────────────────────────────────────────────

# Build all
build: build-backend build-frontend

# Build Gleam backend
build-backend:
    cd backend && gleam build

# Build SvelteKit frontend
build-frontend:
    pnpm build

# ─────────────────────────────────────────────────────────────
# Test & Check
# ─────────────────────────────────────────────────────────────

# Run all checks
check: check-backend check-frontend

# Check Gleam backend compiles
check-backend:
    cd backend && gleam build

# Typecheck SvelteKit frontend
check-frontend:
    pnpm check

# Run Gleam tests
test-backend:
    cd backend && gleam test

# ─────────────────────────────────────────────────────────────
# Lint & Format
# ─────────────────────────────────────────────────────────────

# Format all code
fmt: fmt-backend fmt-frontend

# Format Gleam code
fmt-backend:
    cd backend && gleam format

# Format TypeScript/Svelte
fmt-frontend:
    pnpm prettier --write .

# Lint frontend
lint:
    pnpm lint

# ─────────────────────────────────────────────────────────────
# Database
# ─────────────────────────────────────────────────────────────

# Start Postgres container
db-up:
    docker compose up -d

# Stop Postgres container
db-down:
    docker compose down

# Generate Drizzle migrations
db-generate:
    pnpm drizzle-kit generate

# Push schema to database (dev only)
db-push:
    pnpm drizzle-kit push

# Open Drizzle Studio
db-studio:
    pnpm drizzle-kit studio

# Open psql shell
db-shell:
    docker compose exec postgres psql -U root -d local

# ─────────────────────────────────────────────────────────────
# Seed
# ─────────────────────────────────────────────────────────────

# Seed users into database
db-seed:
    pnpm tsx scripts/seed-users.ts

# ─────────────────────────────────────────────────────────────
# Setup
# ─────────────────────────────────────────────────────────────

# Initial project setup (run this first!)
setup: _check-deps
    #!/usr/bin/env bash
    set -euo pipefail

    # Create .env from example if it doesn't exist
    if [ ! -f .env ]; then
        echo "📝 Creating .env from .env.example..."
        cp .env.example .env
    fi

    echo "📦 Installing dependencies..."
    pnpm install
    cd backend && gleam deps download
    cd ..

    echo "🐘 Starting database..."
    just db-up
    sleep 3

    echo "📋 Pushing schema..."
    just db-push

    echo "👥 Seeding users from config..."
    just db-seed

    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Edit config/*.json to customize your content"
    echo "  2. Run 'just dev' to start the app"
    echo "  3. Open http://localhost:5173"

# Check required dependencies are installed
_check-deps:
    #!/usr/bin/env bash
    set -euo pipefail

    check() {
        if ! command -v "$1" &> /dev/null; then
            echo "✗ $1 not found. Install: $2"
            exit 1
        fi
        echo "✓ $1"
    }

    echo "Checking dependencies..."
    check pnpm "npm install -g pnpm"
    check gleam "https://gleam.run/getting-started/"
    check docker "https://docs.docker.com/get-docker/"

# ─────────────────────────────────────────────────────────────
# Utilities
# ─────────────────────────────────────────────────────────────

# Clean build artifacts
clean:
    rm -rf backend/build
    rm -rf .svelte-kit
    rm -rf build

# Install dependencies
install:
    pnpm install
    cd backend && gleam deps download
