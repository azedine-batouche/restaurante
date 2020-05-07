import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchPagination.innerHTML = '';
};

const limiteRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > 17) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

const renderRecipie = (recipe) => {
  const markup = `
    <li>
    <a class="results__link " href="#{recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limiteRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `

<button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === 'prev' ? 'left' : 'right'
        }"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>
`;

const renderButton = (page, numResults, maxPage) => {
  const pages = Math.ceil(numResults / maxPage);
  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `
    ${createButton(page, 'next')}
    ${createButton(page, 'prev')}
    `;
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }
  elements.searchPagination.insertAdjacentHTML('afterbegin', button);
};
export const renderResults = (recipes, page = 1, maxPage = 10) => {
  // Render recipe
  const start = (page - 1) * maxPage;
  const end = page * maxPage;
  recipes.slice(start, end).forEach(renderRecipie);

  //Render pagination
  renderButton(page, recipes.length, maxPage);
};
