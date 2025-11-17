# Agent Guidelines

This repository does not currently include any agent guidance, so use this file as the starting point for future contributors.

## Scope
These instructions apply to the entire repository unless a more specific `AGENTS.md` is added in a subdirectory.

## Coding style
- Use TypeScript and Angular conventions.
- Follow the existing Prettier configuration (single quotes, 100 character width, Angular parser for templates).
- Keep TypeScript and Angular code idiomatic: leverage Angular components, services, and modules instead of ad-hoc globals.
- Avoid introducing new linting or formatting tools without project approval.
- Use modern Angular @if control flow blocks
- Use Angular’s @for loop syntax with tracking
- Use Angular @switch syntax for conditionals

## Testing
- Prefer running `npm test` for changes that affect logic or UI behavior.
- For build or configuration changes, use `npm run build` when feasible.

## Documentation
- Update relevant documentation or comments when you add or change behavior so that future contributors can quickly understand the intent.
