# Superseed API

This is the API service for the Superseed project. It's a Hono app (Node.js) with Redis as the persistence layer.

## Features

- Authentication & authorization of users with X (Twitter)
- Create & list games
- Distribute coins to users
- Environment variables validation with Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Redis instance (Upstash recommended)

### Environment Setup

1. Copy the `.env.example` file to a new file called `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the environment variables in the `.env` file:
   - Set up your Redis URL
   - Add your Twitter OAuth credentials
   - Generate a random string for SESSION_ENCRYPTION_KEY

The application uses Zod to validate these environment variables at startup, ensuring all required values are present and correctly formatted.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `GET /api/auth/x`: Initiates Twitter/X login
- `GET /api/auth/x/callback`: Twitter/X OAuth callback
- `GET /api/auth/me`: Get the current authenticated user
- `POST /api/auth/logout`: Logout current user

### Games

- `POST /api/games`: Create a new game
- `GET /api/games`: List all games for the current user
- `GET /api/games/:id`: Get a specific game by ID

### Coins

- `POST /api/coins/add`: Add coins to the user's balance
- `GET /api/coins/balance`: Get user's current coin balance

## Project Structure

- `src/main.ts`: Entry point of the application
- `src/routes/`: API route definitions
- `src/services/`: Business logic for the routes
- `src/db/`: Database helpers for Redis
- `src/utils/`: Utility functions
- `env.ts`: Environment variables validation with Zod

## Redis Data Structure

### User Entity
- Key format: `user:userId`
- Properties: id, username, profileImageUrl, points, etc.

### Game Entity
- Key format: `game:gameId:userId:status`
- Properties: id, userId, status, startTime, endTime, betAmount, priceAtStart, priceAtEnd, prediction 