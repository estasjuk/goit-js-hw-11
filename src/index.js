import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import axios from "axios";
import ImagesApiService from "./image-service";


const refs = {
    searchForm: document.querySelector(".search-form"),
    searchButton: document.querySelector(".search-button"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
    preloader: document.querySelector(".preloader"),
};

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreClick);



function onFormSubmit(e) {
    e.preventDefault();
    clearData();
    imagesApiService.searchValue = e.currentTarget.elements.searchQuery.value.trim();
    imagesApiService.resetPage();
    
    if (!imagesApiService.searchValue) {                 //the same: searchValue.length === 0
        return getWarning();
    }
    showLoader("add");
    imagesApiService.fetchImages()
        .then(renderData)
        .catch(onFetchError)
}
    
function onLoadMoreClick(e) { 
 imagesApiService.fetchImages()
        .then(renderData)
        .catch(onFetchError)
}

function getMarkupOfImageGallery(images) { 
    console.log(images);
    return images
            .map(image => {
                return `<div class="photo-card">
                <a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" width="360" height="240" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
        <b>${image.likes} Likes</b>
    </p>
    <p class="info-item">
        <b>${image.views} Views</b>
    </p>
    <p class="info-item">
        <b>${image.comments} Comments</b>
    </p>
    <p class="info-item">
        <b>${image.downloads} Downloads</b>
    </p>
    </div>
</div>`;
            })
        .join("");
};

function renderData(hits) {
 if (hits.length === 0) {
        getWarning();
    }

    showLoader("remove");
    const markupGallery = getMarkupOfImageGallery(hits);
    refs.gallery.insertAdjacentHTML("beforeend", markupGallery);
 }

function showLoader(method) {
    refs.preloader.classList[method]("show");
};

function clearData() { 
    refs.gallery.innerHTML = "";
};

function onFetchError() { 
    showLoader("remove");
    return Notiflix.Notify.failure("");
};

function getWarning() { 
        return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
}