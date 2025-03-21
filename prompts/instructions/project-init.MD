# Project initialization

## Summary
The programming language is Typescript and the project is structured in a Nx monorepo that has 2 services: client (frontend) and api (backend). These 2 services share efficiently the same types for consistency.

## Tech stack

### Client
The client service is a React app with Vite that uses Tailwind v3 for styling and Shadcn UI for components.

### Api
The api service is a Hono app (nodejs version)