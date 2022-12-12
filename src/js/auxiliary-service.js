export default class AuxiliaryService { 

    constructor() { 
        this.gallery = document.querySelector(".gallery");
        this.loadMoreBtn = document.querySelector(".load-more");
        this.preloader = document.querySelector(".preloader");
        this.endOfPage = document.querySelector(".end-of-page");
    }
    
    showLoader(method) {
        this.preloader.classList[method]("show");
    };

    showLoadMoreBtn(method) {
        this.loadMoreBtn.classList[method]("show");
    };

    clearData() { 
        this.gallery.innerHTML = "";
    };
}