// Scroll back to the top of the diary page-browser whenever the reader
// changes pages via the semantic-table/Griddle pagination footer (the
// "« 1 2 3 4 »" links under #mb_diaries_diary in Template:mbdiaries-ontology:Diary.html).
//
// Griddle swaps which rows are mounted in place -- there is no navigation
// event, no URL change, and no router for anything else to hook into -- so
// without this, clicking a page number leaves the reader at whatever
// scroll position they were at on the previous page, landing somewhere in
// the middle of the new set of diary sequences instead of at the first one.
(function () {
  'use strict';

  var RESULTS_SELECTOR = '#table-result';
  var CONTAINER_SELECTOR = '#mb_diaries_diary';
  var PAGINATION_LINK_SELECTOR =
    CONTAINER_SELECTOR + ' .griddle-footer .pagination li:not(.disabled) a';

  function scrollToTopOfResults() {
    var target =
      document.querySelector(RESULTS_SELECTOR) ||
      document.querySelector(CONTAINER_SELECTOR);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest(PAGINATION_LINK_SELECTOR);
    if (!link) {
      return;
    }
    // Griddle re-renders the row set asynchronously on click; wait a tick
    // so the new rows are in the DOM (and the page has reflowed) before
    // measuring/scrolling to the results container.
    setTimeout(scrollToTopOfResults, 50);
  });
})();
