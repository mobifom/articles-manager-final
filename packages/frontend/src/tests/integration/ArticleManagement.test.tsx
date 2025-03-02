import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';
import ArticleFormPage from '../../pages/ArticleFormPage';
import ArticleListPage from '../../pages/ArticleListPage';

// Helper function to render components with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        {ui}
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Article Management Integration', () => {
  it('allows creating an article and displays it in the article list', async () => {
    // First render the form to create an article
    const { unmount } = renderWithProviders(<ArticleFormPage />);
    
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
    
    // Wait for the submission to complete
    await waitFor(() => {
      // This will throw if the success isn't shown, failing the test
      expect(screen.queryByText(/creating article/i)).not.toBeInTheDocument();
    });
    
    // Unmount the form component
    unmount();
    
    // Now render the article list page
    renderWithProviders(<ArticleListPage />);
    
    // Wait for the articles to load and verify our new article is displayed
    await waitFor(() => {
      expect(screen.getByText('Integration Test Article')).toBeInTheDocument();
      expect(screen.getByText(/Integration Tester/)).toBeInTheDocument();
      expect(screen.getByText(/integration/)).toBeInTheDocument();
    });
  });
});