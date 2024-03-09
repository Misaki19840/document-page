document.addEventListener('DOMContentLoaded', function() {
    // Create a Lunr index for performing the search
    var lunrIndex, pagesIndex;
  
    // Download the search index
    function loadIndex() {
      return fetch('./ui/search-index.json')
        .then(response => response.json())
        .then(function(rawIndex) {
          pagesIndex = rawIndex;
          lunrIndex = lunr(function() {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('text');
            pagesIndex.forEach(function(page) {
              this.add(page);
            }, this);
          });
        })
        .catch(e => console.error('Search index could not be loaded', e));
    }
  
    // Perform a search
    function search(query) {
      return lunrIndex.search(query).map(function(result) {
        return pagesIndex.filter(function(page) {
          return page.id === result.ref;
        })[0];
      });
    }
  
    // Display search results
    function displaySearchResults(results, query) {
      var searchResults = document.getElementById('search-results');
  
      // Are there any results?
      if (results.length) {
        // Clear previous results
        searchResults.innerHTML = '';
  
        // Add results to the page
        results.forEach(function(result) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = result.url;
          a.textContent = result.title;
          li.appendChild(a);
          searchResults.appendChild(li);
        });
      } else {
        searchResults.innerHTML = '<li>No results found for "' + query + '"</li>';
      }
    }
  
    // Fetch and index all pages
    loadIndex();
  
    // Register search handler
    var searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function(event) {
      var query = event.currentTarget.value;
      var results = search(query); // Use the search function
      displaySearchResults(results, query); // Display the results
    });
  });
  