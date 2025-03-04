// packages/frontend/src/components/ArticleCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
  onDelete: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      onDelete(article.id);
    }
  };

  // Format date nicely
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength = 150): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary-800 mb-2">{article.title}</h2>
        
        <div className="text-sm text-gray-600 mb-3">
          <span>By {article.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.createdAt)}</span>
        </div>
        
        <p className="text-gray-700 mb-4">
          {truncateContent(article.content)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link
            to={`/articles/${article.id}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            to={`/articles/${article.id}/edit`}
            className="px-3 py-1 text-sm bg-primary-600 rounded text-white hover:bg-primary-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-600 rounded text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;