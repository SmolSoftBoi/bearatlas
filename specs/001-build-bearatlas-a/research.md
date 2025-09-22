# Research: BearAtlas Global Travel Index

## Technology Stack Decisions

### Monorepo Architecture
**Decision**: Yarn workspaces with apps/web and packages/worker structure
**Rationale**: 
- Enables shared TypeScript configurations and dependencies
- Facilitates code sharing between frontend and backend
- Simplifies CI/CD pipeline management
- Supports independent deployment of services
**Alternatives considered**: 
- Separate repositories (rejected: increased complexity for shared code)
- Nx monorepo (rejected: overkill for this scale)
- Lerna (rejected: Yarn workspaces more modern and integrated)

### Frontend: Next.js 15 with App Router
**Decision**: Next.js 15 with App Router and TypeScript
**Rationale**:
- App Router provides better performance and developer experience
- Built-in API routes for backend functionality
- Excellent TypeScript support
- Strong ecosystem and community
- Server-side rendering for SEO and performance
**Alternatives considered**:
- React with Vite (rejected: need for additional routing and SSR setup)
- SvelteKit (rejected: smaller ecosystem)
- Vue.js (rejected: team expertise in React)

### Backend Worker: Node.js 22 with TypeScript
**Decision**: Node.js 22 with TypeScript for background processing
**Rationale**:
- Consistent language across frontend and backend
- Excellent async/await support for I/O operations
- Strong ecosystem for data processing
- Easy integration with frontend
**Alternatives considered**:
- Python with FastAPI (rejected: language inconsistency)
- Go (rejected: additional complexity for team)
- Rust (rejected: overkill for this use case)

### Database: PostgreSQL 16 with Prisma
**Decision**: PostgreSQL 16 as system of record with Prisma ORM
**Rationale**:
- ACID compliance for data integrity
- Excellent JSON support for flexible event metadata
- Strong performance for complex queries
- Prisma provides type-safe database access
- Excellent migration and seeding capabilities
**Alternatives considered**:
- MongoDB (rejected: eventual consistency issues)
- MySQL (rejected: weaker JSON support)
- SQLite (rejected: not suitable for production scale)

### Search: Typesense 0.25
**Decision**: Typesense for facet search and full-text search
**Rationale**:
- Excellent facet search capabilities for filtering
- Fast full-text search
- Easy to deploy and maintain
- Good TypeScript client
- Real-time search capabilities
**Alternatives considered**:
- Elasticsearch (rejected: complex setup and maintenance)
- Algolia (rejected: external dependency and cost)
- PostgreSQL full-text search (rejected: limited facet capabilities)

### Job Queue: Redis 7 with BullMQ
**Decision**: Redis 7 with BullMQ for background job processing
**Rationale**:
- Reliable job queuing with retry mechanisms
- Excellent performance for caching
- Easy horizontal scaling
- Good TypeScript support
- Built-in job monitoring
**Alternatives considered**:
- RabbitMQ (rejected: more complex setup)
- AWS SQS (rejected: vendor lock-in)
- In-memory queues (rejected: not persistent)

### Maps: Apple MapKit JS
**Decision**: Apple MapKit JS with server-minted ES256 JWT tokens
**Rationale**:
- High-quality map rendering
- Good performance and reliability
- Server-side token generation for security
- Excellent clustering support for dense event areas
- Good accessibility features
**Alternatives considered**:
- Google Maps (rejected: higher costs and privacy concerns)
- Mapbox (rejected: Apple Maps better integrated with ecosystem)
- OpenStreetMap (rejected: requires more custom development)

### Containerization: Docker Compose + Dev Container
**Decision**: Docker Compose for services, Dev Container for development
**Rationale**:
- Consistent development environment
- Easy service orchestration
- Good integration with VS Code
- Reproducible builds
- Easy deployment to production
**Alternatives considered**:
- Kubernetes (rejected: overkill for this scale)
- Podman (rejected: Docker more widely adopted)
- Local development without containers (rejected: environment inconsistencies)

### Testing: Vitest + Playwright
**Decision**: Vitest for unit tests, Playwright for E2E tests
**Rationale**:
- Vitest provides fast unit testing with excellent TypeScript support
- Playwright offers reliable cross-browser E2E testing
- Both integrate well with modern development workflows
- Good performance and developer experience
**Alternatives considered**:
- Jest (rejected: Vitest faster and more modern)
- Cypress (rejected: Playwright better cross-browser support)
- Testing Library only (rejected: need E2E coverage)

### Code Quality: ESLint + Prettier
**Decision**: ESLint with TypeScript plugin and Prettier for formatting
**Rationale**:
- Catches potential bugs and enforces best practices
- Consistent code formatting across team
- Good TypeScript integration
- Extensive plugin ecosystem
**Alternatives considered**:
- Biome (rejected: newer, less mature ecosystem)
- Standard (rejected: less configurable)
- No linting (rejected: code quality issues)

## Data Architecture Decisions

### Metadata-Only Storage
**Decision**: Store only metadata and canonical links, not full third-party content
**Rationale**:
- Respects copyright and terms of service
- Reduces storage requirements
- Avoids legal issues with content scraping
- Keeps data fresh by linking to source
**Alternatives considered**:
- Full content caching (rejected: legal and storage concerns)
- Screenshot storage (rejected: storage and update issues)

### Event Deduplication Strategy
**Decision**: SHA1 hash of name + dates + geocell (~5km) for deduplication
**Rationale**:
- Prevents duplicate events from different sources
- Accounts for slight variations in naming
- Geographic clustering prevents false duplicates
- Efficient hash-based comparison
**Alternatives considered**:
- Exact string matching (rejected: too strict)
- Fuzzy matching (rejected: complex and error-prone)
- Manual deduplication (rejected: not scalable)

### Search Faceting Strategy
**Decision**: Pre-computed facets for country, type, size, price, accessibility, amenities
**Rationale**:
- Fast filtering performance
- Consistent facet values
- Easy to maintain and update
- Good user experience
**Alternatives considered**:
- Dynamic facets (rejected: performance issues)
- No faceting (rejected: poor user experience)

## Security and Compliance Decisions

### Secret Management
**Decision**: Environment variables with .secrets/ directory for sensitive files
**Rationale**:
- No secrets in repository
- Easy to manage in different environments
- Docker secrets support
- Follows security best practices
**Alternatives considered**:
- Hardcoded secrets (rejected: security risk)
- External secret management (rejected: added complexity for MVP)

### Data Ethics Compliance
**Decision**: Respect robots.txt and terms of service for all data sources
**Rationale**:
- Legal compliance
- Ethical data practices
- Maintains good relationships with data sources
- Reduces risk of being blocked
**Alternatives considered**:
- Ignore robots.txt (rejected: legal and ethical issues)
- Manual data entry only (rejected: not scalable)

## Performance Decisions

### Core Web Vitals Targets
**Decision**: <200ms API responses, <2s page loads, LCP <2.5s, FID <100ms, CLS <0.1
**Rationale**:
- Meets Google's Core Web Vitals standards
- Good user experience
- SEO benefits
- Competitive performance
**Alternatives considered**:
- No performance targets (rejected: poor user experience)
- More aggressive targets (rejected: may limit functionality)

### Caching Strategy
**Decision**: Redis caching for API responses and Typesense queries
**Rationale**:
- Reduces database load
- Improves response times
- Cost-effective
- Easy to implement and maintain
**Alternatives considered**:
- No caching (rejected: poor performance)
- CDN caching only (rejected: doesn't help with dynamic content)
