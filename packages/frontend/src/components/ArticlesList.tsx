// packages/frontend/src/components/ArticlesList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../services/api.service';
import ArticleCard from './ArticleCard';

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const data = await apiService.getArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const handleDeleteArticle = useCallback(async (id) => {
    try {
      await apiService.deleteArticle(id);
      setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  }, []);

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-primary-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-600">Loading articles...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <p>{error}</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDeleteArticle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-100 p-8 text-center">
          <p className="text-lg text-gray-600">
            {searchTerm
              ? 'No articles match your search criteria.'
              : 'No articles found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;