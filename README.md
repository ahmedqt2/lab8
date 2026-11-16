# lab 8

This is a small Express server for a web development programme. The home page has buttons that send requests to the API and show the results.

## How to run it

Install Node.js 26 LTS. Open a terminal in the project folder and run:

```sh
npm.cmd start
```

Open http://localhost:3000 in a browser. Use `npm run dev` to restart the server automatically when the server code changes.

## Files

- `server.js` has the routes, course data, logger and request counter.
- `public/index.html` is the home page.
- `public/styles.css` styles the page.
- `public/app.js` sends requests and displays the responses.
- `package.json` lists Express and the commands to run the project.
- `package-lock.json` records the exact package versions.
- `.gitignore` tells Git to skip `node_modules/` and `.env`.
- `.env-copy` shows the environment setting for the port.

## Request counter

The logger and counter run before the routes and static file handler. This means they see requests for HTML, CSS and JavaScript as well as redirects, errors and API requests. A request to `/api/stats` counts itself because the counter runs before that route sends its response.

## curl output

`curl --include http://localhost:3000/api/courses`

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 189
ETag: W/"bd-DVu/xIrhrrLZ8ZCgndgEOKFCeok"
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":"WEB101","title":"HTML and CSS","credits":3},{"id":"WEB102","title":"JavaScript Fundamentals","credits":3},{"id":"WEB103","title":"Introduction to Back-End Development","credits":3}]
```

`curl --include --request POST http://localhost:3000/api/subscribe`

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

`curl --include http://localhost:3000/api/admin`

```http
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

`curl --include http://localhost:3000/old-page`

```http
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

`curl --include http://localhost:3000/api/missing`

```http
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

`curl --include http://localhost:3000/missing`

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 14
ETag: W/"e-vDAjs2Bjp2gdskaBRytU+hHw1Ow"
Date: Sun, 15 Nov 2026 05:14:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Page not found
```

## Questions

### 1. What happened when the 404 fallback was moved to the top?

`/api/courses` returned a JSON 404, and `/` and `/styles.css` returned plain-text 404s. Express reached the fallback first and sent the response before the real routes or static file handler could run.

### 2. What happened when the logger stopped calling next()?

The browser kept waiting for the page and got no response before the test timed out. The server still printed the time and `GET /` because the log ran before the missing `next()`. The request never reached the route that sends the page.
### 3. Why use 201 and 404?

`201 Created` tells the client that a POST created something, which the subscription route simulates. `404 Not Found` tells the client that a resource is missing. A `200` would tell the client the request succeeded even if the body contained an error message.

### 4. Why read the port from process.env.PORT?
A hosting service can set the port, and a developer can pick a different one when port 3000 is in use. If no port is set, the app uses 3000.

### 5. Why leave node_modules out of Git?

npm can rebuild `node_modules/` using `package.json` and `package-lock.json`. After cloning, a teammate runs `npm ci` in the project folder to install the locked dependencies and `npm start` to run the server.

### 6. What happens if index.html is opened from disk?

When Express serves the page, `/api/courses` uses the same scheme, host and port as the page. Opening the page from disk uses a `file:` URL, so the relative API path does not reach the server. Browsers also restrict reading responses from a different origin under the same-origin policy.

## Self-study

- `process.version` gives the Node version. `process.uptime()` gives the number of seconds the program has been running. Both are used in `/api/status`. [Node.js documentation](https://nodejs.org/api/process.html#processuptime)
- `res.type('text/plain')` sets the response type before `res.send()` sends the robots text. [Express documentation](https://expressjs.com/en/5x/api/response/#res.type)
- `JSON.stringify(data, null, 2)` uses two spaces for indentation so the JSON is easier to read on the page. [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

## Challenges
**I had a hard time understanding the server code. I got the server running, but it felt like luck because I still don’t understand how all the parts work together.
**and also we spent the first eight weeks learning front-end development. Now we’re learning back-end development and how to connect it to the front end. The assignments feel harder, and the time we have to finish them feels short. A little more time would help me understand the code and practise what we’re learning.