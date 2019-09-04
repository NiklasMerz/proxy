addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const COOKIEKEY = "cfwproxylasthost";

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
            if (request.headers.has("Cookie")) {
                url.hostname = parseCookies(request)[COOKIEKEY];
                return fetch(url, { method: request.method });
            } else {
                return fetch(request, { method: request.method }).catch((err) => console.error("Proxy pass through error", err));
            }
        }
    }

    return fetch(params.get("url"))
        .then((res) => {
            let headers = new Headers(res.headers);
            const resUrl = new URL(res.url);
            headers.append("Set-Cookie", COOKIEKEY + "=" + resUrl.hostname);
            res = new Response(res.body, { headers: headers, status: res.status });
            return res;
        })
        .catch((e) => {
            console.error(e);
            return new Response("Not found", { status: 404 });
        })
}


//https://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server/6980804
function parseCookies(request) {
    var list = {},
        rc = request.headers.get("Cookie");

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}