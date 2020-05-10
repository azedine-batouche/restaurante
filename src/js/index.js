import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as SearchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

/** Global state ofhe app
 * - Search object
 */
const state = {};


/**
 *  SEARCH CONTROLLER
 */

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

    try {
      // 4- Search for recipes
      await state.search.getResults();

      // 5- Render result
      clearLoader();
      SearchView.renderResults(state.search.results);
    } catch (error) {
      clearLoader();
    }

  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchPagination.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearResults();
    SearchView.renderResults(state.search.results, goToPage);
  }
});
/**
 *  RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // GET  THE ID FROM URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // PREPARE TH UI FOR CHANGE
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // HIGHLIGHT SELECTED SEARCH ITEM
    if (state.search) SearchView.hightlightSelected(id);

    // CREATE NEW RECIPE OBJECT
    state.recipe = new Recipe(id);
    try {
      // GET RECIPE DATA
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // CALCULE SERVINGS AND TIME
      state.recipe.calcTime();
      state.recipe.calcServings();

      //RENDER RECIPE
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 *  LIST  CONTROLLER
 */
const controlList = () => {
  // Create list if not exist
  if (!state.list) {
    state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach((el) => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
    });
  }
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  }
});

/**
 *  LIKES  CONTROLLER
 */

const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentId = state.recipe.id;

  if (!state.likes.isLiked(currentId)) {
    // ADDlike to the state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //Toggle the like button
    likesView.toogleLikeBtn(true);

    // Add like to th UI
    likesView.renderLike(newLike);
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentId);

    //Toggle the like button
    likesView.toogleLikeBtn(false);

    // Remove like to th UI
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restores Likes recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => {
    likesView.renderLike(like);
  });
});

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-descrease *')) {
    // Descrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      console.log('dec');
      recipeView.updateServingIngredient(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    console.log('inc');
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredient(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});

