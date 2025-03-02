// packages/frontend/scripts/extract-critical.js
const critical = require('critical');
const fs = require('fs');
const path = require('path');

// Define paths
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

async function extractCriticalCSS() {
  console.log('Extracting critical CSS...');
  
  try {
    // Generate critical CSS
    const result = await critical.generate({
      base: distDir,
      src: 'index.html',
      target: {
        html: 'index-critical.html',
        css: 'styles/critical.css',
      },
      inline: {
        removeStyleTags: false
      },
      dimensions: [
        {
          width: 320,
          height: 568
        },
        {
          width: 768,
          height: 1024
        },
        {
          width: 1920,
          height: 1080
        }
      ],
      extract: true,
      penthouse: {
        timeout: 30000,
        renderWaitTime: 100,
      }
    });

    // Read generated critical HTML
    const criticalHtml = fs.readFileSync(
      path.join(distDir, 'index-critical.html'),
      'utf8'
    );

    // Update the original index.html with the critical CSS inlined
    fs.writeFileSync(indexPath, criticalHtml);
    console.log('Critical CSS extracted and inlined successfully!');
    
  } catch (err) {
    console.error('Critical CSS extraction failed:', err);
    process.exit(1);
  }
}

extractCriticalCSS();