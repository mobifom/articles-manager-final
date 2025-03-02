// packages/frontend/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import html from '@rollup/plugin-html';
import path from 'path';
import fs from 'fs';

// Define production environment
const production = !process.env.ROLLUP_WATCH;

// HTML template function
function htmlTemplate({ attributes, files, meta, publicPath, title }) {
  // Get the CSS and JS files
  const cssFiles = files.css || [];
  const jsFiles = files.js || [];
  
  // Generate preload links for JS chunks
  const preloadJs = jsFiles
    .filter(file => file.fileName.includes('vendor') || file.fileName.includes('main'))
    .map(file => `<link rel="preload" href="${publicPath}${file.fileName}" as="script" />`);
  
  // Generate preload links for CSS
  const preloadCss = cssFiles
    .map(file => `<link rel="preload" href="${publicPath}${file.fileName}" as="style" />`);
  
  // CSS links (with media="print" and onload for non-critical CSS)
  const cssLinks = cssFiles
    .map(file => {
      if (file.fileName.includes('critical')) {
        return `<link rel="stylesheet" href="${publicPath}${file.fileName}" />`;
      } else {
        return `
          <link rel="stylesheet" href="${publicPath}${file.fileName}" media="print" onload="this.media='all'" />
          <noscript><link rel="stylesheet" href="${publicPath}${file.fileName}" /></noscript>
        `;
      }
    });
  
  // JS scripts (using type="module" for ES modules)
  const jsScripts = jsFiles
    .map(file => {
      if (file.fileName.includes('vendor')) {
        return `<script type="module" src="${publicPath}${file.fileName}" defer></script>`;
      } else {
        return `<script type="module" src="${publicPath}${file.fileName}"></script>`;
      }
    });

  // Build HTML template
  return `
<!DOCTYPE html>
<html ${attributes.html}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A modern application for managing articles" />
  <title>${title || 'Articles-Manager'}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  
  ${preloadJs.join('\n  ')}
  ${preloadCss.join('\n  ')}
  
  ${cssLinks.join('\n  ')}
</head>
<body>
  <div id="root"></div>
  
  ${jsScripts.join('\n  ')}
  
  <!-- Preload strategy for remaining chunks -->
  <script type="module">
    // Preload remaining chunks when idle
    if ('requestIdleCallback' in window) {
      const preloadChunks = () => {
        [
          // Add paths to additional chunks here that should be preloaded later
        ].forEach(src => {
          const link = document.createElement('link');
          link.rel = 'modulepreload';
          link.href = src;
          document.head.appendChild(link);
        });
      };
      window.requestIdleCallback(preloadChunks);
    }
  </script>
</body>
</html>
  `.trim();
}

export default {
  input: 'src/main.tsx',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !production,
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],
      'router-vendor': ['react-router-dom'],
      'components': ['./src/components/Navbar', './src/components/Footer'],
      'ui-components': ['./src/components/ArticleCard']
    },
    entryFileNames: production ? 'js/[name].[hash].js' : 'js/[name].js',
    chunkFileNames: production ? 'js/[name].[hash].js' : 'js/[name].js',
    assetFileNames: info => {
      const extType = info.name.split('.').pop();
      if (/\.(css)$/.test(info.name)) {
        return production 
          ? `styles/[name].[hash][extname]` 
          : `styles/[name][extname]`;
      }
      return production 
        ? `assets/[name].[hash][extname]` 
        : `assets/[name][extname]`;
    },
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
    }),
    
    // Resolve node modules
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Compile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: !production,
      inlineSources: !production
    }),
    
    // Process CSS with critical path extraction
    postcss({
      extract: path.resolve('dist/styles/main.css'),
      minimize: production,
      sourceMap: !production,
      config: {
        path: './postcss.config.js'
      },
      plugins: [
        // Add plugin for critical CSS splitting
        production && require('postcss-critical-split')({
          output: 'critical',
          startTag: '/* critical:start */',
          endTag: '/* critical:end */',
          blockTag: '/* critical:block */'
        })
      ].filter(Boolean)
    }),
    
    // Generate HTML with proper resource loading strategy
    html({
      title: 'Articles-Manager',
      publicPath: '/',
      template: htmlTemplate
    }),
    
    // Minify in production
    production && terser()
  ],
  // Watch options
  watch: {
    clearScreen: false
  }
};