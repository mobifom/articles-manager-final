// packages/frontend/src/tests/integration/ArticleManagement.test.tsx
import React from 'react';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';

// Mock the API service directly inside the test file
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
          id: `test-${Date.now()}`,
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

describe('Article Management Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows creating an article and displays it in the article list', async () => {
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
      expect(mockNavigate).toHaveBeenCalledWith('/articles');
    });
    
    // Verify the API was called with the right data
    const createArticleMock = jest.requireMock('../../services/api.service').apiService.createArticle;
    expect(createArticleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Integration Test Article',
        author: 'Integration Tester',
        content: 'This article was created during an integration test.',
        tags: ['integration']
      })
    );
    
    // Unmount the form component
    unmount();
  });
});