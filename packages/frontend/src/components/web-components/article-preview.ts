// packages/frontend/src/components/web-components/article-preview.ts

class ArticlePreview extends HTMLElement {
    private _article: any = null;
    private _shadow: ShadowRoot;
  
    // Define observed attributes
    static get observedAttributes() {
      return ['title', 'content', 'author', 'created-at', 'tags', 'article-id'];
    }
  
    constructor() {
      super();
      // Create shadow DOM for encapsulation
      this._shadow = this.attachShadow({ mode: 'open' });
    }
  
    // Lifecycle: component connected to DOM
    connectedCallback() {
      this.render();
      this.attachEventListeners();
    }
  
    // Lifecycle: component disconnected from DOM
    disconnectedCallback() {
      this.removeEventListeners();
    }
  
    // Lifecycle: observed attributes changed
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    // Set article data as a property
    set article(value: any) {
      this._article = value;
      this.render();
    }
  
    // Handle view button click
    private handleViewClick = (e: Event) => {
      e.preventDefault();
      const articleId = this.getAttribute('article-id') || this._article?.id;
      if (articleId) {
        this.dispatchEvent(new CustomEvent('article-view', {
          bubbles: true,
          composed: true,
          detail: { id: articleId }
        }));
      }
    };
  
    // Handle edit button click
    private handleEditClick = (e: Event) => {
      e.preventDefault();
      const articleId = this.getAttribute('article-id') || this._article?.id;
      if (articleId) {
        this.dispatchEvent(new CustomEvent('article-edit', {
          bubbles: true,
          composed: true,
          detail: { id: articleId }
        }));
      }
    };
  
    // Handle delete button click
    private handleDeleteClick = (e: Event) => {
      e.preventDefault();
      const articleId = this.getAttribute('article-id') || this._article?.id;
      if (articleId) {
        this.dispatchEvent(new CustomEvent('article-delete', {
          bubbles: true,
          composed: true,
          detail: { id: articleId }
        }));
      }
    };
  
    // Attach event listeners to buttons
    private attachEventListeners() {
      const viewBtn = this._shadow.querySelector('.view-btn');
      const editBtn = this._shadow.querySelector('.edit-btn');
      const deleteBtn = this._shadow.querySelector('.delete-btn');
  
      if (viewBtn) viewBtn.addEventListener('click', this.handleViewClick);
      if (editBtn) editBtn.addEventListener('click', this.handleEditClick);
      if (deleteBtn) deleteBtn.addEventListener('click', this.handleDeleteClick);
    }
  
    // Remove event listeners
    private removeEventListeners() {
      const viewBtn = this._shadow.querySelector('.view-btn');
      const editBtn = this._shadow.querySelector('.edit-btn');
      const deleteBtn = this._shadow.querySelector('.delete-btn');
  
      if (viewBtn) viewBtn.removeEventListener('click', this.handleViewClick);
      if (editBtn) editBtn.removeEventListener('click', this.handleEditClick);
      if (deleteBtn) deleteBtn.removeEventListener('click', this.handleDeleteClick);
    }
  
    // Format date for display
    private formatDate(dateString: string): string {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
  
    // Parse tags from string or use article tags
    private getTags(): string[] {
      const tagsAttr = this.getAttribute('tags');
      
      if (tagsAttr) {
        try {
          return JSON.parse(tagsAttr);
        } catch (e) {
          return tagsAttr.split(',').map(tag => tag.trim());
        }
      }
      
      return this._article?.tags || [];
    }
  
    // Truncate text to specified length
    private truncateText(text: string, maxLength = 150): string {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    }
  
    // Create tag elements
    private createTagsHTML(tags: string[]): string {
      if (!tags.length) return '';
      
      return `
        <div class="tags">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
    }
  
    // Render the component
    private render() {
      const title = this.getAttribute('title') || this._article?.title || 'No Title';
      const content = this.getAttribute('content') || this._article?.content || 'No content available';
      const author = this.getAttribute('author') || this._article?.author || 'Unknown Author';
      const createdAt = this.getAttribute('created-at') || this._article?.createdAt || new Date().toISOString();
      const tags = this.getTags();
      const articleId = this.getAttribute('article-id') || this._article?.id;
      
      // Define component styles
      const styles = `
        :host {
          display: block;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --primary-color: #009bbd;
          --primary-dark: #007c97;
          --primary-light: #ccebf2;
          --gray-dark: #333;
          --gray-medium: #666;
          --gray-light: #eee;
        }
        .article-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        .article-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card-body {
          padding: 1.5rem;
        }
        .title {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        .meta {
          display: flex;
          font-size: 0.875rem;
          color: var(--gray-medium);
          margin-bottom: 1rem;
        }
        .content {
          color: var(--gray-dark);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .tag {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .btn {
          cursor: pointer;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.25rem;
          border: none;
          font-weight: 500;
        }
        .view-btn {
          background-color: #f3f4f6;
          color: var(--gray-dark);
          border: 1px solid #d1d5db;
        }
        .edit-btn {
          background-color: var(--primary-color);
          color: white;
        }
        .delete-btn {
          background-color: #ef4444;
          color: white;
        }
        .btn:hover {
          opacity: 0.9;
        }
        @media (prefers-color-scheme: dark) {
          .article-card {
            background-color: #1f2937;
          }
          .title {
            color: #93c5fd;
          }
          .content {
            color: #e5e7eb;
          }
          .meta {
            color: #9ca3af;
          }
          .view-btn {
            background-color: #374151;
            color: #e5e7eb;
            border-color: #4b5563;
          }
        }
      `;
  
      // Create HTML content
      const html = `
        <div class="article-card">
          <div class="card-body">
            <h3 class="title">${title}</h3>
            <div class="meta">
              <span>By ${author}</span>
              <span style="margin: 0 0.5rem;">•</span>
              <span>${this.formatDate(createdAt)}</span>
            </div>
            <p class="content">${this.truncateText(content)}</p>
            ${this.createTagsHTML(tags)}
            <div class="actions">
              <button class="btn view-btn">View</button>
              <button class="btn edit-btn">Edit</button>
              <button class="btn delete-btn">Delete</button>
            </div>
          </div>
        </div>
      `;
  
      // Update shadow DOM
      this._shadow.innerHTML = '';
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      this._shadow.appendChild(styleElement);
      
      const template = document.createElement('template');
      template.innerHTML = html;
      this._shadow.appendChild(template.content.cloneNode(true));
      
      // Re-attach event listeners after updating content
      this.attachEventListeners();
    }
  }
  
  // Register the custom element
  customElements.define('article-preview', ArticlePreview);
  
  export default ArticlePreview;