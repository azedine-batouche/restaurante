import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as SearchView from './views/searchView';
/** Global state ofhe app
 * - Search object
 */
const state = {};

const controlSearch = async () => {
  // 1- Get query from the view
  const query = SearchView.getInput();
  if (query) {
    // 2 - new search object and add to state
    state.search = new Search(query);

    // 3- Prepare UI for results
    SearchView.clearInput();
    SearchView.clearResults();

    renderLoader(elements.searchResult);

    // 4- Search for recipes
    await state.search.getResults();

    // 5- Render result
    clearLoader();
    SearchView.renderResults(state.search.results);
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchPagination.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  //console.log(e.target);
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearResults();
    SearchView.renderResults(state.search.results, goToPage);
  }
});
