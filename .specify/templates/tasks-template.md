# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

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
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript project with strict mode enabled
- [ ] T003 [P] Configure ESLint + Prettier for code quality
- [ ] T004 [P] Setup Vitest for unit testing
- [ ] T005 [P] Setup Playwright for E2E testing
- [ ] T006 [P] Configure Dev Container + Docker Compose

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T007 [P] Contract test POST /api/users in tests/contract/test_users_post.ts
- [ ] T008 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.ts
- [ ] T009 [P] Integration test user registration in tests/integration/test_registration.ts
- [ ] T010 [P] Integration test auth flow in tests/integration/test_auth.ts
- [ ] T011 [P] Accessibility tests (WCAG 2.1 AA) in tests/accessibility/
- [ ] T012 [P] Performance tests (Core Web Vitals) in tests/performance/

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T013 [P] User model in src/models/user.ts
- [ ] T014 [P] UserService CRUD in src/services/user_service.ts
- [ ] T015 [P] CLI --create-user in src/cli/user_commands.ts
- [ ] T016 POST /api/users endpoint
- [ ] T017 GET /api/users/{id} endpoint
- [ ] T018 Input validation with TypeScript strict types
- [ ] T019 Error handling and logging
- [ ] T020 Security headers and OWASP ASVS L1 compliance

## Phase 3.4: Integration
- [ ] T021 Connect UserService to DB
- [ ] T022 Auth middleware
- [ ] T023 Request/response logging
- [ ] T024 CORS and security headers
- [ ] T025 Idempotent job design
- [ ] T026 Retry mechanisms with exponential backoff

## Phase 3.5: Polish
- [ ] T027 [P] Unit tests for validation in tests/unit/test_validation.ts
- [ ] T028 Performance tests (Core Web Vitals budgets)
- [ ] T029 [P] Update docs/api.md
- [ ] T030 Remove duplication
- [ ] T031 Run manual-testing.md
- [ ] T032 Update CHANGELOG.md
- [ ] T033 Create ADR for architectural decisions

## Dependencies
- Tests (T007-T012) before implementation (T013-T020)
- T013 blocks T014, T021
- T022 blocks T024
- Implementation before polish (T027-T033)

## Parallel Example
```
# Launch T007-T012 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.ts"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.ts"
Task: "Integration test registration in tests/integration/test_registration.ts"
Task: "Integration test auth in tests/integration/test_auth.ts"
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