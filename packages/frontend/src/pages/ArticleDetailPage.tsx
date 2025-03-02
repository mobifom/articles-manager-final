// packages/frontend/src/pages/ArticleDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.service';
import { Article } from '../types/article';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data when component mounts or id changes
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiService.getArticleById(id);
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Handle article deletion
  const handleDelete = async () => {
    if (!article) return;
    
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await apiService.deleteArticle(article.id);
        navigate('/articles');
      } catch (err) {
        setError('Failed to delete article');
        console.error(err);
      }
    }
  };

  // Format a date in a readable format
  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse">
        <p className="text-gray-600">Loading article...</p>
      </div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <>
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        <p>{error || 'Article not found'}</p>
      </div>
      <div className="mt-4">
        <Link
          to="/articles"
          className="text-primary-600 hover:text-primary-800"
        >
          &larr; Back to Articles
        </Link>
      </div>
    </>
  );

  // Render article content
  const renderArticle = () => {
    if (!article) return null;
    
    return (
      <>
        <div className="mb-4">
          <Link
            to="/articles"
            className="text-primary-600 hover:text-primary-800"
          >
            &larr; Back to Articles
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{article.title}</h1>
          
          <div className="mb-6 flex items-center text-gray-600">
            <span>By {article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          
          {renderTags()}

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="flex space-x-4">
          <Link
            to={`/articles/${article.id}/edit`}
            className="rounded bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
          >
            Edit Article
          </Link>
          <button
            onClick={handleDelete}
            className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Delete Article
          </button>
        </div>
      </>
    );
  };

  // Render article tags
  const renderTags = () => {
    if (!article?.tags || article.tags.length === 0) return null;
    
    return (
      <div className="mb-6">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="mr-2 rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container py-8">
      {loading ? renderLoading() : error || !article ? renderError() : renderArticle()}
    </div>
  );
};

export default ArticleDetailPage;