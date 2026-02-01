const METADATA_SELECTOR = '.previewModal--detailsMetadata-info';
const TITLE_SELECTOR = '.previewModal--boxart';

function isMetadataReady(node) {
    const metadataRow = node.querySelector(METADATA_SELECTOR);
    const titleElement = node.querySelector(TITLE_SELECTOR);
    return node.classList.contains('detail-modal') && metadataRow && titleElement?.alt;
}

function createRatingBadge(rating) {
    const container = document.createElement('span');
    container.className = 'imdb-rating-display';

    const value = document.createElement('span');
    value.className = 'imdb-rating-value';
    value.innerText = rating;

    container.appendChild(value);
    return container;
}

async function injectRating(node) {

    // skip if rating already exists to avoid duplicates
    if (node.querySelector('.imdb-rating-display')) return;

    let attempts = 0;
    const checkInterval = setInterval(async () => {
        attempts++;

        if (isMetadataReady(node)) {
            clearInterval(checkInterval);
            
            const title = node.querySelector(TITLE_SELECTOR).alt;
            const rating = await getRating(title);
            const badge = createRatingBadge(rating);
            
            node.querySelector(METADATA_SELECTOR).appendChild(badge);
        }

        // stop searching if elements dont appear after 2 seconds
        if (attempts > 20) clearInterval(checkInterval);
    }, 100); 
}

const targetNode = document.getElementById('appMountPoint') || document.body;

const config = { 
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
};

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {

            // if the movie info modal appears in the dom
            if (node.nodeType === 1 && node.classList.contains('previewModal--wrapper')) {
                injectRating(node);
            }
        }
    }
});

observer.observe(targetNode, config);
