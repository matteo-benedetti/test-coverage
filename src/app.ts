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

  return app;
}

