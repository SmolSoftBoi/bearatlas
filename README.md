# bearatlas

## Development Environment

### Open in a Dev Container

1. Install the **Dev Containers** extension for VS Code.
2. Open this repository and choose **Reopen in Container**.
3. The container builds using `.devcontainer/devcontainer.json`. After the build completes `yarn install --immutable` runs automatically.

### Start Required Services

Run the following once the container is ready:

```bash
docker compose pull --quiet
docker compose up -d db redis
```

These commands start the local PostgreSQL and Redis services.

## Contributor Guidelines

When opening a pull request, use the following checklist:

- **Closes:** link the issue number.
- **Deployed preview:** `https://bearatlas-pr-${{PR_NUMBER}}.fly.dev`
- Attach **screenshots or screencast** if helpful.
- **Reviewer Notes**
  - [ ] Functionally tested
  - [ ] Docs updated
  - [ ] Migrations run (`prisma migrate deploy`)

