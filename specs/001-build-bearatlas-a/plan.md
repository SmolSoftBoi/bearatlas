
# Implementation Plan: BearAtlas Global Travel Index

**Branch**: `001-build-bearatlas-a` | **Date**: 2025-09-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-bearatlas-a/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build BearAtlas, a global index of gay-bear travel experiences with comprehensive filtering, multiple view modes (Map/List/Calendar), and a 3-step Trip Wizard. Technical approach uses a monorepo with Next.js 15 frontend, Node.js 22 worker, PostgreSQL with Prisma, Redis with BullMQ, Typesense for search, and Apple MapKit JS for mapping.

## Technical Context
**Language/Version**: TypeScript 5.x, Node.js 22, Next.js 15  
**Primary Dependencies**: Next.js 15 (App Router), Prisma, BullMQ, Typesense, Apple MapKit JS, Redis, PostgreSQL 16  
**Storage**: PostgreSQL 16 (system of record), Redis 7 (jobs/cache), Typesense 0.25 (facet search)  
**Testing**: Vitest (unit), Playwright (E2E), ESLint + Prettier  
**Target Platform**: Web browsers, Docker containers  
**Project Type**: web (monorepo with frontend + backend worker)  
**Performance Goals**: <200ms API responses, <2s page loads, Core Web Vitals compliance  
**Constraints**: Metadata-only storage, robots.txt compliance, no secrets in repo, WCAG 2.1 AA accessibility  
**Scale/Scope**: 10k+ events, 100k+ users, global coverage

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality Gates
- [x] TypeScript strict mode enabled
- [x] ESLint + Prettier configuration planned
- [x] No JavaScript files in new code

### Testing Gates
- [x] Vitest for unit testing planned
- [x] Playwright for E2E testing planned
- [x] API contract testing strategy defined

### Accessibility Gates
- [x] WCAG 2.1 AA compliance planned
- [x] Semantic HTML structure considered
- [x] Keyboard navigation support planned

### Performance Gates
- [x] Core Web Vitals budgets defined
- [x] Performance monitoring strategy planned

### Security Gates
- [x] OWASP ASVS Level 1 compliance planned
- [x] Secret management strategy defined
- [x] No secrets in repository

### Data Ethics Gates
- [x] Robots.txt compliance planned
- [x] Terms of Service respect planned
- [x] Metadata-only ingestion approach

### Reliability Gates
- [x] Idempotent job design planned
- [x] Retry mechanisms with exponential backoff planned

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 (Web application) - monorepo with apps/web (Next.js frontend) and packages/worker (Node.js backend)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Specific Task Categories for BearAtlas**:

**Setup Tasks (T001-T006)**:
- T001: Create monorepo structure with Yarn workspaces
- T002: Initialize Next.js 15 app with TypeScript strict mode
- T003: Setup Prisma with PostgreSQL schema
- T004: Configure Typesense with events collection schema
- T005: Setup Redis with BullMQ for job processing
- T006: Configure Docker Compose for all services

**Contract Tests (T007-T012)**:
- T007: Contract test for /api/events search endpoint
- T008: Contract test for /api/apple-maps-token endpoint
- T009: Contract test for /api/calendar export endpoint
- T010: Integration test for event search workflow
- T011: Integration test for map view functionality
- T012: Integration test for calendar export workflow

**Data Model Implementation (T013-T018)**:
- T013: Event model with Prisma schema
- T014: Source model with Prisma schema
- T015: CrowdReport model with Prisma schema
- T016: Database migrations and seed data
- T017: Typesense collection setup with facets
- T018: Data validation and constraints

**Core API Implementation (T019-T024)**:
- T019: Events search API with Typesense integration
- T020: Apple Maps token generation with ES256 JWT
- T021: Calendar export API with ICS generation
- T022: Error handling and response formatting
- T023: API rate limiting and security headers
- T024: Input validation and sanitization

**Frontend Implementation (T025-T032)**:
- T025: Search page with filter panel
- T026: Map view with Apple MapKit JS integration
- T027: List view with sortable results
- T028: Calendar view with export functionality
- T029: Trip Wizard 3-step flow
- T030: Event detail pages
- T031: Responsive design and accessibility
- T032: Performance optimization and Core Web Vitals

**Worker Implementation (T033-T036)**:
- T033: Event ingestion pipeline with BullMQ
- T034: Data source adapters (ICS/HTML/JSON)
- T035: Event deduplication and enrichment
- T036: Background job monitoring and retry logic

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 36 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
