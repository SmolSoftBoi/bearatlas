# BearAtlas

## Required Tools

- **Node.js** 22
- **Yarn** 4
- **Docker** with Docker Compose

## Development Environment

### Open in a Dev Container

1. Install the [**Dev Containers** extension](https://aka.ms/devcontainers) for VS Code.
2. Open this repository and choose **Reopen in Container**.
3. After the container builds using `.devcontainer/devcontainer.json`, `yarn install --immutable` runs automatically.

### Start Required Services

Run the following once the container is ready:

```bash
docker compose pull --quiet
docker compose up -d db redis
```

The `db` and `redis` containers from `docker-compose.yml` will now be running locally.

## License

BearAtlas is released under the MIT License.


