import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";
import ImagesApiService from "./image-service";
import MessageService from './message-service';


const refs = {
    searchForm: document.querySelector(".search-form"),
    searchButton: document.querySelector(".search-button"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
    preloader: document.querySelector(".preloader"),
    endOfPage: document.querySelector(".end-of-page"),
};

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const imagesApiService = new ImagesApiService();
const messageService = new MessageService();

refs.searchForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreClick);

function onFormSubmit(e) {
    e.preventDefault();
    clearData();
    showLoadMoreBtn("remove");
    imagesApiService.searchValue = e.currentTarget.elements.searchQuery.value.trim();
    imagesApiService.resetPage();
    
    if (!imagesApiService.searchValue) {                 //the same: searchValue.length === 0
        return messageService.getInputWarning();
    }
   
    showLoader("add");
    imagesApiService.fetchImages()
        .then(renderData)
        .catch(onFetchError)
}
    
function onLoadMoreClick(e) { 
    showLoadMoreBtn("remove");
    imagesApiService.fetchImages()
        .then(renderData)
        .catch(onFetchError)
}

function getMarkupOfImageGallery(images) { 
    return images
            .map(image => {
                return `<div class="photo-card">
                <a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" width="360" height="240" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
        <span><b>${image.likes}</b> Likes</span>
    </p>
    <p class="info-item">
        <span><b>${image.views}</b> Views</span>
    </p>
    <p class="info-item">
        <span><b>${image.comments}</b> Comments</span>
    </p>
    <p class="info-item">
        <span><b>${image.downloads}</b> Downloads</span>
    </p>
    </div>
</div>`;
            })
        .join("");
};

function renderData(data) {
    if (data.hits.length === 0) {
        showLoadMoreBtn("remove");
        messageService.getNoImageWarning();
        
    }
    else if (imagesApiService.page === 2 && data.totalHits > 0) {
        messageService.getSuccessWarning(data.totalHits);
    }

    else if (data.totalHits === data.hits.length) { 
        messageService.getEndOfCollectionWarning();
        messageService.showEndOfPageMessage("add");
        showLoadMoreBtn("remove");
    }

    showLoader("remove");
    const markupGallery = getMarkupOfImageGallery(data.hits);
    refs.gallery.insertAdjacentHTML("beforeend", markupGallery);
    showLoadMoreBtn("add");
 }

function showLoader(method) {
    refs.preloader.classList[method]("show");
};

function showLoadMoreBtn(method) {
    refs.loadMoreBtn.classList[method]("show");
};

function clearData() { 
    refs.gallery.innerHTML = "";
};

function onFetchError() { 
    showLoader("remove");
    return Notiflix.Notify.failure("Something wrong...");
};