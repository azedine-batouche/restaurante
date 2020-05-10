import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }
  calcTime() {
    const numberIng = this.ingredients.length;
    const peroids = Math.ceil(numberIng / 3);
    this.time = peroids * 15; // 15min each period
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const longUnits = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teasponns',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const shortUnits = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...shortUnits, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      // 1 Uniform units
      let ingredient = el.toLowerCase();
      longUnits.forEach((unit, idx) => {
        ingredient = ingredient.replace(unit, units[idx]);
      });

      // 2 Remove the parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3Parse ingredient into count,unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => shortUnits.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
