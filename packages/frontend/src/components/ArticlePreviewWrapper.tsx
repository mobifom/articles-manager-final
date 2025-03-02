// packages/frontend/src/components/ArticlePreviewWrapper.tsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../types/article';
import '../components/web-components'; // Import to ensure the web component is registered

interface ArticlePreviewWrapperProps {
  article: Article;
  onDelete?: (id: string) => void;
}

const ArticlePreviewWrapper: React.FC<ArticlePreviewWrapperProps> = ({
  article,
  onDelete
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set the article object directly on the web component
    if ('article' in element) {
      (element as any).article = article;
    }

    // Handle custom events from the web component
    const handleViewEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      navigate(`/articles/${customEvent.detail.id}`);
    };

    const handleEditEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      navigate(`/articles/${customEvent.detail.id}/edit`);
    };

    const handleDeleteEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (window.confirm('Are you sure you want to delete this article?') && onDelete) {
        onDelete(customEvent.detail.id);
      }
    };

    element.addEventListener('article-view', handleViewEvent);
    element.addEventListener('article-edit', handleEditEvent);
    element.addEventListener('article-delete', handleDeleteEvent);

    return () => {
      element.removeEventListener('article-view', handleViewEvent);
      element.removeEventListener('article-edit', handleEditEvent);
      element.removeEventListener('article-delete', handleDeleteEvent);
    };
  }, [article, navigate, onDelete]);

  // Format tags for the web component
  const tagsString = article.tags && article.tags.length > 0 
    ? JSON.stringify(article.tags) 
    : '';

  return (
    <article-preview
      ref={elementRef as React.RefObject<HTMLElement>}
      article-id={article.id}
      title={article.title}
      content={article.content}
      author={article.author}
      created-at={article.createdAt.toString()}
      tags={tagsString}
    ></article-preview>
  );
};

export default ArticlePreviewWrapper;