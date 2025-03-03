// packages/frontend/src/tests/integration/ArticleManagement.test.tsx
import React from 'react';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';
import { setupApiServiceMock, mockApiService } from '../mocks/apiServiceMock';

// Setup the API mock before tests
setupApiServiceMock();

describe('Article Management Integration', () => {
  beforeEach(() => {
    // Reset the mock API data before each test
    mockApiService.resetArticles();
  });

  it('allows creating an article and displays it in the article list', async () => {
    // Mock the navigate function from React Router
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    // First render the form to create an article
    const { unmount } = render(<ArticleFormPage />);
    
    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Integration Test Article' }
    });
    
    fireEvent.change(screen.getByLabelText(/author/i), {
      target: { value: 'Integration Tester' }
    });
    
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'This article was created during an integration test.' }
    });
    
    // Add a tag
    fireEvent.change(screen.getByPlaceholderText(/type a tag/i), {
      target: { value: 'integration' }
    });
    fireEvent.click(screen.getByText(/add/i));
    
    // Submit the form
    fireEvent.click(screen.getByText(/create article/i));
    
    // Wait for the form submission to be processed
    await waitFor(() => {
      expect(mockApiService.createArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Integration Test Article',
          author: 'Integration Tester',
          content: 'This article was created during an integration test.',
          tags: ['integration']
        })
      );
    });
    
    // Unmount the form component
    unmount();
    
    // Now render the article list page
    render(<ArticleListPage />);
    
    // Wait for articles to load and verify our new article is in the mocked API data
    await waitFor(() => {
      const mockArticles = mockApiService.articles;
      expect(mockArticles.some(article => article.title === 'Integration Test Article')).toBe(true);
    });
  });
});