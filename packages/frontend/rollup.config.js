// packages/frontend/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import path from 'path';

// Define production environment
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.tsx',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !production,
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      'ui-components': ['./src/components/ui'],
    },
    entryFileNames: production ? 'js/[name].[hash].js' : 'js/[name].js',
    chunkFileNames: production ? 'js/[name].[hash].js' : 'js/[name].js',
    assetFileNames: production ? 'assets/[name].[hash][extname]' : 'assets/[name][extname]',
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
    
    // Process CSS
    postcss({
      extract: path.resolve('dist/styles/main.css'),
      minimize: production,
      config: {
        path: './postcss.config.js'
      }
    }),
    
    // Minify in production
    production && terser()
  ],
  // Indicate external dependencies (not bundled)
  external: [],
  // Watch options
  watch: {
    clearScreen: false
  }
};