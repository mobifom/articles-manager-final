// packages/frontend/src/pages/ArticleListPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api.service';
import ArticlePreviewWrapper from '../components/ArticlePreviewWrapper';
import '../components/web-components'; // Import to register web components

const ArticleListPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { articles, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch articles when component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        dispatch({ type: 'FETCH_ARTICLES_START' });
        const data = await apiService.getArticles();
        dispatch({ type: 'FETCH_ARTICLES_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_ARTICLES_ERROR',
          payload: 'Failed to load articles',
        });
      }
    };

    fetchArticles();
  }, [dispatch]);

  // Handle article deletion
  const handleDeleteArticle = useCallback(
    async (id: string) => {
      try {
        await apiService.deleteArticle(id);
        dispatch({ type: 'DELETE_ARTICLE_SUCCESS', payload: id });
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
      }
    },
    [dispatch]
  );

  // Filter articles based on search term
  const getFilteredArticles = () => {
    if (!searchTerm.trim()) return articles;
    
    const searchLower = searchTerm.toLowerCase();
    return articles.filter((article) => (
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    ));
  };

  // Render page header
  const renderHeader = () => (
    <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
      <h1 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">All Articles</h1>
      <Link
        to="/articles/new"
        className="rounded bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
      >
        Create New Article
      </Link>
    </div>
  );

  // Render search input
  const renderSearchBar = () => (
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
  );

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse">
        <p className="text-gray-600">Loading articles...</p>
      </div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="rounded-lg bg-red-100 p-4 text-red-700">
      <p>{error}</p>
    </div>
  );

  // Render article list
const renderArticleList = () => {
  const filteredArticles = getFilteredArticles();
  
  if (filteredArticles.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-8 text-center">
        <p className="text-lg text-gray-600">
          {searchTerm
            ? 'No articles match your search criteria.'
            : 'No articles found. Create your first article!'}
        </p>
        {!searchTerm && (
          <Link
            to="/articles/new"
            className="mt-4 inline-block rounded bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
          >
            Create New Article
          </Link>
        )}
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredArticles.map((article) => (
        <ArticlePreviewWrapper
          key={article.id}
          article={article}
          onDelete={handleDeleteArticle}
        />
      ))}
    </div>
  );
};

  return (
    <div className="page-container py-8">
      {renderHeader()}
      {renderSearchBar()}
      
      {loading ? renderLoading() : error ? renderError() : renderArticleList()}
    </div>
  );
};

export default ArticleListPage;