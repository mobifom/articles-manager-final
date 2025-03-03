// packages/frontend/src/tests/acceptance/ArticleManagement.test.tsx
import { defineFeature, loadFeature } from 'jest-cucumber';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';
import ArticleDetailPage from '../../pages/ArticleDetailPage';

// Load the feature file
const feature = loadFeature('./src/tests/acceptance/features/article-management.feature', {
  loadRelativePath: true
});

// Mock the API service
jest.mock('../../services/api.service', () => {
  const mockArticles = [];
  
  return {
    apiService: {
      getArticles: jest.fn().mockImplementation(() => Promise.resolve(mockArticles)),
      getArticleById: jest.fn().mockImplementation((id) => {
        const article = mockArticles.find(a => a.id === id);
        if (!article) return Promise.reject(new Error('Article not found'));
        return Promise.resolve(article);
      }),
      createArticle: jest.fn().mockImplementation((articleData) => {
        const newArticle = {
          id: 'test-id',
          ...articleData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockArticles.push(newArticle);
        return Promise.resolve(newArticle);
      }),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn()
    }
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

defineFeature(feature, (test) => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock articles
    jest.requireMock('../../services/api.service').apiService.getArticles.mockImplementation(() => 
      Promise.resolve([])
    );
  });

  test('Creating and viewing an article', ({ given, when, then, and }) => {
    let renderResult: ReturnType<typeof render> | null = null;
    
    given('I am on the article creation page', () => {
      renderResult = render(
        <ArticleFormPage />,
        { route: '/articles/new' }
      );
      
      expect(screen.getByText(/create new article/i)).toBeInTheDocument();
    });
    
    when('I fill in the article form with the following details:', (table) => {
      // Extract data from the feature table
      const formData = table.reduce((acc, row) => {
        acc[row.Field.toLowerCase()] = row.Value;
        return acc;
      }, {} as Record<string, string>);
      
      // Fill title
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: formData.title }
      });
      
      // Fill author
      fireEvent.change(screen.getByLabelText(/author/i), {
        target: { value: formData.author }
      });
      
      // Fill content
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: formData.content }
      });
      
      // Add tags
      const tags = formData.tags.split(',').map(tag => tag.trim());
      
      for (const tag of tags) {
        fireEvent.change(screen.getByPlaceholderText(/type a tag/i), {
          target: { value: tag }
        });
        fireEvent.click(screen.getByText(/add/i));
      }
    });
    
    and('I submit the article form', async () => {
      fireEvent.click(screen.getByText(/create article/i));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/articles');
      });
    });
    
    then('I should be redirected to the articles list page', () => {
      // Clean up previous render
      if (renderResult) renderResult.unmount();
      
      // Update mock implementation to include the new article
      const apiService = jest.requireMock('../../services/api.service').apiService;
      apiService.getArticles.mockImplementation(() => 
        Promise.resolve([{
          id: 'test-id',
          title: 'My First Article',
          author: 'BDD Tester',
          content: 'This is a test article...',
          tags: ['bdd', 'test', 'acceptance'],
          createdAt: new Date(),
          updatedAt: new Date()
        }])
      );
      
      // Render the list page
      renderResult = render(<ArticleListPage />, { route: '/articles' });
    });
    
    and('I should see the article "My First Article" in the list', async () => {
      await waitFor(() => {
        expect(screen.getByText('My First Article')).toBeInTheDocument();
      });
    });
    
    when('I click on the article "My First Article"', async () => {
      // Find the article title and click it
      fireEvent.click(screen.getByText('My First Article'));
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/articles/test-id');
      });
    });
    
    then('I should see the article details page', async () => {
      // Clean up previous render
      if (renderResult) renderResult.unmount();
      
      // Update mock to return article details
      const apiService = jest.requireMock('../../services/api.service').apiService;
      apiService.getArticleById.mockImplementation(() => 
        Promise.resolve({
          id: 'test-id',
          title: 'My First Article',
          author: 'BDD Tester',
          content: 'This is a test article...',
          tags: ['bdd', 'test', 'acceptance'],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );
      
      // Render the detail page
      renderResult = render(
        <ArticleDetailPage />,
        { route: '/articles/test-id' }
      );
    });
    
    and('The article should display the correct information', async () => {
      // Wait for article to load
      await waitFor(() => {
        expect(screen.getByText('My First Article')).toBeInTheDocument();
        expect(screen.getByText(/BDD Tester/)).toBeInTheDocument();
        expect(screen.getByText(/This is a test article/)).toBeInTheDocument();
      });
    });
  });
});