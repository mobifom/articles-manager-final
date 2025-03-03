import * as swaggerJSDocModule from 'swagger-jsdoc';
import * as swaggerUiModule from 'swagger-ui-express';
import { Express } from 'express';

// Use the default export or the module itself depending on how it's exported
const swaggerJSDoc = typeof swaggerJSDocModule === 'function' ? swaggerJSDocModule : (swaggerJSDocModule as any).default;
const swaggerUi = swaggerUiModule;

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
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the article"
            },
            title: {
              type: "string",
              description: "Title of the article"
            },
            content: {
              type: "string",
              description: "Content of the article"
            },
            author: {
              type: "string",
              description: "Author of the article"
            },
            tags: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Tags associated with the article"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp"
            }
          },
          required: ["id", "title", "content", "author", "createdAt", "updatedAt"]
        },
        CreateArticleDto: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the article"
            },
            content: {
              type: "string",
              description: "Content of the article"
            },
            author: {
              type: "string",
              description: "Author of the article"
            },
            tags: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Tags associated with the article"
            }
          },
          required: ["title", "content", "author"]
        },
        UpdateArticleDto: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the article"
            },
            content: {
              type: "string",
              description: "Content of the article"
            },
            author: {
              type: "string",
              description: "Author of the article"
            },
            tags: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Tags associated with the article"
            }
          }
        }
      }
    }
  },
  apis: ['./packages/backend/src/app/routes/*.ts'],
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger docs available at /api-docs');
}