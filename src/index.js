import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from "notiflix";
import ImagesApiService from './js/image-service';
import MessageService from './js/message-service';
import AuxiliaryService from './js/auxiliary-service';
import { getMarkupOfImageGallery } from './js/get-gallery-markup';

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
const auxiliaryService = new AuxiliaryService();

refs.searchForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreClick);

async function onFormSubmit(e) {

    e.preventDefault();
    auxiliaryService.clearData();
    messageService.showEndOfPageMessage("remove");
    auxiliaryService.showLoadMoreBtn("remove");
    imagesApiService.searchValue = e.currentTarget.elements.searchQuery.value.trim();
    imagesApiService.resetPage();
    
    if (!imagesApiService.searchValue) {                 //the same: searchValue.length === 0
        return messageService.getInputWarning();
    }
   
    auxiliaryService.showLoader("add");

    try {
        const response = await imagesApiService.fetchImages();
        renderData(response);
    }
    catch (error) {
        onFetchError();
    }
    gallery.refresh();
}

async function onLoadMoreClick(e) { 
    auxiliaryService.showLoadMoreBtn("remove");
    try {
        const response = await imagesApiService.fetchImages();
        renderData(response);
    }
    catch {
        onFetchError();
    }
    gallery.refresh();
}

function renderData(data) {
    auxiliaryService.showLoader("remove");

    if (data.totalHits === 0) {
        auxiliaryService.showLoadMoreBtn("remove");
        messageService.getNoImageWarning();
    }

    else {
        if (imagesApiService.page === 2 && data.totalHits > 0) {
            messageService.getSuccessWarning(data.totalHits);
        }
        
        const markupGallery = getMarkupOfImageGallery(data.hits);
        refs.gallery.insertAdjacentHTML("beforeend", markupGallery);
        auxiliaryService.showLoadMoreBtn("add");

        if (data.hits.length < imagesApiService.perPage) {
                messageService.getEndOfCollectionWarning();
                messageService.showEndOfPageMessage("add");
                auxiliaryService.showLoadMoreBtn("remove");
        }
    }
}

function onFetchError() { 
        auxiliaryService.showLoader("remove");
        return Notiflix.Notify.failure("Something wrong...");
    };