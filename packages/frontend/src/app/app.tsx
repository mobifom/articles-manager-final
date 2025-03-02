// packages/frontend/src/app/app.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Lazy-loaded page components
const HomePage = lazy(() => import('../pages/HomePage'));
const ArticleListPage = lazy(() => import('../pages/ArticleListPage'));
const ArticleDetailPage = lazy(() => import('../pages/ArticleDetailPage'));
const ArticleFormPage = lazy(() => import('../pages/ArticleFormPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticleListPage />} />
              <Route path="/articles/new" element={<ArticleFormPage />} /> {/* This route should render ArticleFormPage */}
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/articles/:id/edit" element={<ArticleFormPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;