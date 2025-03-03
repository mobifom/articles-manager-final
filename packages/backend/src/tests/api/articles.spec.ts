// packages/backend/src/tests/api/articles.spec.ts
import { Api } from '../../generated/api-client/ApiClient';

describe('Articles API', () => {
  let apiClient: Api<unknown>;
  let createdArticleId: string;
  
  beforeAll(() => {
    // Initialize the API client with the server URL
    apiClient = new Api<unknown>({
      baseUrl: 'http://localhost:3333',
    });
  });
  
  it('should return an empty list of articles initially', async () => {
    const response = await apiClient.api.articlesList();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
  
  it('should create a new article', async () => {
    const newArticle = {
      title: 'API Test Article',
      content: 'This article was created during an API test.',
      author: 'API Tester',
      tags: ['api', 'test']
    };
    
    const response = await apiClient.api.articlesCreate(newArticle);
    expect(response.status).toBe(201);
    expect(response.data.title).toBe(newArticle.title);
    expect(response.data.content).toBe(newArticle.content);
    expect(response.data.author).toBe(newArticle.author);
    expect(response.data.tags).toEqual(newArticle.tags);
    
    // Store the ID for future tests
    createdArticleId = response.data.id;
  });
  
  it('should retrieve a specific article by ID', async () => {
    const response = await apiClient.api.articlesDetail(createdArticleId);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdArticleId);
    expect(response.data.title).toBe('API Test Article');
  });
  
  it('should update an existing article', async () => {
    const updateData = {
      title: 'Updated API Test Article',
      content: 'This article was updated during an API test.'
    };
    
    const response = await apiClient.api.articlesUpdate(createdArticleId, updateData);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdArticleId);
    expect(response.data.title).toBe(updateData.title);
    expect(response.data.content).toBe(updateData.content);
    // Fields not included in the update should remain unchanged
    expect(response.data.author).toBe('API Tester');
  });
  
  it('should delete an article', async () => {
    const response = await apiClient.api.articlesDelete(createdArticleId);
    expect(response.status).toBe(204);
    
    // Verify the article was deleted
    try {
      await apiClient.api.articlesDetail(createdArticleId);
      // If we get here, the test should fail
      fail('Expected article to be deleted but it was still found');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
  
  it('should handle requests for non-existent articles', async () => {
    try {
      await apiClient.api.articlesDetail('non-existent-id');
      // If we get here, the test should fail
      fail('Expected 404 error for non-existent article');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe('Article not found');
    }
  });
});