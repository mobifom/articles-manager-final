// packages/backend/src/tests/api/articles.api.test.ts
import { ApiClient } from '../../generated/api-client';

describe('Articles API', () => {
  let apiClient: ApiClient;
  
  beforeAll(() => {
    // Initialize the API client
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3333',
    });
  });
  
  it('should get a list of articles', async () => {
    const response = await apiClient.articles.getArticles();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
  
  it('should create a new article', async () => {
    const newArticle = {
      title: 'Test Article',
      content: 'This is a test article created by the API test.',
      author: 'API Tester',
      tags: ['test', 'api']
    };
    
    const response = await apiClient.articles.createArticle(newArticle);
    expect(response.status).toBe(201);
    expect(response.data.title).toBe(newArticle.title);
    
    // Store the created article ID for use in other tests
    const createdArticleId = response.data.id;
    
    // Test getting the article by ID
    const getResponse = await apiClient.articles.getArticleById(createdArticleId);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(createdArticleId);
    
    // Test updating the article
    const updateResponse = await apiClient.articles.updateArticle(createdArticleId, {
      title: 'Updated Test Article'
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.title).toBe('Updated Test Article');
    
    // Test deleting the article
    const deleteResponse = await apiClient.articles.deleteArticle(createdArticleId);
    expect(deleteResponse.status).toBe(204);
  });
});