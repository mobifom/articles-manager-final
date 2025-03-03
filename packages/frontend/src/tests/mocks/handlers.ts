// packages/frontend/src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { Article } from '../../types/article';

// Mock data for tests
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Test Article',
    content: 'Content of test article',
    author: 'Test Author',
    tags: ['test'],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: '2',
    title: 'Another Test Article',
    content: 'Content of another test article',
    author: 'Another Author',
    tags: ['test', 'sample'],
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z')
  }
];

// In-memory article store for test persistence
let articles = [...mockArticles];

export const handlers = [
  // Get all articles
  http.get('/api/articles', () => {
    return HttpResponse.json(articles);
  }),
  
  // Create a new article
  http.post('/api/articles', async ({ request }) => {
    const articleData = await request.json();
    
    const newArticle: Article = {
      id: String(Date.now()),
      title: articleData.title,
      content: articleData.content,
      author: articleData.author,
      tags: articleData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    articles.push(newArticle);
    
    return HttpResponse.json(newArticle, { status: 201 });
  }),
  
  // Get an article by ID
  http.get('/api/articles/:id', ({ params }) => {
    const { id } = params;
    
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      return HttpResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(article);
  }),
  
  // Update an article
  http.put('/api/articles/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    
    const articleIndex = articles.findIndex(a => a.id === id);
    
    if (articleIndex === -1) {
      return HttpResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }
    
    const updatedArticle = {
      ...articles[articleIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    articles[articleIndex] = updatedArticle;
    
    return HttpResponse.json(updatedArticle);
  }),
  
  // Delete an article
  http.delete('/api/articles/:id', ({ params }) => {
    const { id } = params;
    
    const articleIndex = articles.findIndex(a => a.id === id);
    
    if (articleIndex === -1) {
      return HttpResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }
    
    articles.splice(articleIndex, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),
  
  // API status endpoint
  http.get('/api/status', () => {
    return HttpResponse.json({
      status: 'ok',
      environment: 'test',
      timestamp: new Date().toISOString()
    });
  })
];

// Helper function to reset the mock articles (useful between tests)
export const resetMockArticles = () => {
  articles = [...mockArticles];
};