// packages/frontend/src/types/custom-elements.d.ts

declare namespace JSX {
    interface IntrinsicElements {
      'article-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'article-id'?: string;
        title?: string;
        content?: string;
        author?: string;
        'created-at'?: string;
        tags?: string;
        ref?: React.RefObject<HTMLElement>;
      };
    }
  }
  
  interface HTMLElementTagNameMap {
    'article-preview': HTMLElement;
  }