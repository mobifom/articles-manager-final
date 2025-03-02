import * as swaggerJSDocModule from 'swagger-jsdoc';
import * as swaggerUiModule from 'swagger-ui-express';
import { Express } from 'express';

// Use the default export
const swaggerJSDoc = typeof swaggerJSDocModule === 'function' ? swaggerJSDocModule : (swaggerJSDocModule as any).default;

const swaggerUi =  swaggerUiModule;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Articles-Manager API',
      version: '1.0.0',
      description: 'API for managing articles',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Article: {
          // Schema definition
        },
        CreateArticleDto: {
          // Schema definition
        },
        UpdateArticleDto: {
          // Schema definition
        }
      }
    }
  },
  apis: ['./src/app/routes/*.ts'],
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('Swagger docs available at /api-docs');
  }