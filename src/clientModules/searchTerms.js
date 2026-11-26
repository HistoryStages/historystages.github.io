// What people searched for is the most useful thing a young wiki can learn: a term with
// hits says which page is being read, a term without says which page is missing. The
// search runs entirely in the browser, so nothing records it unless we say so.
//
// Sent as a GoatCounter event, not a page view, so it cannot be confused with traffic.
// GoatCounter skips localhost on its own, so a dev server adds nothing.
//
// Two ways in. Almost everybody types into the navbar box and clicks a suggestion, which
// jumps straight to the page and never touches /search; only "see all results" opens the
// search page. Counting /search alone recorded nothing in two and a half months.

let lastTerm = '';
let lastSentAt = 0;
const REPEAT_WINDOW_MS = 30000;

function send(rawTerm, noResults) {
  const term = (rawTerm ?? '').trim().toLowerCase().slice(0, 80);
  if (term.length < 2) {
    return;
  }
  const now = Date.now();
  if (term === lastTerm && now - lastSentAt < REPEAT_WINDOW_MS) {
    return;
  }
  if (!window.goatcounter || typeof window.goatcounter.count !== 'function') {
    return;
  }
  lastTerm = term;
  lastSentAt = now;
  // A term without hits gets its own prefix, so the gaps sort together in the dashboard.
  const prefix = noResults ? 'search-miss' : 'search';
  window.goatcounter.count({
    path: `${prefix}/${term}`,
    title: `${noResults ? 'Search, no results' : 'Search'}: ${term}`,
    event: true,
  });
}

// --- the navbar box ---------------------------------------------------------------------
// The term is sent once, when the reader leaves the box (by clicking a suggestion, pressing
// Enter or clicking away), so typing "reci", "recip", "recipe" files one search, not three.
// Whether the dropdown showed "no results" is read while the term is still in the box.

const INPUT = '.navbar__search-input';
let typed = '';
let typedNoResults = false;
let settle = null;

// The empty-state element stays in the page after the dropdown closes, so only a visible one
// counts.
function dropdownSaysNoResults() {
  const el = document.querySelector('[class*="noResults"]');
  return el !== null && el.offsetParent !== null;
}

// The first search of a visit waits for the index to download, which can outlast the
// timer; while the dropdown shows neither hits nor "no results", look again a little later.
function readDropdown(tries = 0) {
  settle = null;
  typedNoResults = dropdownSaysNoResults();
  const answered =
    typedNoResults || document.querySelector('.navbar__search [class*="suggestion_"]') !== null;
  if (!answered && tries < 8) {
    settle = window.setTimeout(() => readDropdown(tries + 1), 500);
  }
}

// The dropdown may already be gone by the time focus leaves, which is what the timed look
// in the input handler is for.
function flush() {
  window.clearTimeout(settle);
  settle = null;
  // The first search waits for the index to download, so the timed look can come too early;
  // whatever the dropdown still shows now counts as well.
  send(typed, typedNoResults || dropdownSaysNoResults());
  typed = '';
}

if (typeof window !== 'undefined') {
  document.addEventListener(
    'input',
    (event) => {
      if (!event.target.matches?.(INPUT)) {
        return;
      }
      typed = event.target.value;
      typedNoResults = false;
      window.clearTimeout(settle);
      // The dropdown fills in after the index answers; give it a moment before looking.
      settle = window.setTimeout(readDropdown, 1000);
    },
    true,
  );
  // The box drops focus and takes it straight back once the index has loaded on the first
  // search of a visit, so a focus loss only counts if focus does not return at once.
  let leaving = null;
  document.addEventListener(
    'focusout',
    (event) => {
      if (!event.target.matches?.(INPUT) || !typed) {
        return;
      }
      window.clearTimeout(leaving);
      leaving = window.setTimeout(() => {
        if (typed && !document.activeElement?.matches?.(INPUT)) {
          flush();
        }
      }, 250);
    },
    true,
  );
  document.addEventListener(
    'focusin',
    (event) => {
      if (event.target.matches?.(INPUT)) {
        window.clearTimeout(leaving);
      }
    },
    true,
  );
}

// --- the search page ----------------------------------------------------------------------
// The page rewrites its query while somebody types, so wait for it to sit still.

let pending = null;
const SETTLE_MS = 1200;

export function onRouteUpdate({location}) {
  if (typeof window === 'undefined') {
    return;
  }
  // Picking a suggestion navigates without the box always losing focus first.
  if (typed) {
    flush();
  }
  if (!location.pathname.replace(/\/$/, '').endsWith('/search')) {
    return;
  }
  const query = new URLSearchParams(location.search).get('q');
  if (!query) {
    return;
  }
  window.clearTimeout(pending);
  pending = window.setTimeout(() => {
    send(query, document.querySelector('[class*="noResults"]') !== null);
  }, SETTLE_MS);
}
