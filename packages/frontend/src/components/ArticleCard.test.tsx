import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from './ArticleCard';

const mockArticle = {
  id: '1',
  title: 'Test Article',
  content: 'This is the content of the test article',
  author: 'Test Author',
  tags: ['test', 'unit'],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01')
};

const mockOnDelete = jest.fn();

// Helper function to render the component with Router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ArticleCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders article information correctly', () => {
    renderWithRouter(
      <ArticleCard article={mockArticle} onDelete={mockOnDelete} />
    );

    // Verify title is rendered
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    
    // Verify author is rendered
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    
    // Verify content is truncated and rendered correctly
    expect(screen.getByText('This is the content of the test article')).toBeInTheDocument();
    
    // Verify tags are rendered
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('unit')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    renderWithRouter(
      <ArticleCard article={mockArticle} onDelete={mockOnDelete} />
    );
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this article?');
    
    // Verify onDelete was called with the article id
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
  
  it('does not call onDelete when delete is canceled', () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);
    
    renderWithRouter(
      <ArticleCard article={mockArticle} onDelete={mockOnDelete} />
    );
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this article?');
    
    // Verify onDelete was NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});