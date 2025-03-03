// packages/frontend/src/components/web-components/article-preview.test.ts
/**
 * @jest-environment jsdom
 */

// Use separate test setup for this component test
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'util';

// Assign stream polyfills before importing anything else
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream; 
global.WritableStream = WritableStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Now import the web component to ensure it's registered
import './article-preview';

describe('ArticlePreview Web Component', () => {
  beforeEach(() => {
    // Create a new instance of the component for each test
    document.body.innerHTML = '';
    const element = document.createElement('article-preview');
    document.body.appendChild(element);
  });

  it('should be defined as a custom element', () => {
    expect(customElements.get('article-preview')).toBeDefined();
  });

  it('should render with default values when no attributes are set', () => {
    const element = document.querySelector('article-preview');
    const shadow = element?.shadowRoot;
    
    // Check that shadow DOM was created
    expect(shadow).toBeDefined();
    
    // Check that basic elements exist
    expect(shadow?.querySelector('.article-card')).toBeTruthy();
    expect(shadow?.querySelector('.title')).toBeTruthy();
    
    // Check default content
    const title = shadow?.querySelector('.title');
    expect(title?.textContent).toContain('No Title');
  });

  it('should reflect attribute changes', () => {
    const element = document.querySelector('article-preview');
    if (!element) throw new Error('Element not found');
    
    // Set attributes
    element.setAttribute('title', 'Test Title');
    element.setAttribute('author', 'Test Author');
    
    // Get shadow DOM elements
    const shadow = element.shadowRoot;
    const titleEl = shadow?.querySelector('.title');
    const authorEl = shadow?.querySelector('.meta');
    
    // Check content
    expect(titleEl?.textContent).toContain('Test Title');
    expect(authorEl?.textContent).toContain('Test Author');
  });

  // Add more tests as needed
});