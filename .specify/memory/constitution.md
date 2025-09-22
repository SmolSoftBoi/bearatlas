<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Modified principles: None (initial creation)
- Added sections: All principles and governance sections
- Removed sections: None
- Templates requiring updates:
  - `.specify/templates/plan-template.md` ✅ updated
  - `.specify/templates/spec-template.md` ✅ updated
  - `.specify/templates/tasks-template.md` ✅ updated
  - `.specify/templates/commands/constitution.md` ⚠ pending (directory does not exist)
- Follow-up TODOs: None
-->

# Project Constitution

## Version: 1.0.0

**Ratified on:** 2025-09-22

**Last amended on:** 2025-09-22

## Principles

### Code Quality

- **Strict TypeScript Configuration:** All code MUST be written in TypeScript with the `strict` mode enabled to ensure type safety and reduce runtime errors.
- **Linting and Formatting:** Utilise ESLint with the `@typescript-eslint` plugin and Prettier for consistent code style and to catch potential issues early.

*Rationale:* Enforcing strict typing and consistent code style enhances maintainability and reduces bugs.

### Testing

- **Unit and Integration Testing:** Employ Vitest for unit tests and Playwright for end-to-end tests to ensure application reliability.
- **API Contract Testing:** Snapshot API responses to detect unintended changes and maintain backward compatibility.

*Rationale:* Comprehensive testing strategies ensure application stability and facilitate refactoring.

### Accessibility

- **Compliance with WCAG AA:** All user interfaces MUST meet at least WCAG 2.1 AA standards to ensure accessibility for users with disabilities.

*Rationale:* Adhering to accessibility standards broadens the user base and demonstrates social responsibility.

### Performance

- **Core Web Vitals Budgets:** Set and monitor performance budgets based on Core Web Vitals to ensure optimal user experience.

*Rationale:* Maintaining performance thresholds enhances user satisfaction and search engine rankings.

### Security

- **OWASP ASVS Level 1 Compliance:** Implement security controls as per OWASP Application Security Verification Standard Level 1.
- **Secret Management:** Ensure that sensitive information, such as API keys and passwords, are NEVER stored in the repository.

*Rationale:* Proactive security measures protect user data and maintain trust.

### Data Ethics

- **Respect for Robots.txt and Terms of Service:** Adhere to website crawling directives and terms of service agreements.
- **Metadata-Only Ingestion:** Collect only metadata with official links, avoiding unauthorised data extraction.

*Rationale:* Ethical data practices respect user privacy and legal boundaries.

### Reliability

- **Idempotent Jobs:** Design jobs to be idempotent to prevent unintended side effects from repeated executions.
- **Retries with Exponential Backoff:** Implement retry mechanisms with exponential backoff to handle transient failures gracefully.

*Rationale:* Ensuring reliability in operations minimises downtime and enhances user trust.

## Governance

### Pull Request Requirements

- **Automated Testing:** All pull requests MUST pass automated tests and schema validations before merging.
- **Trunk-Based Development:** Adopt a trunk-based development workflow with small, incremental pull requests to facilitate continuous integration.

### Infrastructure as Code

- **Development Environment:** Utilise Dev Containers and Docker Compose to manage development environments and infrastructure.
- **Environment Parity:** Ensure development, staging, and production environments are as similar as possible.

### Documentation and History

- **Conventional Commits:** Follow the Conventional Commits specification for commit messages to maintain a clear project history.
- **Changelog Maintenance:** Keep an up-to-date `CHANGELOG` to document all notable changes.
- **Architectural Decision Records:** Document significant architectural decisions in the `/adr` directory for future reference.

### Compliance and Review

- **Regular Reviews:** Conduct periodic compliance reviews to ensure adherence to all principles.
- **Version Control:** Constitution amendments follow semantic versioning with clear rationale for changes.

*Rationale:* Structured governance ensures code quality, facilitates collaboration, and maintains project integrity.