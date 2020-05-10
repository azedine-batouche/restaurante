import { elements } from './base';

export const toogleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

  const like = document.querySelector('.recipe__love use');

  if (like) {
    like.setAttribute('href', `img/icons.svg#${iconString}`);
  }
};

export const toggleLikeMenu = (munLikes) => {
  elements.likesMenu.style.visibility = munLikes > 0 ? 'visible' : 'hidden';
};
export const renderLike = (like) => {
  const markup = `
  <li>
  <a class="likes__link" href="#${like.id}">
      <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
      </figure>
      <div class="likes__data">
          <h4 class="likes__name">${like.title}</h4>
          <p class="likes__author">${like.author}</p>
      </div>
  </a>
</li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`)
    .parentElement;
  if (el) {
    el.parentElement.removeChild(el);
  }
};
