const API_KEY = "31912005-8d974e59264dcf44d8770ddf1";

export default class ImagesApiService {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.perPage = 40;
    }

    fetchImages() {
        const URL = `https://pixabay.com/api/?key=${API_KEY}`;
        const searchParams = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`; 
        return fetch(`${URL}&q=${this.searchQuery}${searchParams}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else throw new Error(response.status);
        })
            .then((data) => {
                this.incrementPage();
                console.log(this.page);
                console.log(data);
                return data;
            })
    }

    incrementPage() { 
        this.page += 1
    }

    resetPage() { 
        this.page = 1;
    }

    get searchValue() {
        return this.searchQuery;
    }

    set searchValue(newValue) { 
        this.searchQuery = newValue;
    }
 }
