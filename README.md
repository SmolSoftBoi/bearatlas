# bearatlas
🐻✈️ BearAtlas — the all-in-one bear travel index.

## Setup

1) Install dependencies

```bash
yarn install
```

2) Copy environment

```bash
cp .env.example .env
```

3) Start services (Postgres, Redis, Typesense)

```bash
docker compose up -d
```

## Scripts

- `yarn dev` — start Next.js app
- `yarn worker` — start worker (BullMQ)
- `yarn migrate` — apply Prisma migrations
- `yarn seed` — seed database
- `yarn typesense:sync` — sync events to Typesense

## Quickstart

```bash
# 1) Install
yarn install

# 2) Env
cp .env.example .env

# 3) Infra
docker compose up -d

# 4) Generate Prisma client (first time only)
yarn workspace @bearatlas/worker prisma:generate

# 5) Migrate
yarn migrate

# 6) Seed
yarn seed

# 7) Sync Typesense
yarn typesense:sync

# 8) Run web (http://localhost:3000)
yarn dev

# 9) Run worker (separate terminal)
yarn worker
```

## Notes

- Minimal dependencies; secrets are never committed.
- Healthchecks in Compose ensure services are ready.
