import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  rest.get('/api/articles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Article',
          content: 'Content of test article',
          author: 'Test Author',
          tags: ['test'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    );
  }),
  
  rest.post('/api/articles', (req, res, ctx) => {
    const { title, content, author, tags } = req.body as any;
    
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        title,
        content,
        author,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    );
  })
];