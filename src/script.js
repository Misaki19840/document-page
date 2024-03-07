const lunr = require('lunr');
const fs = require('fs');
const path = require('path');
const asciidoctor = require('asciidoctor')();

function indexDocs() {
  const documents = [];
  // Correct the path to be relative from the root of your repository
  const pagesPath = './docs/modules/ROOT/pages';
  const files = fs.readdirSync(pagesPath);

  files.forEach(file => {
    // Make sure to only process .adoc files
    if (path.extname(file) === '.adoc') {
      const filePath = path.join(pagesPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const doc = asciidoctor.load(content); // Convert AsciiDoc to HTML
      const html = doc.convert(); // Get the HTML content

      // Extract text content from the HTML
      // Use a library like JSDOM or Cheerio to help with this if necessary

      documents.push({
        'id': file,
        'title': doc.getDocumentTitle(),
        'text': html, // Extract the text content, not the HTML
      });
    }
  });

  const idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('text');

    documents.forEach(doc => this.add(doc));
  });

  // Correct the output path to be relative from the root of your repository
  fs.writeFileSync('./ui/search-index.json', JSON.stringify(idx));
}

indexDocs();
