const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Simple HTML to PDF converter using wkhtmltopdf or system tools
const templates = [
  'letterhead-fillable.html',
  'invoice-fillable.html',
  'receipt-fillable.html',
];

// Check if wkhtmltopdf is available
exec('which wkhtmltopdf', (error) => {
  if (error) {
    console.log('wkhtmltopdf not found. Trying with chromium/chrome...');
    tryChrome();
  } else {
    convertWithWkhtmltopdf();
  }
});

function convertWithWkhtmltopdf() {
  templates.forEach((template) => {
    const inputPath = path.join(__dirname, template);
    const outputPath = path.join(__dirname, template.replace('.html', '.pdf'));

    const cmd = `wkhtmltopdf --enable-local-file-access "${inputPath}" "${outputPath}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error converting ${template}:`, error);
      } else {
        console.log(`✓ Generated ${template.replace('.html', '.pdf')}`);
      }
    });
  });
}

function tryChrome() {
  // Try to use chrome/chromium headless
  exec(
    'which google-chrome || which chromium-browser || which chromium',
    (error, stdout) => {
      if (error) {
        console.error(
          'No PDF converter found. Please install wkhtmltopdf or chrome/chromium',
        );
        console.log('\nInstall options:');
        console.log('  Ubuntu/Debian: sudo apt-get install wkhtmltopdf');
        console.log(
          '  Or install chromium: sudo apt-get install chromium-browser',
        );
        return;
      }

      const chromePath = stdout.trim();
      templates.forEach((template) => {
        const inputPath = path.join(__dirname, template);
        const outputPath = path.join(
          __dirname,
          template.replace('.html', '.pdf'),
        );

        const cmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPath}" "file://${inputPath}"`;
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error converting ${template}:`, error);
          } else {
            console.log(`✓ Generated ${template.replace('.html', '.pdf')}`);
          }
        });
      });
    },
  );
}
