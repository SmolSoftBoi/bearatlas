## Environment
install: |
  # Yarn - enforce zero‐install
  yarn install --immutable

## Testing
test-command

## Pull Request
pr-template: |
  ## ✨ What’s new
  - _Explain the change in one sentence._

  ## ✅ Checklist
  - [ ] CI green (tests & lint)
  - [ ] Docs updated if needed
  - [ ] No breaking changes without semver bump
