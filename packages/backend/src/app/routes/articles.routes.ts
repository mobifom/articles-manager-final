import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Article, CreateArticleDto, UpdateArticleDto } from '../interfaces/article.interface';

const router = Router();

// In-memory storage for articles
let articles: Article[] = [];

// GET all articles
router.get('/', (req, res) => {
  res.json(articles);
});

// GET article by ID
router.get('/:id', (req, res) => {
    const article = articles.find(a => a.id === req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    return res.json(article); // Add explicit return
  });

// POST create new article
router.post('/', (req, res) => {
  const articleData: CreateArticleDto = req.body;
  const now = new Date();
  
  const newArticle: Article = {
    id: uuidv4(),
    ...articleData,
    createdAt: now,
    updatedAt: now
  };
  
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// PUT update article
router.put('/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id === req.params.id);
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    const updateData: UpdateArticleDto = req.body;
    const updatedArticle: Article = {
      ...articles[articleIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    articles[articleIndex] = updatedArticle;
    return res.json(updatedArticle); // Add explicit return
  });

// DELETE article
router.delete('/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id === req.params.id);
    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    articles.splice(articleIndex, 1);
    return res.status(204).send(); // Add explicit return
  });

export default router;