# BearAtlas 🐻

A comprehensive bear travel index that aggregates worldwide bear events (weeks, runs, cruises, resorts, parties) with advanced filtering and multiple views.

## Features

- **Multi-view Interface**: Map (Apple Maps), List, Calendar, and Trip Wizard
- **Advanced Filtering**: Date range, location, type, size, price, vibe, amenities
- **Ethical Data Collection**: Store metadata + official links only
- **Real-time Search**: Powered by Typesense with facet filtering
- **Calendar Export**: ICS format for easy calendar integration
- **Responsive Design**: Modern, accessible UI built with Next.js 15

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 22+
- Yarn (Berry recommended)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd bearatlas
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your credentials:

```bash
# Required: Apple Maps credentials
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_MAPS_KEY_ID=YOUR_KEY_ID
APPLE_MAPS_PRIVATE_KEY_PATH=/run/secrets/apple_maps_key

# Optional: Customize other settings
DATABASE_URL=postgresql://postgres:postgres@db:5432/bearatlas
REDIS_URL=redis://redis:6379
TYPESENSE_API_KEY=devkey
```

### 3. Generate Apple Maps Key

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create a Maps ID and generate a private key
3. Save the key as `.secrets/AuthKey_MapKitJS.p8`

### 4. Start Services

```bash
# Start all services
docker compose up --build

# In another terminal, setup database
yarn prisma:migrate
yarn seed
yarn typesense:sync-schema

# Start worker (optional)
yarn worker
```

### 5. Access the Application

- **Web App**: http://localhost:3000
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **Typesense**: localhost:8108

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Worker Jobs   │    │   Data Sources  │
│   (apps/web)    │    │ (packages/worker)│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Typesense     │    │   PostgreSQL    │    │   Redis (BullMQ)│
│   (Search)      │    │   (Primary DB)  │    │   (Job Queue)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Ingestion**: Worker processes events from adapters
2. **Enrichment**: Normalize and deduplicate events
3. **Storage**: Upsert to PostgreSQL and index in Typesense
4. **Search**: Real-time faceted search via API
5. **Display**: Multiple views with filtering

## API Endpoints

### Events
- `GET /api/events` - Search events with filters
- `GET /api/calendar.ics` - Export calendar file

### Maps
- `GET /api/apple-maps-token` - Generate MapKit JS token

### Query Parameters
- `q` - Search query
- `country`, `region`, `city` - Location filters
- `type` - Event type (WEEK, RUN, CRUISE, RESORT, PARTY)
- `estSize` - Size band (S, M, L, XL)
- `priceBand` - Price band (£, ££, £££)
- `vibe` - Vibe tags (array)
- `amenities` - Amenities (array)
- `clothingOptional` - Boolean filter
- `start`, `end` - Date range (ISO format)
- `limit` - Results limit (default: 20)

## Development

### Available Scripts

```bash
# Development
yarn dev              # Start Next.js dev server
yarn worker           # Start worker service
yarn build            # Build all packages

# Database
yarn prisma:migrate   # Run migrations
yarn seed             # Seed database
yarn prisma:generate  # Generate Prisma client

# Search
yarn typesense:sync-schema  # Sync Typesense schema

# Data Processing
yarn ingest           # Enqueue example ingest job

# Code Quality
yarn lint             # Run ESLint
yarn format           # Run Prettier
yarn test             # Run tests
```

### Project Structure

```
bearatlas/
├── apps/
│   └── web/                 # Next.js 15 App Router
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       ├── prisma/          # Database schema
│       └── scripts/         # Database scripts
├── packages/
│   └── worker/              # Background job processor
│       ├── src/
│       │   ├── jobs/        # BullMQ job handlers
│       │   ├── adapters/    # Data source adapters
│       │   └── pipeline/    # Data processing
├── .devcontainer/           # VS Code dev container
├── docker-compose.yml       # Service orchestration
└── package.json            # Workspace configuration
```

## Database Schema

### Events
- Core event information (name, dates, location)
- Categorization (type, size, price, vibe)
- Amenities and accessibility flags
- Source attribution and links
- Deduplication hash

### Sources
- Event source metadata
- Enable/disable sources
- Source-specific configuration

## Security Notes

- Apple Maps private key stored as Docker secret
- Environment variables for sensitive configuration
- No external API keys in codebase
- Ethical data collection (metadata only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.
