addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    const url = new URL(request.url);
    const params = url.searchParams;

    if (params.get("url") === null) {
        return fetch("https://niklas.merz.dev/proxy");
    }

    return fetch(params.get("url")).catch((e) => {
        console.error(e);
        return new Response("Not found", { status: 404 });
    })
}