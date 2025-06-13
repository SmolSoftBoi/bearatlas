# BearAtlas

## Development Environment

### Open in a Dev Container

1. Install the [**Dev Containers** extension](https://aka.ms/devcontainers) for VS Code.
2. Open this repository and choose **Reopen in Container**.
3. The container builds using `.devcontainer/devcontainer.json`. After the build completes `yarn install --immutable` runs automatically.

### Start Required Services

Run the following once the container is ready:

```bash
# Uses docker-compose.yml at repository root
docker compose pull --quiet
docker compose up -d db redis
```

These commands start the local PostgreSQL and Redis services.


