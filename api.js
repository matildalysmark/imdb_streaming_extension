const BASE_URL = "https://api.imdbapi.dev";
const SEARCH_ENDPOINT = `${BASE_URL}/search/titles`;

async function getRating(movieTitle, limit=1) {
    const fallback = "N/A";

    const params = new URLSearchParams({
        query: movieTitle,
        limit: limit
    });

    try {
        const response = await fetch(`${SEARCH_ENDPOINT}?${params}`, { 
            signal: AbortSignal.timeout(5000) 
        });

        if (!response.ok) {
            throw new Error(`HTTP status: ${response.status}`);
        }

        const data = await response.json();
        const rating = data.titles?.[0]?.rating?.aggregateRating ?? fallback;

        return rating.toFixed(1);

    } catch (e) {
        console.error("API error:", e);
        return fallback;
    }
}
