// мой ключ   32092680-3b49782323b5bf3e8b9e41587

import { makeMarkup } from './js/make-markup';
import PixabayApiService from './js/pixabay-service';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const pixabayApiService = new PixabayApiService();

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

refs.searchFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onFormSubmit(evt) {
  evt.preventDefault();
  clearHtmlMarkup();
  pixabayApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (pixabayApiService.query === '') {
    return Notify.info('Enter a search term');
  }
  loadMoreBtn.show();
  pixabayApiService.resetPage();
  onLoadMore();
}

function onLoadMore() {
  loadMoreBtn.disable();
  pixabayApiService
    .fetchImages()
    .then(data => {
      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.hide();
        return;
      }
      addMarkup(data);
      lightbox.refresh();

      if (refs.galleryEl.children.length === data.totalHits) {
        Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        loadMoreBtn.hide();
      } else {
        loadMoreBtn.enable();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));
}

function addMarkup(hits) {
  refs.galleryEl.insertAdjacentHTML('beforeend', makeMarkup(hits));
}

function clearHtmlMarkup() {
  refs.galleryEl.innerHTML = '';
}
