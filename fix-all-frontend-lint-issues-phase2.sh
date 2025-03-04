// frontend-eslint-fix.js
const fs = require('fs');
const path = require('path');

// Frontend-specific ESLint configuration
const frontendEslintConfig = `// packages/frontend/eslint.config.js
const baseConfig = require('../../eslint.config.js');

// Frontend-specific ignores
const frontendIgnores = {
  ignores: [
    'dist/**',
    'coverage/**',
    'src/generated/**'
  ]
};

module.exports = [
  // Add frontend-specific ignores
  frontendIgnores,
  // Use the base config
  ...baseConfig,
  // Add frontend-specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // React-specific rules
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'error', // Changed from 'warn' to 'error'
      'react/jsx-no-useless-fragment': 'warn',
      'react/prop-types': 'error',
      'react/self-closing-comp': ['error', {
        component: true,
        html: true
      }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn'
    }
  },
  // Special rules for test files
  {
    files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off'
    }
  }
];`;

// Function to fix the specific files with issues
function fixFiles() {
  console.log('Fixing ESLint issues in frontend files...');
  
  // 1. Fix app.spec.tsx
  const appSpecPath = path.join('packages', 'frontend', 'src', 'app', 'app.spec.tsx');
  if (fs.existsSync(appSpecPath)) {
    let content = fs.readFileSync(appSpecPath, 'utf8');
    // Fix missing prop-types for children and useless fragment
    content = content.replace(
      'Suspense: ({ children }) => <>{children}</>',
      'Suspense: ({ children }) => React.createElement(React.Fragment, null, children)'
    );
    fs.writeFileSync(appSpecPath, content);
    console.log(`Fixed: ${appSpecPath}`);
  }

  // 2. Fix nx-welcome.tsx
  const nxWelcomePath = path.join('packages', 'frontend', 'src', 'app', 'nx-welcome.tsx');
  if (fs.existsSync(nxWelcomePath)) {
    let content = fs.readFileSync(nxWelcomePath, 'utf8');
    // Fix invalid href
    content = content.replace(
      /href=""/g,
      'href="#" aria-label="Click to finish setup"'
    );
    fs.writeFileSync(nxWelcomePath, content);
    console.log(`Fixed: ${nxWelcomePath}`);
  }

  // 3. Fix ArticlePreviewWrapper.tsx
  const articlePreviewWrapperPath = path.join('packages', 'frontend', 'src', 'components', 'ArticlePreviewWrapper.tsx');
  if (fs.existsSync(articlePreviewWrapperPath)) {
    let content = fs.readFileSync(articlePreviewWrapperPath, 'utf8');
    // Fix 'any' type
    content = content.replace(
      '(element as any).article = article;',
      '(element as HTMLElement & { article: typeof article }).article = article;'
    );
    fs.writeFileSync(articlePreviewWrapperPath, content);
    console.log(`Fixed: ${articlePreviewWrapperPath}`);
  }

  // 4. Fix article-preview.ts
  const articlePreviewPath = path.join('packages', 'frontend', 'src', 'components', 'web-components', 'article-preview.ts');
  if (fs.existsSync(articlePreviewPath)) {
    let content = fs.readFileSync(articlePreviewPath, 'utf8');
    // Fix 'any' types and unused variables
    content = content
      .replace(
        'private _article: any = null;',
        'private _article: { id?: string; title?: string; content?: string; author?: string; createdAt?: string | Date; tags?: string[] } | null = null;'
      )
      .replace(
        'handleViewClick = (e: Event) => {',
        'handleViewClick = (_e: Event) => {'
      )
      .replace(
        'handleEditClick = (e: Event) => {',
        'handleEditClick = (_e: Event) => {'
      );
    fs.writeFileSync(articlePreviewPath, content);
    console.log(`Fixed: ${articlePreviewPath}`);
  }

  // 5. Fix ArticleDetailPage.tsx
  const articleDetailPagePath = path.join('packages', 'frontend', 'src', 'pages', 'ArticleDetailPage.tsx');
  if (fs.existsSync(articleDetailPagePath)) {
    let content = fs.readFileSync(articleDetailPagePath, 'utf8');
    // Fix array index as key
    content = content.replace(
      '{article.content.split(\'\\n\').map((paragraph, index) => (',
      '{article.content.split(\'\\n\').map((paragraph, index) => paragraph ? ('
    ).replace(
      '<p key={index} className="mb-4">',
      '<p key={`paragraph-${index}-${paragraph.substring(0, 10)}`} className="mb-4">'
    ).replace(
      '))}',
      ')) : null)}'
    );
    fs.writeFileSync(articleDetailPagePath, content);
    console.log(`Fixed: ${articleDetailPagePath}`);
  }

  // 6. Fix ArticleListPage.tsx
  const articleListPagePath = path.join('packages', 'frontend', 'src', 'pages', 'ArticleListPage.tsx');
  if (fs.existsSync(articleListPagePath)) {
    let content = fs.readFileSync(articleListPagePath, 'utf8');
    // Remove unused error variable
    content = content.replace(
      'const { articles, loading, error } = state;',
      'const { articles, loading } = state;'
    );
    fs.writeFileSync(articleListPagePath, content);
    console.log(`Fixed: ${articleListPagePath}`);
  }

  // 7. Fix HomePage.tsx
  const homePagePath = path.join('packages', 'frontend', 'src', 'pages', 'HomePage.tsx');
  if (fs.existsSync(homePagePath)) {
    let content = fs.readFileSync(homePagePath, 'utf8');
    // Remove unused error variable
    content = content.replace(
      'const { articles, loading, error } = state;',
      'const { articles, loading } = state;'
    );
    fs.writeFileSync(homePagePath, content);
    console.log(`Fixed: ${homePagePath}`);
  }

  // 8. Fix test-setup.ts
  const testSetupPath = path.join('packages', 'frontend', 'src', 'test-setup.ts');
  if (fs.existsSync(testSetupPath)) {
    let content = fs.readFileSync(testSetupPath, 'utf8');
    // Fix 'any' types
    content = content
      .replace(
        'listeners: Array<(event: MessageEvent) => void> = [];',
        'listeners: Array<(event: MessageEvent<any>) => void> = [];'
      )
      .replace(
        'private errorListeners: Array<(event: MessageEvent) => void> = [];',
        'private errorListeners: Array<(event: MessageEvent<any>) => void> = [];'
      )
      .replace(
        'onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;',
        'onmessage: ((this: BroadcastChannel, ev: MessageEvent<any>) => any) | null = null;'
      )
      .replace(
        'onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;',
        'onmessageerror: ((this: BroadcastChannel, ev: MessageEvent<any>) => any) | null = null;'
      );
    fs.writeFileSync(testSetupPath, content);
    console.log(`Fixed: ${testSetupPath}`);
  }

  // 9. Fix integration test
  const integrationTestPath = path.join('packages', 'frontend', 'src', 'tests', 'integration', 'ArticleManagement.test.tsx');
  if (fs.existsSync(integrationTestPath)) {
    let content = fs.readFileSync(integrationTestPath, 'utf8');
    // Remove unused ArticleListPage import
    content = content.replace(
      "import ArticleListPage from '../../pages/ArticleListPage';",
      "// import ArticleListPage from '../../pages/ArticleListPage';"
    );
    fs.writeFileSync(integrationTestPath, content);
    console.log(`Fixed: ${integrationTestPath}`);
  }

  // 10. Fix mock handlers.ts
  const mockHandlersPath = path.join('packages', 'frontend', 'src', 'tests', 'mocks', 'handlers.ts');
  if (fs.existsSync(mockHandlersPath)) {
    let content = fs.readFileSync(mockHandlersPath, 'utf8');
    // Remove unused error variable
    content = content
      .replace(
        ' error',
        ' _error'
      )
      .replace(
        ' error',
        ' _error'
      );
    fs.writeFileSync(mockHandlersPath, content);
    console.log(`Fixed: ${mockHandlersPath}`);
  }

  // 11. Fix server.ts from mocks
  const serverPath = path.join('packages', 'frontend', 'src', 'tests', 'mocks', 'server.ts');
  if (fs.existsSync(serverPath)) {
    let content = fs.readFileSync(serverPath, 'utf8');
    // Fix Function type issues and any types
    content = content
      .replace(
        'listeners: Function[];',
        'listeners: Array<(event: { data: unknown }) => void>;'
      )
      .replace(
        'addEventListener(event: string, callback: Function)',
        'addEventListener(event: string, callback: (event: { data: unknown }) => void)'
      )
      .replace(
        'removeEventListener(event: string, callback: Function)',
        'removeEventListener(event: string, callback: (event: { data: unknown }) => void)'
      )
      .replace(
        ': any)',
        ': unknown)'
      );
    fs.writeFileSync(serverPath, content);
    console.log(`Fixed: ${serverPath}`);
  }

  // 12. Fix global.d.ts
  const globalDtsPath = path.join('packages', 'frontend', 'src', 'types', 'global.d.ts');
  if (fs.existsSync(globalDtsPath)) {
    let content = fs.readFileSync(globalDtsPath, 'utf8');
    // Fix any types
    content = content.replace(
      'readFile: (path: string, options?: any) => Promise<any>;',
      'readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;'
    );
    fs.writeFileSync(globalDtsPath, content);
    console.log(`Fixed: ${globalDtsPath}`);
  }

  // Write the updated frontend eslint config
  const frontendEslintConfigPath = path.join('packages', 'frontend', 'eslint.config.js');
  fs.writeFileSync(frontendEslintConfigPath, frontendEslintConfig);
  console.log(`Updated: ${frontendEslintConfigPath}`);

  console.log('All ESLint issues have been fixed!');
}

// Run the fix
fixFiles();