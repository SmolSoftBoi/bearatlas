# Data Model: BearAtlas Global Travel Index

## Core Entities

### Event
**Purpose**: Represents a travel experience (bear week, run, cruise, resort, party)

**Fields**:
- `id`: UUID (Primary Key)
- `name`: String (Required) - Event name
- `type`: Enum (RUN|WEEK|CRUISE|RESORT|PARTY) - Event type
- `startsAt`: DateTime (Required) - Event start date/time
- `endsAt`: DateTime (Required) - Event end date/time
- `durationDays`: Integer (Computed) - Duration in days
- `country`: String (Required) - Country code (ISO 3166-1 alpha-2)
- `region`: String (Optional) - State/province/region
- `city`: String (Optional) - City name
- `latitude`: Float (Optional) - Geographic latitude
- `longitude`: Float (Optional) - Geographic longitude
- `venues`: JSON Array - Array of venue objects with name, address, coordinates
- `estSize`: Enum (SMALL|MEDIUM|LARGE|MASSIVE) - Estimated attendance size
- `priceBand`: Enum (BUDGET|MID_RANGE|PREMIUM|LUXURY) - Price category
- `vibe`: JSON Array - Array of vibe tags (dance, relax, fetish, mixed)
- `accessibility`: JSON Object - Accessibility features (wheelchair, step-free, etc.)
- `clothingOptional`: Boolean - Whether clothing is optional
- `amenities`: JSON Array - Array of amenities (sauna, pool, gym, restaurant, etc.)
- `links`: JSON Object - Official booking links and social media
- `source`: String (Required) - Source identifier
- `sourceId`: String (Optional) - Source-specific ID
- `hash`: String (Unique) - SHA1 hash for deduplication
- `lastChecked`: DateTime - Last time data was verified
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Record last update timestamp

**Validation Rules**:
- `startsAt` must be before `endsAt`
- `durationDays` must be positive
- `latitude` must be between -90 and 90
- `longitude` must be between -180 and 180
- `hash` must be unique across all events
- `vibe` array must contain only valid vibe tags
- `amenities` array must contain only valid amenity types

**Relationships**:
- Belongs to Source (many-to-one)
- Has many CrowdReports (one-to-many)

### Source
**Purpose**: Represents data sources for events

**Fields**:
- `id`: UUID (Primary Key)
- `code`: String (Unique) - Short identifier for source
- `name`: String (Required) - Human-readable source name
- `url`: String (Required) - Source website URL
- `enabled`: Boolean (Default: true) - Whether source is active
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Record last update timestamp

**Validation Rules**:
- `code` must be unique and URL-safe
- `url` must be valid URL format
- `name` must not be empty

**Relationships**:
- Has many Events (one-to-many)

### CrowdReport
**Purpose**: User-submitted corrections and updates to event information

**Fields**:
- `id`: UUID (Primary Key)
- `eventId`: UUID (Foreign Key) - Related event
- `type`: Enum (CORRECTION|UPDATE|ADDITION) - Report type
- `field`: String (Required) - Field being reported on
- `oldValue`: JSON (Optional) - Current value
- `newValue`: JSON (Required) - Proposed new value
- `reason`: String (Optional) - User explanation
- `status`: Enum (PENDING|APPROVED|REJECTED) - Review status
- `reviewedBy`: UUID (Optional) - Admin who reviewed
- `reviewedAt`: DateTime (Optional) - Review timestamp
- `reviewNotes`: String (Optional) - Admin review notes
- `createdAt`: DateTime - Report creation timestamp
- `updatedAt`: DateTime - Report last update timestamp

**Validation Rules**:
- `eventId` must reference existing event
- `field` must be valid event field name
- `newValue` must be valid for the field type
- `status` must be valid enum value

**Relationships**:
- Belongs to Event (many-to-one)

### Filter
**Purpose**: Represents user search criteria (transient, not persisted)

