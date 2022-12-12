export function getMarkupOfImageGallery(images) { 
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