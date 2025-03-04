import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api.service';
import ArticlePreviewWrapper from '../components/ArticlePreviewWrapper';
import '../components/web-components'; // Import to register web components


const HomePage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { articles, loading, error   } = state;

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

  // Handle article deletion (passed to ArticleCard)
  const handleDeleteArticle = async (id: string) => {
    try {
      await apiService.deleteArticle(id);
      dispatch({ type: 'DELETE_ARTICLE_SUCCESS', payload: id });
    } catch (error) {
      console.error('Error deleting article:', error  );
    }
  };

  // Get the latest 3 articles for the showcase section
  const getLatestArticles = () => {
    return [...articles]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  // Content sections
  const renderHeroSection = () => (
    <section className="page-section">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-lg p-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Welcome to Articles-Manager</h1>
        <p className="text-xl mb-6">
          A modern platform for creating, managing, and sharing articles.
        </p>
        <Link
          to="/articles"
          className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded hover:bg-primary-50 transition-colors"
        >
          Browse Articles
        </Link>
      </div>
    </section>
  );

  const renderLatestArticlesSection = () => {
    const latestArticles = getLatestArticles();
    
    return (
      <section className="page-section">
        <h2 className="section-title">Latest Articles</h2>
        
        {loading ? (
          <div className="animate-pulse flex justify-center py-8">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error  }</p>
          </div>
        ) : latestArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticlePreviewWrapper
                key={article.id}
                article={article}
                onDelete={handleDeleteArticle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No articles found. Create your first article!</p>
            <Link
              to="/articles/new"
              className="mt-4 inline-block btn btn-primary"
            >
              Create Article
            </Link>
          </div>
        )}
      </section>
    );
  };
  

  const renderFeaturesSection = () => (
    <section className="page-section">
      <h2 className="section-title">Features</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          title="Easy Creation"
          description="Create and edit articles with our intuitive editor."
          color="primary"
        />
        <FeatureCard
          title="Organization"
          description="Organize your articles with tags and categories."
          color="secondary"
        />
        <FeatureCard
          title="Sharing"
          description="Share your knowledge with others easily."
          color="primary"
        />
      </div>
    </section>
  );

  // Reusable component for feature cards
  const FeatureCard: React.FC<{ title: string; description: string; color: 'primary' | 'secondary' }> = ({ 
    title, 
    description, 
    color 
  }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 ${
      color === 'primary' ? 'border-primary-500' : 'border-secondary-500'
    }`}>
      <h3 className={`text-xl font-semibold mb-3 ${
        color === 'primary' ? 'text-primary-700' : 'text-secondary-700'
      }`}>
        {title}
      </h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="page-container py-8">
      {renderHeroSection()}
      {renderLatestArticlesSection()}
      {renderFeaturesSection()}
    </div>
  );
};

export default HomePage;