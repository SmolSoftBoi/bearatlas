extends: "./.codex/AGENTS.md"

## Environment
install: |
  # Build Docker images for local parity
  docker compose pull --quiet
  docker compose up -d db redis
  yarn install --immutable

## Build
build-command: |
  yarn web build            # Next.js 15 production build
  yarn api build            # Server actions/types generation
  docker compose build web  # Multi-stage prod image

## Testing
test-command: |
  yarn lint
  yarn test                 # Jest unit tests
  yarn e2e                  # Playwright end-to-end

## Lint / Format
lint-command: |
  yarn eslint .
fmt-command: |
  yarn prettier -c .

## Release
release-command: |
  yarn semantic-release

## Pull Request
pr-template: |
  ## Summary
  - Closes: <!-- issue # -->
  - Deployed preview: `https://bearatlas-pr-${{PR_NUMBER}}.fly.dev`

  ### Screenshots / Screencast
  <!-- Drag & drop or link -->

  ## Reviewer Notes
  - [ ] Functionally tested
  - [ ] Docs updated
  - [ ] Migrations run (`prisma migrate deploy`)
