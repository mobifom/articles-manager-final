// packages/frontend/src/tests/mocks/apiServiceMock.ts
// This file can be imported in test files where API service mocking is needed

import { Article, CreateArticleDto, UpdateArticleDto } from '../../types/article';

export const setupApiServiceMock = () => {
  jest.mock('../../services/api.service', () => {
    const mockArticle = {
      id: '1',
      title: 'Test Article',
      content: 'This is a test article content',
      author: 'Test Author',
      tags: ['test', 'mock'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create a collection of mock articles for testing
    const mockArticles = [
      mockArticle,
      {
        id: '2',
        title: 'Another Article',
        content: 'Content of another article',
        author: 'Another Author',
        tags: ['sample'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Internal store for simulating persistence during tests
    let articles = [...mockArticles];
    
    return {
      apiService: {
        getArticles: jest.fn().mockImplementation(() => {
          return Promise.resolve([...articles]);
        }),
        
        getArticleById: jest.fn().mockImplementation((id: string) => {
          const article = articles.find(a => a.id === id);
          if (!article) {
            return Promise.reject({
              response: {
                status: 404,
                data: { message: 'Article not found' }
              }
            });
          }
          return Promise.resolve({...article});
        }),
        
        createArticle: jest.fn().mockImplementation((articleData: CreateArticleDto) => {
          const newArticle: Article = {
            id: String(articles.length + 1),
            ...articleData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          articles.push(newArticle);
          return Promise.resolve({...newArticle});
        }),
        
        updateArticle: jest.fn().mockImplementation((id: string, updateData: UpdateArticleDto) => {
          const index = articles.findIndex(a => a.id === id);
          if (index === -1) {
            return Promise.reject({
              response: {
                status: 404,
                data: { message: 'Article not found' }
              }
            });
          }
          
          const updatedArticle = {
            ...articles[index],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          
          articles[index] = updatedArticle;
          return Promise.resolve({...updatedArticle});
        }),
        
        deleteArticle: jest.fn().mockImplementation((id: string) => {
          const index = articles.findIndex(a => a.id === id);
          if (index === -1) {
            return Promise.reject({
              response: {
                status: 404,
                data: { message: 'Article not found' }
              }
            });
          }
          
          articles.splice(index, 1);
          return Promise.resolve();
        })
      }
    };
  });
};

// Example usage in a test file:
// 
// // Import the mock setup function
// import { setupApiServiceMock } from '../mocks/apiServiceMock';
// 
// // Call it before your tests
// setupApiServiceMock();
// 
// // Import the mocked API service
// import { apiService } from '../../services/api.service';
// 
// describe('Articles Component', () => {
//   it('should display articles', async () => {
//     // The apiService is now mocked
//     const articles = await apiService.getArticles();
//     expect(articles.length).toBeGreaterThan(0);
//   });
// });