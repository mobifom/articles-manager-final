// packages/frontend/src/pages/ArticleFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api.service';
import { Article, CreateArticleDto, UpdateArticleDto } from '../types/article';

const ArticleFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const isEditMode = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Load article data if in edit mode
  useEffect(() => {
    const fetchArticle = async () => {
      if (!isEditMode || !id) return;
      
      try {
        setInitialLoading(true);
        const article = await apiService.getArticleById(id);
        initializeForm(article);
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchArticle();
  }, [id, isEditMode]);

  // Initialize form with article data
  const initializeForm = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setAuthor(article.author);
    setTags(article.tags || []);
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!author.trim()) {
      setError('Author is required');
      return false;
    }
    return true;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateArticle(id);
      } else {
        await createArticle();
      }
      
      navigate('/articles');
    } catch (err) {
      setError(isEditMode ? 'Failed to update article' : 'Failed to create article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new article
  const createArticle = async () => {
    const newArticleData: CreateArticleDto = {
      title,
      content,
      author,
      tags,
    };
    
    const newArticle = await apiService.createArticle(newArticleData);
    dispatch({ type: 'ADD_ARTICLE_SUCCESS', payload: newArticle });
  };

  // Update an existing article
  const updateArticle = async (articleId: string) => {
    const updateData: UpdateArticleDto = {
      title,
      content,
      author,
      tags,
    };
    
    const updatedArticle = await apiService.updateArticle(articleId, updateData);
    dispatch({ type: 'UPDATE_ARTICLE_SUCCESS', payload: updatedArticle });
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse">
        <p className="text-gray-600">Loading article...</p>
      </div>
    </div>
  );

  // Render the form
  const renderForm = () => (
    <>
      <div className="mb-6">
        <Link to="/articles" className="text-primary-600 hover:text-primary-800">
          &larr; Back to Articles
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Title input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Author input */}
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Content textarea */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Tags input */}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1.5 text-primary-600 hover:text-primary-800"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                id="tags"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-4 mt-6">
            <Link
              to="/articles"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="page-container py-8">
      {initialLoading ? renderLoading() : renderForm()}
    </div>
  );
};

export default ArticleFormPage;