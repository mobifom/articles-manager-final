// packages/frontend/src/tests/acceptance/ArticleManagement.test.tsx
import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';
import ArticleDetailPage from '../../pages/ArticleDetailPage';

// Setup API service mock
jest.mock('../../services/api.service', () => ({
  apiService: {
    getArticles: jest.fn().mockResolvedValue([
      {
        id: '1',
        title: 'My First Article',
        author: 'BDD Tester',
        content: 'This is a test article...',
        tags: ['bdd', 'test', 'acceptance'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]),
    getArticleById: jest.fn().mockResolvedValue({
      id: '1',
      title: 'My First Article',
      author: 'BDD Tester',
      content: 'This is a test article...',
      tags: ['bdd', 'test', 'acceptance'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    createArticle: jest.fn().mockImplementation((article) => Promise.resolve({
      id: '1',
      ...article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    updateArticle: jest.fn().mockImplementation((id, article) => Promise.resolve({
      id,
      ...article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    deleteArticle: jest.fn().mockResolvedValue(undefined)
  }
}));

// Mock navigate function
const mockNavigate = jest.fn();

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Load the feature file
const feature = loadFeature('./src/tests/acceptance/features/article-management.feature');

defineFeature(feature, (test) => {
  test('Creating and viewing an article', ({ given, when, then, and }) => {
    let renderResult: any;
    
    given('I am on the article creation page', () => {
      renderResult = render(
        <MemoryRouter initialEntries={['/articles/new']}>
          <AppProvider>
            <Routes>
              <Route path="/articles/new" element={<ArticleFormPage />} />
              <Route path="/articles" element={<ArticleListPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
            </Routes>
          </AppProvider>
        </MemoryRouter>
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
      renderResult.unmount();
      
      // Render the list page
      renderResult = render(
        <MemoryRouter initialEntries={['/articles']}>
          <AppProvider>
            <ArticleListPage />
          </AppProvider>
        </MemoryRouter>
      );
      
      expect(screen.getByText(/all articles/i)).toBeInTheDocument();
    });
    
    and('I should see the article "My First Article" in the list', async () => {
      await waitFor(() => {
        expect(screen.getByText('My First Article')).toBeInTheDocument();
      });
    });
    
    when('I click on the article "My First Article"', () => {
      fireEvent.click(screen.getByText('My First Article'));
    });
    
    then('I should see the article details page', async () => {
      // Clean up previous render
      renderResult.unmount();
      
      // Render the detail page
      renderResult = render(
        <MemoryRouter initialEntries={['/articles/1']}>
          <AppProvider>
            <ArticleDetailPage />
          </AppProvider>
        </MemoryRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('My First Article')).toBeInTheDocument();
      });
    });
    
    and('The article should display the correct information', async () => {
      await waitFor(() => {
        expect(screen.getByText('BDD Tester')).toBeInTheDocument();
        expect(screen.getByText('This is a test article...')).toBeInTheDocument();
        expect(screen.getByText('bdd')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('acceptance')).toBeInTheDocument();
      });
    });
  });
});