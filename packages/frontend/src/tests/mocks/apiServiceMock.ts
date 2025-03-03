// packages/frontend/src/tests/mocks/apiServiceMock.ts
import { Article, CreateArticleDto, UpdateArticleDto } from '../../types/article';

// Mock articles database
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Test Article',
    content: 'This is a test article content',
    author: 'Test Author',
    tags: ['test', 'mock'],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: '2',
    title: 'Another Article',
    content: 'Content of another article',
    author: 'Another Author',
    tags: ['sample'],
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z')
  }
];

// Create a mocked version of the API service
export const mockApiService = {
  // In-memory store for simulating persistence during tests
  articles: [...mockArticles],
  
  // Reset the mock store
  resetArticles() {
    this.articles = [...mockArticles];
  },
  
  // Get all articles
  getArticles: jest.fn().mockImplementation(function() {
    return Promise.resolve([...this.articles]);
  }),
  
  // Get article by ID
  getArticleById: jest.fn().mockImplementation(function(id: string) {
    const article = this.articles.find(a => a.id === id);
    if (!article) {
      return Promise.reject(new Error('Article not found'));
    }
    return Promise.resolve({...article});
  }),
  
  // Create a new article
  createArticle: jest.fn().mockImplementation(function(articleData: CreateArticleDto) {
    const newArticle: Article = {
      id: String(Date.now()),
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.push(newArticle);
    return Promise.resolve({...newArticle});
  }),
  
  // Update an existing article
  updateArticle: jest.fn().mockImplementation(function(id: string, updateData: UpdateArticleDto) {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Article not found'));
    }
    
    const updatedArticle = {
      ...this.articles[index],
      ...updateData,
      updatedAt: new Date()
    };
    
    this.articles[index] = updatedArticle;
    return Promise.resolve({...updatedArticle});
  }),
  
  // Delete an article
  deleteArticle: jest.fn().mockImplementation(function(id: string) {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Article not found'));
    }
    
    this.articles.splice(index, 1);
    return Promise.resolve();
  })
};

// Setup function to inject mock API service
export const setupApiServiceMock = () => {
  jest.mock('../../services/api.service', () => ({
    apiService: mockApiService
  }));
  
  return mockApiService;
};