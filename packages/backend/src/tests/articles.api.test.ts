// packages/backend/src/tests/articles.api.test.ts
import { Api } from '../../generated/api-client/ApiClient';

describe('Articles API', () => {
  let apiClient: Api<unknown>;
  
  beforeAll(() => {
    // Initialize the API client
    apiClient = new Api<unknown>({
      baseUrl: 'http://localhost:3333',
    });
  });
  
  it('should get a list of articles', async () => {
    const response = await apiClient.api.articlesList();
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
    
    const response = await apiClient.api.articlesCreate(newArticle);
    expect(response.status).toBe(201);
    expect(response.data.title).toBe(newArticle.title);
    
    // Store the created article ID for use in other tests
    const createdArticleId = response.data.id;
    
    // Test getting the article by ID
    const getResponse = await apiClient.api.articlesDetail(createdArticleId);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(createdArticleId);
    
    // Test updating the article
    const updateResponse = await apiClient.api.articlesUpdate(createdArticleId, {
      title: 'Updated Test Article'
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.title).toBe('Updated Test Article');
    
    // Test deleting the article
    const deleteResponse = await apiClient.api.articlesDelete(createdArticleId);
    expect(deleteResponse.status).toBe(204);
  });
});