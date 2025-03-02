export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateArticleDto {
    title: string;
    content: string;
    author: string;
    tags?: string[];
  }
  
  export interface UpdateArticleDto {
    title?: string;
    content?: string;
    author?: string;
    tags?: string[];
  }