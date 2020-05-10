import axios from 'axios';
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const result = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.results = result.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
