// packages/frontend/src/components/ArticleCard.test.tsx
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../tests/utils/test-utils';
import ArticleCard from './ArticleCard';
import { Article } from '../types/article';

// Mock article data for testing
const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  content: 'This is the content of the test article',
  author: 'Test Author',
  tags: ['test', 'unit'],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01')
};

// Mock delete function
const mockOnDelete = jest.fn();

describe('ArticleCard Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it('renders article information correctly', () => {
    // Render the component with our custom render function
    render(<ArticleCard article={mockArticle} onDelete={mockOnDelete} />);

    // Verify title is rendered
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    
    // Verify author is rendered (partial match because formatting might vary)
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
    
    // Verify content is rendered (might be truncated in the component)
    expect(screen.getByText(/This is the content/)).toBeInTheDocument();
    
    // Verify tags are rendered
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('unit')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    // Render the component
    render(<ArticleCard article={mockArticle} onDelete={mockOnDelete} />);
    
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
    (window.confirm as jest.Mock).mockReturnValueOnce(false);
    
    // Render the component
    render(<ArticleCard article={mockArticle} onDelete={mockOnDelete} />);
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this article?');
    
    // Verify onDelete was NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});