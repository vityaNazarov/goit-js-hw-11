import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '32092680-3b49782323b5bf3e8b9e41587';
  #query = '';

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  async getImagesByQuery(page) {
    const { data } = await axios.get(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
        this.#query
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );

    return data;
  }
}
