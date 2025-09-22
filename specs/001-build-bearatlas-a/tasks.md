# Tasks: BearAtlas Global Travel Index

**Input**: Design documents from `/specs/001-build-bearatlas-a/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Monorepo**: `apps/web/` (Next.js frontend), `packages/worker/` (Node.js backend)
- **Root configs**: Repository root for shared configurations
- Paths shown below assume monorepo structure - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create monorepo structure with Yarn workspaces
- [ ] T002 Initialize Next.js 15 app with TypeScript strict mode
- [ ] T003 [P] Configure ESLint + Prettier for code quality
- [ ] T004 [P] Setup Vitest for unit testing
- [ ] T005 [P] Setup Playwright for E2E testing
- [ ] T006 [P] Configure Dev Container + Docker Compose

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T007 [P] Contract test /api/events search endpoint in tests/contract/test_events_search.ts
- [ ] T008 [P] Contract test /api/apple-maps-token endpoint in tests/contract/test_apple_maps_token.ts
- [ ] T009 [P] Contract test /api/calendar export endpoint in tests/contract/test_calendar_export.ts
- [ ] T010 [P] Integration test event search workflow in tests/integration/test_event_search.ts
- [ ] T011 [P] Integration test map view functionality in tests/integration/test_map_view.ts
- [ ] T012 [P] Integration test calendar export workflow in tests/integration/test_calendar_export.ts
- [ ] T013 [P] Accessibility tests (WCAG 2.1 AA) in tests/accessibility/
- [ ] T014 [P] Performance tests (Core Web Vitals) in tests/performance/

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T015 [P] Event model with Prisma schema in packages/worker/prisma/schema.prisma
- [ ] T016 [P] Source model with Prisma schema in packages/worker/prisma/schema.prisma
- [ ] T017 [P] CrowdReport model with Prisma schema in packages/worker/prisma/schema.prisma
- [ ] T018 Database migrations and seed data in packages/worker/prisma/
- [ ] T019 [P] Typesense collection setup with facets in scripts/typesense/schema.json
- [ ] T020 [P] Data validation and constraints in packages/worker/src/validation/
- [ ] T021 Events search API with Typesense integration in apps/web/app/api/events/route.ts
- [ ] T022 Apple Maps token generation with ES256 JWT in apps/web/app/api/apple-maps-token/route.ts
- [ ] T023 Calendar export API with ICS generation in apps/web/app/api/calendar/route.ts
- [ ] T024 Error handling and response formatting in apps/web/lib/api/
- [ ] T025 API rate limiting and security headers in apps/web/middleware.ts
- [ ] T026 Input validation and sanitization in apps/web/lib/validation/

## Phase 3.4: Integration
- [ ] T027 Connect Prisma to PostgreSQL database
- [ ] T028 Connect Typesense for search functionality
- [ ] T029 Connect Redis with BullMQ for job processing
- [ ] T030 Request/response logging middleware
- [ ] T031 CORS and security headers
- [ ] T032 Idempotent job design in packages/worker/src/jobs/
- [ ] T033 Retry mechanisms with exponential backoff in packages/worker/src/jobs/

## Phase 3.5: Frontend Implementation
- [ ] T034 [P] Search page with filter panel in apps/web/app/(site)/page.tsx
- [ ] T035 [P] Map view with Apple MapKit JS integration in apps/web/app/map/page.tsx
- [ ] T036 [P] List view with sortable results in apps/web/app/list/page.tsx
- [ ] T037 [P] Calendar view with export functionality in apps/web/app/calendar/page.tsx
- [ ] T038 [P] Trip Wizard 3-step flow in apps/web/app/wizard/page.tsx
- [ ] T039 [P] Event detail pages in apps/web/app/event/[id]/page.tsx
- [ ] T040 [P] Filters panel component in apps/web/components/FiltersPanel.tsx
- [ ] T041 [P] Map canvas component in apps/web/components/MapCanvas.tsx
- [ ] T042 [P] Event card component in apps/web/components/EventCard.tsx
- [ ] T043 [P] Date range component in apps/web/components/DateRange.tsx

## Phase 3.6: Worker Implementation
- [ ] T044 [P] Event ingestion pipeline with BullMQ in packages/worker/src/pipeline.ts
- [ ] T045 [P] Data source adapters (ICS/HTML/JSON) in packages/worker/src/adapters/
- [ ] T046 [P] Event deduplication and enrichment in packages/worker/src/jobs/enrich.ts
- [ ] T047 [P] Background job monitoring and retry logic in packages/worker/src/jobs/index.ts
- [ ] T048 [P] Mock adapter for sample data in packages/worker/src/adapters/mock.ts

## Phase 3.7: Polish
- [ ] T049 [P] Unit tests for validation in tests/unit/test_validation.ts
- [ ] T050 [P] Unit tests for API routes in tests/unit/test_api_routes.ts
- [ ] T051 [P] Unit tests for components in tests/unit/test_components.ts
- [ ] T052 Performance tests (Core Web Vitals budgets)
- [ ] T053 [P] Update docs/api.md
- [ ] T054 Remove duplication and refactor
- [ ] T055 Run manual-testing.md
- [ ] T056 Update CHANGELOG.md
- [ ] T057 Create ADR for architectural decisions

## Dependencies
- Tests (T007-T014) before implementation (T015-T043)
- T015-T017 blocks T018, T021
- T018 blocks T027
- T019 blocks T021, T028
- T021 blocks T034, T035, T036, T037
- T022 blocks T035
- T023 blocks T037
- T027-T029 blocks T032-T033
- Implementation before polish (T049-T057)

## Parallel Example
```
# Launch T007-T014 together:
Task: "Contract test /api/events search endpoint in tests/contract/test_events_search.ts"
Task: "Contract test /api/apple-maps-token endpoint in tests/contract/test_apple_maps_token.ts"
Task: "Contract test /api/calendar export endpoint in tests/contract/test_calendar_export.ts"
Task: "Integration test event search workflow in tests/integration/test_event_search.ts"
Task: "Integration test map view functionality in tests/integration/test_map_view.ts"
Task: "Integration test calendar export workflow in tests/integration/test_calendar_export.ts"
Task: "Accessibility tests (WCAG 2.1 AA) in tests/accessibility/"
Task: "Performance tests (Core Web Vitals) in tests/performance/"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