**Fields**:
- `dateRange`: Object - { start: Date, end: Date }
- `duration`: Array - Array of duration options
- `location`: Object - { country?: string, region?: string, city?: string, radius?: number }
- `eventType`: Array - Array of event types
- `sizeBand`: Array - Array of size bands
- `priceBand`: Array - Array of price bands
- `vibe`: Array - Array of vibe tags
- `accessibility`: Object - Accessibility requirements
- `clothingOptional`: Boolean - Whether clothing-optional events only
- `amenities`: Array - Array of required amenities

### TripWizardState
**Purpose**: Represents 3-step wizard progression (transient, not persisted)

**Fields**:
- `step`: Integer (1-3) - Current wizard step
- `dates`: Object - { start: Date, end: Date }
- `locationRadius`: Object - { center: { lat, lng }, radius: number }
- `vibeBudget`: Object - { vibe: Array, priceBand: Array }

## Enums and Constants

### EventType
- `RUN` - Bear run (short event, typically 1-3 days)
- `WEEK` - Bear week (longer event, typically 5-7 days)
- `CRUISE` - Bear cruise (ship-based event)
- `RESORT` - Resort-based event
- `PARTY` - Single party or club event

### SizeBand
- `SMALL` - <100 attendees
- `MEDIUM` - 100-500 attendees
- `LARGE` - 500-2000 attendees
- `MASSIVE` - 2000+ attendees

### PriceBand
- `BUDGET` - Low-cost events
- `MID_RANGE` - Moderate pricing
- `PREMIUM` - High-end pricing
- `LUXURY` - Luxury pricing

### VibeTags
- `dance` - Dance-focused events
- `relax` - Relaxation-focused events
- `fetish` - Fetish-focused events
- `mixed` - Mixed activities

### Amenities
- `sauna` - Sauna facilities
- `pool` - Swimming pool
- `gym` - Fitness facilities
- `restaurant` - Dining options
- `bar` - Bar/lounge
- `spa` - Spa services
- `wifi` - Internet access
- `parking` - Parking facilities

### AccessibilityFeatures
- `wheelchair` - Wheelchair accessible
- `step_free` - No steps required
- `elevator` - Elevator access
- `accessible_bathroom` - Accessible restrooms
- `hearing_loop` - Hearing assistance
- `braille` - Braille signage

## Data Relationships

```
Source (1) ----< (many) Event (1) ----< (many) CrowdReport
```

## Indexes and Performance

### Primary Indexes
- Event.id (Primary Key)
- Event.hash (Unique Index)
- Event.startsAt (Index for date filtering)
- Event.country (Index for location filtering)
- Event.type (Index for type filtering)
- Source.code (Unique Index)

### Composite Indexes
- Event(country, type, startsAt) - For location + type + date queries
- Event(startsAt, endsAt) - For date range queries
- CrowdReport(eventId, status) - For admin review queries

### Search Indexes (Typesense)
- Full-text search on Event.name
- Facet fields: country, type, estSize, priceBand, clothingOptional, amenities, vibe
- Sortable fields: startsAt, name, createdAt
- Filterable fields: all enum and boolean fields

## Data Validation and Constraints

### Business Rules
1. Events cannot have end dates before start dates
2. Duration must be calculated correctly from start/end dates
3. Geographic coordinates must be valid if provided
4. Hash must be unique to prevent duplicates
5. Source must be enabled to create new events
6. Crowd reports must reference existing events

### Data Integrity
1. Foreign key constraints on all relationships
2. Check constraints on enum values
3. Not null constraints on required fields
4. Unique constraints on hash and source code
5. JSON schema validation for complex fields

## Migration Strategy

### Initial Schema
1. Create Source table with seed data
2. Create Event table with all fields
3. Create CrowdReport table
4. Add indexes for performance
5. Seed initial data for testing

### Future Extensions
1. Add user authentication tables (future)
2. Add event favorites/bookmarks (future)
3. Add event reviews/ratings (future)
4. Add notification preferences (future)
