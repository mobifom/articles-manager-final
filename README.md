# ArticlesManager

An NX-based full-stack application for managing articles, built with modern development practices. This project showcases a React frontend, Express backend, and comprehensive testing strategy.

![ArticlesManager Logo](https://github.com/nrwl/nx/raw/master/images/nx-logo.png)

## Overview

ArticlesManager is a full-stack application that demonstrates modern development workflows. It consists of:
- A React-based single-page application (SPA)
- A Node.js/TypeScript backend with Express
- Comprehensive testing setup across multiple testing types

## Features

- Create, read, update, and delete articles
- Tag-based organization (not fully implemented)
- Responsive design with Tailwind CSS
- Server-side API with Swagger documentation

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS with Open Props
- Custom Web Components  <<ArticlePreview>>
- React Router for navigation
- Context API for state management
- Vite for development
- Rollup for production builds

### Backend
- Node.js with TypeScript
- Express for API
- Swagger for API documentation and client generation
- In-memory storage (expandable to database)

### Testing
- Unit tests with Jest
- Integration tests with Jest
- UI tests with WebdriverIO/Jasmine
- API tests with Swagger-generated client
- Acceptance tests with Jest-Cucumber (BDD approach) <<The test case has been written, but it is not being executed.>>

## Getting Started

### Prerequisites
- Node.js 18 or later
- pnpm 9.0.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mobifom/articles-manager-final.git
cd articles-manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development servers:
```bash
nx serve backend
nx serve backend
```

This will start both the frontend and backend services:
- Frontend: http://localhost:4200
- Backend: http://localhost:3333
- API Documentation: http://localhost:3333/api-docs

## Project Structure

```
articles-manager/
├── packages/
│   ├── backend/             # Express API
│   ├── backend-e2e/         # API tests
│   └── frontend/            # React SPA
├── nx.json                  # NX workspace configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Running Tests

The project includes different types of tests:

### Unit Tests
Tests individual components in isolation.
```bash
nx run frontend:test:unit
```

### UI Tests
End-to-end tests for user interfaces.
```bash
nx run frontend:test:ui
```

### API Tests
Tests for the backend API endpoints.
```bash
nx run backend:test:api
```

### Integration Tests
Tests interactions between components or modules.
```bash
nx run frontend:test:integration
```

### Acceptance Tests
BDD-style tests for validating user journeys.
```bash
nx run frontend:test:acceptance
```

### All Tests
Run all test types with a single command:
```bash
nx run test:all
```

## Bundling Strategy

### Development Build
- Uses Vite for quick development iterations
- Hot module replacement for React components
- Minimal transformations for fast rebuilds

### Production Build
- Uses Rollup for optimized production builds
- Implements the following optimizations:
  - Code splitting for modular loading
  - Lazy loading of routes
  - Critical CSS extraction
  - Modern ES module outputs
  - Proper cache control headers

### Script Loading Strategy
- Critical scripts are loaded inline
- Non-critical scripts use ES Module imports
- Preloads key resources for improved performance

## Web Components

ArticlesManager includes a custom web component implementation:

- `<article-preview>`: A self-contained component for displaying article previews
  - Encapsulated with Shadow DOM
  - Interacts with the application via custom events
  - Fully stylable via CSS custom properties

## API Documentation

The backend API is documented with Swagger. You can explore the API at:
```
http://localhost:3333/api-docs
```

Available endpoints:
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create a new article
- `PUT /api/articles/:id` - Update an article
- `DELETE /api/articles/:id` - Delete an article

## Code Quality

### Linting
The project uses ESLint for code quality and style enforcement:
```bash
frontend: nx run frontend:lint 
backend: nx run backend:lint
the workspace: nx run-many --target=lint
```

Or fix automatically:
```bash
nx run-many --target=lint --fix
```

### Code Coverage
Test coverage is tracked with Jest's built-in coverage reporter:
- Statements: 50% minimum
- Branches: 50% minimum
- Functions: 50% minimum
- Lines: 50% minimum

View coverage reports in the `coverage/` directory after running tests.

## React Patterns Used

### Hooks
- `useState` for local component state
- `useEffect` for side effects like data fetching
- `useContext` with Provider pattern for global state
- `useCallback` for memoized functions

### Component Design
- Functional components with TypeScript
- Composition over inheritance
- Proper data flow from parent to child components
- Memoization to prevent unnecessary renders

## Styling

### Tailwind CSS
- Utility-first approach for rapid UI development
- Responsive design with breakpoint utilities
- Custom theme configuration with color variables

### Open Props
- Design tokens for consistent styling
- Integration with Tailwind's design system
- Custom variables for component styling

## Future Improvements

- Database integration with Drizzle ORM
- User authentication and authorization
- Advanced searching and filtering
- Image upload capabilities
- Real-time collaborative editing

## License

This project is licensed under the MIT License - see the LICENSE file for details.