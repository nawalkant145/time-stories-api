# Time.com Latest Stories API

A lightweight, modular Node.js API server that scrapes and returns the latest 6 unique stories from [Time.com](https://time.com) as JSON.

This application is built entirely in vanilla Node.js using only built-in modules (`http` and `https`) and basic string manipulation operations. **It does not use any internal or external HTML parsing libraries or packages (such as Cheerio, jsdom, or Axios)**, strictly adhering to the assignment constraints.

## Architecture & Modular Design

The project is organized following the **Separation of Concerns** principle:

- **`server.js`**: Starts the HTTP server, handles API routing, coordinates the request lifecycle, and formats responses (CORS headers, status codes, JSON payload).
- **`fetchHtml.js`**: Fetches the raw HTML content from Time.com using Node's native `https` module, incorporating custom headers (e.g., standard browser `User-Agent`) and connection error/timeout handling.
- **`htmlParser.js`**: Implements a custom **HTML String Parser** using basic string operations (`indexOf`, `substring`, string loops, and `Set`-based deduplication) to parse out the first 6 unique article links and titles. It also decodes standard HTML entities and removes nested tags.
- **`test.js`**: An integration test script that spawns the server, makes HTTP calls, asserts the response schema (structure, length, types), and cleans up after completion.

## API Endpoint Contract

### GET `/getTimeStories`

Retrieves the latest 6 unique stories from Time.com.

#### Success Response
- **HTTP Status Code**: `200 OK`
- **Content-Type**: `application/json`
- **Response Body**:
```json
[
  {
    "title": "Story Title 1",
    "link": "https://time.com/article/path-1"
  },
  {
    "title": "Story Title 2",
    "link": "https://time.com/article/path-2"
  },
  ...
]
```

#### Failure Response
- **HTTP Status Code**: `500 Internal Server Error`
- **Content-Type**: `application/json`
- **Response Body**:
```json
{
  "error": "Unable to fetch latest stories."
}
```

---

## Installation & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- Git (optional)

### Starting the Server

By default, the server runs on port `3000`:
```bash
node server.js
```

You can specify a custom port as a command-line argument:
```bash
node server.js 8080
```
Or set the `PORT` environment variable:
```bash
PORT=8080 node server.js
```

Access the API in your browser or client at:
`http://localhost:<PORT>/getTimeStories` (e.g. `http://localhost:3000/getTimeStories`).

---

## Testing

To run the automated integration tests:
```bash
node test.js
```
This will automatically launch the server on port `3001` (to avoid conflicting with a running server), fetch live stories from Time.com, validate the API contract and data integrity, output the results, and shut down the test server.
