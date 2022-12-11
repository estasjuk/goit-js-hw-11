import Notiflix from "notiflix";

export default class MessageService {
    constructor() {
    }

    getSuccessWarning(amount) { 
        return Notiflix.Notify.info(`Hooray! We found ${amount} images.`);
    }

    getInputWarning() { 
        return Notiflix.Notify.info("Please enter your search details");
    }

    getNoImageWarning() { 
        return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
    }

    getEndOfCollectionWarning() { 
        return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

    showEndOfPageMessage(method) { 
        refs.endOfPage.classList[method]("show");
    }
}