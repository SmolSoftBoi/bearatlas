-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('RUN', 'WEEK', 'CRUISE', 'RESORT', 'PARTY');
CREATE TYPE "SizeBand" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'MASSIVE');
CREATE TYPE "PriceBand" AS ENUM ('BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY');

-- CreateTable sources
CREATE TABLE "sources" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable events
CREATE TABLE "events" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "type" "EventType" NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "durationDays" INTEGER NOT NULL,
  "country" VARCHAR(2) NOT NULL,
  "region" VARCHAR(100),
  "city" VARCHAR(100),
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "venues" JSONB NOT NULL DEFAULT '[]',
  "estSize" "SizeBand",
  "priceBand" "PriceBand",
  "vibe" JSONB NOT NULL DEFAULT '[]',
  "accessibility" JSONB NOT NULL DEFAULT '{}',
  "clothingOptional" BOOLEAN NOT NULL DEFAULT FALSE,
  "amenities" JSONB NOT NULL DEFAULT '[]',
  "links" JSONB NOT NULL DEFAULT '{}',
  "source" VARCHAR(50) NOT NULL,
  "sourceId" TEXT,
  "hash" VARCHAR(40) NOT NULL UNIQUE,
  "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "events_source_fkey" FOREIGN KEY ("source") REFERENCES "sources"("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable crowd_reports
CREATE TABLE "crowd_reports" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "crowd_reports_event_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX "events_startsAt_idx" ON "events" ("startsAt");
CREATE INDEX "events_country_idx" ON "events" ("country");
CREATE INDEX "events_type_idx" ON "events" ("type");
CREATE INDEX "events_hash_idx" ON "events" ("hash");
