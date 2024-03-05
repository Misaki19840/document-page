const lunr = require('lunr');
const fs = require('fs');
const path = require('path');
const asciidoctor = require('asciidoctor')(); // Only necessary if you're indexing AsciiDoc directly

function indexDocs() {
  const documents = [];
  const files = fs.readdirSync('../docs/modules/ROOT/pages');

  files.forEach(file => {
    const filePath = path.join('../docs/modules/ROOT/pages', file);
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = asciidoctor.load(content); // Convert AsciiDoc to HTML if necessary
    const html = doc.convert(); // Get the HTML content

    // Here you would extract the text content from the HTML
    // You can use a library like JSDOM or Cheerio to help with this

    documents.push({
      'id': file,
      'title': doc.getDocumentTitle(),
      'text': html, // You would put the text content here, not the HTML
    });
  });

  const idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('text');

    documents.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  fs.writeFileSync('../ui/search-index.json', JSON.stringify(idx));
}

indexDocs();
