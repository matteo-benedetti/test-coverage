import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

interface Item {
  id: number;
  name: string;
}

interface ItemParams {
  id: string;
}

interface CreateItemBody {
  name?: string;
}

interface UpdateItemBody {
  name?: string;
}

interface SearchQuery {
  name?: string;
}

const items: Item[] = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' },
  { id: 3, name: 'Item Three' }
];

export function buildApp(opts: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify(opts);

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Root route
  app.get('/', async () => {
    return { message: 'Welcome to the Fastify API!' };
  });

  // Get all items
  app.get('/items', async () => {
    return { items };
  });

  // Search items by name
  app.get<{ Querystring: SearchQuery }>('/items/search', async (request, reply) => {
    const { name } = request.query;

    if (!name) {
      reply.status(400);
      return { error: 'Name query parameter is required' };
    }

    const matchingItems = items.filter(item =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );

    return { items: matchingItems };
  });

  // Get item by ID
  app.get<{ Params: ItemParams }>('/items/:id', async (request, reply) => {
    const { id } = request.params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      reply.status(400);
      return { error: 'Invalid ID format' };
    }

    const item = items.find(i => i.id === itemId);

    if (!item) {
      reply.status(404);
      return { error: 'Item not found' };
    }

    return item;
  });

  // Create a new item
  app.post<{ Body: CreateItemBody }>('/items', async (request, reply) => {
    const { name } = request.body || {};

    if (!name) {
      reply.status(400);
      return { error: 'Name is required' };
    }

    reply.status(201);
    return { id: 4, name };
  });

  // Update an item
  app.put<{ Params: ItemParams; Body: UpdateItemBody }>('/items/:id', async (request, reply) => {
    const { id } = request.params;
    const { name } = request.body || {};
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      reply.status(400);
      return { error: 'Invalid ID' };
    }

    const itemIndex = items.findIndex(i => i.id === itemId);

    if (itemIndex === -1) {
      reply.status(404);
      return { error: 'Item not found' };
    }

    if (!name) {
      reply.status(400);
      return { error: 'Name is required' };
    }

    items[itemIndex].name = name;
    return items[itemIndex];
  });

  return app;
}

