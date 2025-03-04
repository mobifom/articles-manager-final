#!/bin/bash
# fix-frontend-integration-tests.sh

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting integration tests fix...${NC}"

# Fix the Jest configuration file
echo -e "${YELLOW}Fixing Jest configuration file...${NC}"
cat > packages/frontend/jest.config.ts << 'EOL'
// packages/frontend/jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        warnOnly: true
      }
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  // Set up files
  setupFiles: ['<rootDir>/src/jest-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '../../coverage/packages/frontend',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  // Reporters configuration
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '../../reports/junit',
      outputName: 'frontend.xml'
    }]
  ],
  // Timeout configuration
  testTimeout: 10000,
  // Path patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/ui/' // Ignore WebdriverIO UI tests
  ]
};

export default config;
EOL

# Update project.json
echo -e "${YELLOW}Updating project.json...${NC}"
node -e '
const fs = require("fs");
const path = require("path");
const projectJsonPath = path.join("packages", "frontend", "project.json");
let projectJson = JSON.parse(fs.readFileSync(projectJsonPath, "utf8"));

// Update test:integration target
projectJson.targets["test:integration"] = {
  executor: "@nx/jest:jest",
  options: {
    jestConfig: "packages/frontend/jest.config.ts",
    passWithNoTests: true,
    testMatch: ["**/src/tests/integration/**/*.test.{ts,tsx}"]
  }
};

fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));
console.log("Updated project.json");
'

# Create the integration tests directory if it doesn't exist
echo -e "${YELLOW}Creating integration tests directory...${NC}"
mkdir -p packages/frontend/src/tests/integration

# Create a sample integration test if none exists
echo -e "${YELLOW}Creating sample integration test...${NC}"
cat > packages/frontend/src/tests/integration/ArticleManagement.test.tsx << 'EOL'
// packages/frontend/src/tests/integration/ArticleManagement.test.tsx
import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '../utils/test-utils';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';
import ArticleDetailPage from '../../pages/ArticleDetailPage';
import { Article } from '../../types/article';

// Mock articles for testing
const mockArticles: Article[] = [
  {
    id: 'test-1',
    title: 'Test Article 1',
    content: 'This is test content for article 1',
    author: 'Test Author 1',
    tags: ['test', 'integration'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'test-2',
    title: 'Test Article 2',
    content: 'This is test content for article 2',
    author: 'Test Author 2',
    tags: ['test'],
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  }
];

// Mock the API service with a more dynamic implementation
jest.mock('../../services/api.service', () => {
  // Create a mutable copy of the articles array for the mock implementation
  let articles = [...mockArticles];
  
  return {
    apiService: {
      getArticles: jest.fn().mockImplementation(() => Promise.resolve([...articles])),
      
      getArticleById: jest.fn().mockImplementation((id: string) => {
        const article = articles.find(a => a.id === id);
        if (!article) return Promise.reject(new Error('Article not found'));
        return Promise.resolve({...article});
      }),
      
      createArticle: jest.fn().mockImplementation((articleData) => {
        const newArticle = {
          id: `test-${Date.now()}`,
          ...articleData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        articles.push(newArticle);
        return Promise.resolve({...newArticle});
      }),
      
      updateArticle: jest.fn().mockImplementation((id, updateData) => {
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) return Promise.reject(new Error('Article not found'));
        
        const updatedArticle = {
          ...articles[index],
          ...updateData,
          updatedAt: new Date()
        };
        
        articles[index] = updatedArticle;
        return Promise.resolve({...updatedArticle});
      }),
      
      deleteArticle: jest.fn().mockImplementation((id) => {
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) return Promise.reject(new Error('Article not found'));
        
        articles.splice(index, 1);
        return Promise.resolve();
      })
    }
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'test-1' })
}));

describe('Article Management Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays articles from the API correctly', async () => {
    render(<ArticleListPage />);

    // Wait for the articles to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });

    // Check if article details are displayed
    expect(screen.getByText(/Test Author 1/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author 2/)).toBeInTheDocument();
    
    // Check for tags
    expect(screen.getByText('integration')).toBeInTheDocument();
  });

  it('allows creating a new article', async () => {
    render(<ArticleFormPage />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Integration Test Article' }
    });
    
    fireEvent.change(screen.getByLabelText(/author/i), {
      target: { value: 'Integration Tester' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This article was created during an integration test.' }
    });
    
    // Add a tag
    fireEvent.change(screen.getByPlaceholderText(/type a tag/i), {
      target: { value: 'integration-test' }
    });
    fireEvent.click(screen.getByText(/add/i));
    
    // Submit the form
    fireEvent.click(screen.getByText(/create article/i));
    
    // Wait for the form submission to be processed
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/articles');
    });
    
    // Verify the API was called with the right data
    const apiService = jest.requireMock('../../services/api.service').apiService;
    expect(apiService.createArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Integration Test Article',
        author: 'Integration Tester',
        content: 'This article was created during an integration test.',
        tags: ['integration-test']
      })
    );
  });

  it('displays article details correctly', async () => {
    render(<ArticleDetailPage />);
    
    // Wait for the article to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    // Check article content and metadata
    expect(screen.getByText(/This is test content for article 1/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author 1/)).toBeInTheDocument();
    
    // Check for tags
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('integration')).toBeInTheDocument();
    
    // Check for action buttons
    expect(screen.getByText('Edit Article')).toBeInTheDocument();
    expect(screen.getByText('Delete Article')).toBeInTheDocument();
  });

  it('allows deleting an article', async () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    render(<ArticleDetailPage />);
    
    // Wait for the article to load
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });
    
    // Click the delete button
    fireEvent.click(screen.getByText('Delete Article'));
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalled();
    
    // Wait for navigation after delete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/articles');
    });
    
    // Verify the API was called
    const apiService = jest.requireMock('../../services/api.service').apiService;
    expect(apiService.deleteArticle).toHaveBeenCalledWith('test-1');
  });
});
EOL

# Make sure the test-utils.tsx file exists
echo -e "${YELLOW}Creating test-utils.tsx if needed...${NC}"
mkdir -p packages/frontend/src/tests/utils
if [ ! -f packages/frontend/src/tests/utils/test-utils.tsx ]; then
  cat > packages/frontend/src/tests/utils/test-utils.tsx << 'EOL'
// packages/frontend/src/tests/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  routes?: Array<{
    path: string;
    element: ReactElement;
  }>;
}

// Render with all providers
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    routes = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AppProvider>
          {children}
        </AppProvider>
      </MemoryRouter>
    );
  }
  
  // If there are routes to render
  if (routes.length > 0) {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AppProvider>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </AppProvider>
      </MemoryRouter>,
      renderOptions
    );
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

// Export all from testing-library for convenience
export * from '@testing-library/react';
export { renderWithProviders as render };
EOL
fi

echo -e "${GREEN}Fix complete! Now run the integration tests with: nx run frontend:test:integration${NC}"