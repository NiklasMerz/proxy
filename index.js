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
        if (url.pathname === "/") {
            return fetch("https://niklas.merz.dev/proxy");
        } else {
            console.error("Proxy", url);
            return fetch(request).catch((err) => console.error("Proxy pass through error", err));
        }
    }

    return fetch(params.get("url")).catch((e) => {
        console.error(e);
        return new Response("Not found", { status: 404 });
    })
}