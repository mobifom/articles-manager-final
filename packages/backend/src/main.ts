// packages/backend/src/main.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as path from 'path';

// Import routes and swagger config
import articlesRouter from './app/routes/articles.routes';
import { setupSwagger } from './app/config/swagger';

// Use environment variables with defaults
const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3333;

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development to allow Swagger UI to work properly
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/articles', articlesRouter);

// Setup Swagger
setupSwagger(app);

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello API' });
});

// Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// Serve static frontend in production
if (process.env['NODE_ENV'] === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Start server
const server = app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
  console.log(`Swagger docs available at http://${host}:${port}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;