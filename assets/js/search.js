(function () {
  'use strict';

  var index = window.PTA_SEARCH_INDEX;
  if (!index || !index.length) return;

  /**
   * Get query from URL param ?q=
   */
  function getQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  /**
   * Match query against one index entry (title, description, keywords).
   * Query can be multiple words; all must match (AND).
   */
  function matchEntry(entry, query) {
    if (!query) return false;
    var q = query.toLowerCase().replace(/\s+/g, ' ').split(' ');
    var text = (entry.title + ' ' + (entry.description || '') + ' ' + (entry.keywords || '')).toLowerCase();
    for (var i = 0; i < q.length; i++) {
      if (q[i].length && text.indexOf(q[i]) === -1) return false;
    }
    return true;
  }

  /**
   * Run search and return array of matching entries.
   */
  function runSearch(query) {
    if (!query) return [];
    var results = [];
    for (var i = 0; i < index.length; i++) {
      if (matchEntry(index[i], query)) results.push(index[i]);
    }
    return results;
  }

  /**
   * Render results on search.html
   */
  function renderSearchPage() {
    var listEl = document.getElementById('searchResultsList');
    var statusEl = document.getElementById('searchResultsStatus');
    var pageInput = document.getElementById('searchPageInput');
    if (!listEl || !statusEl) return;

    var query = getQueryFromUrl();
    if (pageInput) pageInput.value = query;

    if (!query) {
      statusEl.textContent = 'Enter a search term above and click Search.';
      statusEl.hidden = false;
      listEl.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    var results = runSearch(query);
    listEl.innerHTML = '';

    if (results.length === 0) {
      statusEl.textContent = 'No results found for “‘ + escapeHtml(query) + '”. Try different words (e.g. tax, BOI, contact, services).';
      statusEl.hidden = false;
      listEl.hidden = true;
      return;
    }

    statusEl.textContent = results.length + ' result' + (results.length === 1 ? '' : 's') + ' for “‘ + escapeHtml(query) + '”';
    statusEl.hidden = false;
    listEl.hidden = false;

    for (var j = 0; j < results.length; j++) {
      var item = results[j];
      var li = document.createElement('li');
      li.className = 'search-result-item';
      li.innerHTML =
        '<a href="' + escapeHtml(item.url) + '" class="search-result-link">' +
          '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
          (item.description ? '<span class="search-result-desc">' + escapeHtml(item.description) + '</span>' : '') +
        '</a>';
      listEl.appendChild(li);
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // Run on search page load
  if (document.getElementById('searchResultsList')) {
    renderSearchPage();
  }

  // When header search form is submitted, ensure we go to search.html with q (already does via action="search.html" method="get" name="q")
  var searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function () {
      var input = document.getElementById('searchInput');
      if (input && !input.value.trim()) {
        // Optional: prevent empty submit and focus input
        input.focus();
      }
    });
  }
})();
