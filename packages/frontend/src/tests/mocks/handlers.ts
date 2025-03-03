// packages/frontend/src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/articles', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Article',
        content: 'Content of test article',
        author: 'Test Author',
        tags: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }),
  
  http.post('/api/articles', async ({ request }) => {
    const { title, content, author, tags } = await request.json();
    
    return HttpResponse.json({
      id: '2',
      title,
      content,
      author,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 201 });
  }),
  
  http.get('/api/articles/:id', ({ params }) => {
    const { id } = params;
    
    if (id === '1') {
      return HttpResponse.json({
        id: '1',
        title: 'Test Article',
        content: 'Content of test article',
        author: 'Test Author',
        tags: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return HttpResponse.json(
      { message: 'Article not found' },
      { status: 404 }
    );
  }),
  
  http.put('/api/articles/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    
    return HttpResponse.json({
      id,
      ...updates,
      author: 'Test Author', // Keep original author if not in updates
      tags: updates.tags || ['test'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }),
  
  http.delete('/api/articles/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
  
  http.get('/api/status', () => {
    return HttpResponse.json({
      status: 'ok',
      environment: 'test',
      timestamp: new Date().toISOString()
    });
  })
];