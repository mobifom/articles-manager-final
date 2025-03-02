// packages/frontend/src/services/api.service.ts
import { Article, CreateArticleDto, UpdateArticleDto } from '../types/article';

const API_URL = '/api/articles';

export const apiService = {
  // Get all articles
  async getArticles(): Promise<Article[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Get article by ID
  async getArticleById(id: string): Promise<Article> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error);
      throw error;
    }
  },

  // Create a new article
  async createArticle(article: CreateArticleDto): Promise<Article> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Update an article
  async updateArticle(id: string, article: UpdateArticleDto): Promise<Article> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating article ${id}:`, error);
      throw error;
    }
  },

  // Delete an article
  async deleteArticle(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting article ${id}:`, error);
      throw error;
    }
  },
};