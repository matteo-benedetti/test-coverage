# Fastify + Vitest App

A basic Fastify REST API with Vitest tests.

## Setup

```bash
npm install
```

## Running the Server

```bash
# Development mode (with watch)
npm run dev

# Production mode
npm start
```

The server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| GET    | /            | Welcome message     |
| GET    | /health      | Health check        |
| GET    | /items       | Get all items       |
| GET    | /items/:id   | Get item by ID      |
| POST   | /items       | Create a new item   |

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

