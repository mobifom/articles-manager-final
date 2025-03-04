import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Article, CreateArticleDto, UpdateArticleDto } from '../interfaces/article.interface';

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API endpoints for managing articles
 */

const router = Router();

// In-memory storage for articles
const articles: Article[] = [];

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Retrieve all articles
 *     tags: [Articles]
 *     description: Returns a list of all articles in the system
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get('/', (req, res) => {
  return res.json(articles);
});

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Articles]
 *     description: Returns a single article by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article not found
 */
router.get('/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }
  return res.json(article);
});

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     description: Creates a new article and returns the created article data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticleDto'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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
  return res.status(201).json(newArticle);
});

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an existing article
 *     tags: [Articles]
 *     description: Updates an article by ID and returns the updated article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArticleDto'
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article not found
 */
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
  return res.json(updatedArticle);
});

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     description: Deletes an article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The article ID
 *     responses:
 *       204:
 *         description: Article deleted successfully (no content)
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article not found
 */
router.delete('/:id', (req, res) => {
  const articleIndex = articles.findIndex(a => a.id === req.params.id);
  if (articleIndex === -1) {
    return res.status(404).json({ message: 'Article not found' });
  }
  
  articles.splice(articleIndex, 1);
  return res.status(204).send();
});

export default router;