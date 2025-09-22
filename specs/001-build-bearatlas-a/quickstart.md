# Quickstart: BearAtlas Global Travel Index

## Overview
BearAtlas is a global index of gay-bear travel experiences with comprehensive filtering, multiple view modes, and a 3-step Trip Wizard. This quickstart guide demonstrates the core functionality and user workflows.

## Prerequisites
- Docker and Docker Compose installed
- Node.js 22+ and Yarn installed
- Apple Developer account (for MapKit JS)

## Setup Instructions

### 1. Environment Setup
```bash
# Clone and setup
git clone <repository-url>
cd bearatlas

# Copy environment template
cp .env.example .env

# Edit .env with your values
# Required: DATABASE_URL, REDIS_URL, TYPESENSE_API_KEY
# Optional: APPLE_TEAM_ID, APPLE_MAPS_KEY_ID for maps functionality
```

### 2. Start Services
```bash
# Start database, Redis, and Typesense
docker compose up -d db redis typesense

# Wait for services to be ready (30 seconds)
sleep 30

# Run database migrations
yarn prisma:migrate

# Seed initial data
yarn seed

# Sync Typesense schema
yarn typesense:sync
```

### 3. Start Development Servers
```bash
# Start Next.js frontend (terminal 1)
yarn dev

# Start background worker (terminal 2)
yarn worker
```

### 4. Access Application
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/events
- Typesense: http://localhost:8108

## User Workflows

### 1. Basic Event Search
**Goal**: Find events in Europe for March 2025

**Steps**:
1. Navigate to http://localhost:3000
2. Set date range: March 1-31, 2025
3. Select country: "Germany" or "Spain"
4. Click "Search"
5. View results in List view

**Expected Result**: List of events in selected countries for March 2025

### 2. Advanced Filtering
**Goal**: Find dance events with sauna amenities

**Steps**:
1. On search page, expand "Advanced Filters"
2. Select vibe: "dance"
3. Select amenities: "sauna"
4. Click "Apply Filters"
5. View filtered results

**Expected Result**: Only dance events with sauna facilities

### 3. Map View Exploration
**Goal**: Explore events geographically

**Steps**:
1. Click "Map" tab
2. Wait for map to load (requires Apple Maps token)
3. Zoom to desired region
4. Click on event markers for details
5. Use cluster markers for dense areas

**Expected Result**: Interactive map with event locations

### 4. Calendar Export
**Goal**: Export events to personal calendar

**Steps**:
1. Apply desired filters
2. Click "Calendar" tab
3. Click "Export ICS" button
4. Download calendar file
5. Import into calendar application

**Expected Result**: ICS file with all filtered events

### 5. Trip Wizard
**Goal**: Get curated recommendations

**Steps**:
1. Click "Trip Wizard" button
2. Step 1: Select date range
3. Step 2: Choose location radius
4. Step 3: Select vibe and budget preferences
5. View curated shortlist

**Expected Result**: Personalized event recommendations

## API Testing

### 1. Search API
```bash
# Basic search
curl "http://localhost:3000/api/events?q=dance&country=DE"

# Advanced filtering
curl "http://localhost:3000/api/events?type=WEEK&vibe=dance&amenities=sauna&dateStart=2025-03-01&dateEnd=2025-03-31"

# Pagination
curl "http://localhost:3000/api/events?page=2&limit=10"
```

### 2. Apple Maps Token
```bash
# Get MapKit token
curl "http://localhost:3000/api/apple-maps-token"

# Expected response:
# {
#   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9...",
#   "expiresAt": "2025-01-28T10:00:00Z"
# }
```

### 3. Calendar Export
```bash
# Export filtered events as ICS
curl "http://localhost:3000/api/calendar?country=DE&type=WEEK" \
  -H "Accept: text/calendar" \
  -o events.ics
```

## Data Ingestion Testing

### 1. Run Sample Ingestion
```bash
# Ingest sample events
yarn ingest

# Check worker logs
docker compose logs worker
```

### 2. Verify Data
```bash
# Check database
yarn prisma studio

# Check Typesense
curl "http://localhost:8108/collections/events/documents/search" \
  -H "X-TYPESENSE-API-KEY: your-api-key" \
  -d '{"q":"*","query_by":"name"}'
```

## Troubleshooting

### Common Issues

**1. Apple Maps not loading**
- Check Apple Developer credentials in .env
- Verify .secrets/ directory contains .p8 file
- Check browser console for token errors

**2. Database connection errors**
- Ensure PostgreSQL is running: `docker compose ps`
- Check DATABASE_URL in .env
- Run migrations: `yarn prisma:migrate`

**3. Typesense connection errors**
- Ensure Typesense is running: `docker compose ps`
- Check TYPESENSE_API_KEY in .env
- Verify schema sync: `yarn typesense:sync`

**4. Worker not processing jobs**
- Check Redis connection: `docker compose ps`
- Verify REDIS_URL in .env
- Check worker logs: `docker compose logs worker`

### Performance Testing

**1. Load Testing**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3000/api/events
```

**2. Core Web Vitals**
- Use Chrome DevTools Lighthouse
- Target: LCP <2.5s, FID <100ms, CLS <0.1
- Test on slow 3G connection

## Success Criteria

### Functional Requirements
- [ ] All filter combinations work correctly
- [ ] Map view displays events with clustering
- [ ] List view shows sortable results
- [ ] Calendar view exports valid ICS files
- [ ] Trip Wizard provides relevant recommendations
- [ ] API returns proper error responses

### Performance Requirements
- [ ] API responses <200ms for simple queries
- [ ] Page loads <2s on fast connection
- [ ] Core Web Vitals meet targets
- [ ] Map loads within 3s with valid token

### Accessibility Requirements
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### Data Quality Requirements
- [ ] No duplicate events in results
- [ ] All events have valid dates and locations
- [ ] Source attribution present
- [ ] Last-checked timestamps current

## Next Steps

1. **Add Authentication**: Implement user accounts and preferences
2. **Enhanced Filtering**: Add more filter options and saved searches
3. **Event Details**: Expand event detail pages with reviews and photos
4. **Mobile App**: Develop React Native mobile application
5. **Admin Panel**: Build admin interface for content management
6. **Analytics**: Add usage tracking and performance monitoring
