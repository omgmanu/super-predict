import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { ApiResponse, Todo, User } from '@superseed/shared';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Sample data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
];

const todos: Todo[] = [
  {
    id: '1',
    title: 'Learn Hono',
    completed: false,
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '2',
    title: 'Build an awesome app',
    completed: false,
    createdAt: new Date().toISOString(),
    userId: '1',
  },
];

const app = new Hono();

// Middleware
app.use('/*', cors());

// Root endpoint
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Superseed API' });
});

// API routes
const api = new Hono();

// GET /todos - List all todos
api.get('/todos', (c) => {
  const response: ApiResponse<Todo[]> = {
    success: true,
    data: todos,
  };
  return c.json(response);
});

// GET /todos/:id - Get a specific todo
api.get('/todos/:id', (c) => {
  const id = c.req.param('id');
  const todo = todos.find((t) => t.id === id);
  
  if (!todo) {
    return c.json({ success: false, error: 'Todo not found' }, 404);
  }
  
  return c.json({ success: true, data: todo });
});

// GET /users - List all users
api.get('/users', (c) => {
  const response: ApiResponse<User[]> = {
    success: true,
    data: users,
  };
  return c.json(response);
});

// GET /users/:id - Get a specific user
api.get('/users/:id', (c) => {
  const id = c.req.param('id');
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404);
  }
  
  return c.json({ success: true, data: user });
});

// Mount API routes
app.route('/api', api);

console.log(`Starting server on http://${host}:${port}`);
serve({
  fetch: app.fetch,
  port,
});
