const fs = require('fs');
const path = require('path');
const { generateApi } = require('swagger-typescript-api');
const swaggerJSDoc = require('swagger-jsdoc');

// Define swagger options (should match your swagger.ts file)
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
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the article',
            },
            title: {
              type: 'string',
              description: 'Title of the article',
            },
            content: {
              type: 'string',
              description: 'Content of the article',
            },
            author: {
              type: 'string',
              description: 'Author of the article',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the article',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
          required: ['id', 'title', 'content', 'author', 'createdAt', 'updatedAt'],
        },
        CreateArticleDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the article',
            },
            content: {
              type: 'string',
              description: 'Content of the article',
            },
            author: {
              type: 'string',
              description: 'Author of the article',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the article',
            },
          },
          required: ['title', 'content', 'author'],
        },
        UpdateArticleDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the article',
            },
            content: {
              type: 'string',
              description: 'Content of the article',
            },
            author: {
              type: 'string',
              description: 'Author of the article',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the article',
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/routes/*.ts'], // Path to the API docs
};

// Generate Swagger specification
const specs = swaggerJSDoc(options);

// Ensure output directories exist
const outputDir = path.resolve(__dirname, '../src/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Save Swagger specification to file
fs.writeFileSync(
  path.resolve(outputDir, 'swagger.json'),
  JSON.stringify(specs, null, 2)
);
console.log('Swagger specification generated.');

// Generate API client for testing
async function generateClient() {
  try {
    const { files } = await generateApi({
      name: 'ApiClient',
      output: path.resolve(outputDir, 'api-client'),
      input: path.resolve(outputDir, 'swagger.json'),
      generateClient: true,
      generateRouteTypes: true,
      generateResponses: true,
      toJS: false,
    });
    console.log('API client generated successfully.');
  } catch (error) {
    console.error('Error generating API client:', error);
  }
}

// Generate server stubs
async function generateServer() {
  try {
    // Create server stubs directory
    const serverStubsDir = path.resolve(outputDir, 'server-stubs');
    if (!fs.existsSync(serverStubsDir)) {
      fs.mkdirSync(serverStubsDir, { recursive: true });
    }
    
    // Generate basic server stubs from the swagger specification
    const routeDefinitions = specs.paths;
    const routes = [];
    
    // Process each path and method
    Object.keys(routeDefinitions).forEach(path => {
      const pathDefinition = routeDefinitions[path];
      Object.keys(pathDefinition).forEach(method => {
        const operation = pathDefinition[method];
        const routeInfo = {
          path,
          method,
          operationId: operation.operationId || `${method}${path.replace(/[\/\-{}]/g, '_')}`,
          summary: operation.summary || '',
          parameters: operation.parameters || [],
          requestBody: operation.requestBody,
          responses: operation.responses
        };
        routes.push(routeInfo);
      });
    });
    
    // Generate stub file content
    const stubContent = `
import express from 'express';
import { Request, Response } from 'express';

// Auto-generated server stubs based on Swagger specification
// DO NOT MODIFY THIS FILE DIRECTLY

const router = express.Router();

${routes.map(route => `
/**
 * ${route.summary}
 * Path: ${route.path}
 * Method: ${route.method.toUpperCase()}
 */
router.${route.method}('${route.path.replace(/^\/api/, '')}', (req: Request, res: Response) => {
  // TODO: Implement ${route.operationId || `${route.method} ${route.path}`}
  res.status(501).json({ message: 'Not implemented' });
});
`).join('\n')}

export default router;
`.trim();
    
    fs.writeFileSync(
      path.resolve(serverStubsDir, 'routes.ts'),
      stubContent
    );
    console.log('Server stubs generated successfully.');
  } catch (error) {
    console.error('Error generating server stubs:', error);
  }
}

// Run the generation functions
Promise.all([generateClient(), generateServer()])
  .then(() => {
    console.log('Generation completed successfully.');
  })
  .catch(err => {
    console.error('Generation failed:', err);
    process.exit(1);
  });