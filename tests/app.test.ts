import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

describe('Fastify App', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health'
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: 'ok' });
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/'
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ message: 'Welcome to the Fastify API!' });
    });
  });

  describe('GET /items', () => {
    it('should return all items', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items'
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.items).toHaveLength(3);
      expect(body.items[0]).toHaveProperty('id');
      expect(body.items[0]).toHaveProperty('name');
    });
  });

  describe('GET /items/:id', () => {
    it('should return item by ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items/1'
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ id: 1, name: 'Item One' });
    });

    it('should return 404 for non-existent item', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items/999'
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ error: 'Item not found' });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items/abc'
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ error: 'Invalid ID format' });
    });
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/items',
        payload: { name: 'New Item' }
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({ id: 4, name: 'New Item' });
    });

    it('should return 400 when name is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/items',
        payload: {}
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ error: 'Name is required' });
    });
  });
});

