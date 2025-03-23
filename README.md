# SuperSeed Project

A monorepo project with TypeScript, React, and Hono.

## Structure

This project is an Nx monorepo containing:

- **Client**: React application with Vite, Tailwind CSS, and ShadCN UI
- **API**: Hono.js Node.js backend
- **Shared Types**: Common TypeScript interfaces used by both frontend and backend

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start API server
npx nx serve api

# In another terminal, start React client
npx nx serve client
```

The client will be available at http://localhost:4200
The API will be available at http://localhost:3000

## Project Features

- **Shared Types**: Both frontend and backend use the same TypeScript interfaces
- **API**: REST API with Hono.js
- **UI**: Modern UI with Tailwind CSS and ShadCN UI components
- **Routing**: React Router for frontend routing

## This project is mainly built with Cursor. Develoment steps are:

- **Init project**: Nx monorepo with 2 services: client (React) and api (Hono)
- **Setup client**: Tailwind 3 with Shadcn and basic components
- **Setup api**: WIP