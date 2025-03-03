// packages/backend/src/tests/api/articles.spec.ts
import { Api } from '../../generated/api-client/ApiClient';
import axios from 'axios';

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
    try {
      const response = await apiClient.api.articlesList();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
  
  it('should create a new article', async () => {
    const newArticle = {
      title: 'API Test Article',
      content: 'This article was created during an API test.',
      author: 'API Tester',
      tags: ['api', 'test']
    };
    
    try {
      const response = await apiClient.api.articlesCreate(newArticle);
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(newArticle.title);
      expect(response.data.content).toBe(newArticle.content);
      expect(response.data.author).toBe(newArticle.author);
      expect(response.data.tags).toEqual(newArticle.tags);
      
      // Store the ID for future tests
      createdArticleId = response.data.id;
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
  
  it('should retrieve a specific article by ID', async () => {
    try {
      const response = await apiClient.api.articlesDetail(createdArticleId);
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdArticleId);
      expect(response.data.title).toBe('API Test Article');
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
  
  it('should update an existing article', async () => {
    const updateData = {
      title: 'Updated API Test Article',
      content: 'This article was updated during an API test.'
    };
    
    try {
      const response = await apiClient.api.articlesUpdate(createdArticleId, updateData);
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(createdArticleId);
      expect(response.data.title).toBe(updateData.title);
      expect(response.data.content).toBe(updateData.content);
      // Fields not included in the update should remain unchanged
      expect(response.data.author).toBe('API Tester');
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
  
  it('should delete an article', async () => {
    try {
      const response = await apiClient.api.articlesDelete(createdArticleId);
      expect(response.status).toBe(204);
      
      // Verify the article was deleted
      try {
        await axios.get(`http://localhost:3333/api/articles/${createdArticleId}`);
        fail('Expected article to be deleted but it was still found');
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
        } else {
          fail('Expected an Axios error');
        }
      }
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
  
  it('should handle requests for non-existent articles', async () => {
    try {
      await axios.get('http://localhost:3333/api/articles/non-existent-id');
      fail('Expected 404 error for non-existent article');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        expect(error.response?.status).toBe(404);
        expect(error.response?.data.message).toBe('Article not found');
      } else {
        fail('Expected an Axios error');
      }
    }
  });
});