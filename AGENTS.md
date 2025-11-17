# Agent Guidelines

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

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

## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## App architecture
- Routing splits the UI into three standalone feature pages (DMX control, Fixture detail, Dashboard) defined in `src/app/app.routes.ts`.
- Shared control state (plans, config, sound library, restart actions) lives in `ControlStateService`; prefer consuming its signals instead of duplicating API calls in components.

## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).
- Do not write Regular expressions in templates (they are not supported).

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Testing
- Prefer running `npm test` for changes that affect logic or UI behavior.
- For build or configuration changes, use `npm run build` when feasible.

## Documentation
- Update relevant documentation or comments when you add or change behavior so that future contributors can quickly understand the intent.
