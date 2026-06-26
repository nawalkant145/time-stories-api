# Time.com Latest Stories API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Completed-success)

A lightweight, modular Node.js API server that scrapes and returns the latest 6 unique stories from [Time.com](https://time.com) as JSON.

This application is built entirely in vanilla Node.js using only built-in modules (`http` and `https`) and basic string manipulation operations. **It does not use any internal or external HTML parsing libraries or packages (such as Cheerio, jsdom, or Axios)**, strictly adhering to the assignment constraints.

## Features

- Fetches the latest 6 stories from Time.com.
- Exposes a simple REST API (`GET /getTimeStories`).
- Uses only built-in Node.js modules (`http` and `https`).
- Implements manual HTML string parsing without third-party libraries.
- Removes duplicate stories using `Set`.
- Includes integration testing.
- Configurable server port.
- Returns structured JSON responses.

## Tech Stack

- Node.js
- HTTP Module
- HTTPS Module
- JavaScript (ES6)

## Assignment Constraints

This project intentionally avoids the use of external HTTP clients and HTML parsing libraries.

Only the following built-in Node.js modules are used:

- http
- https

HTML is parsed manually using basic string operations such as:

- indexOf()
- substring()
- iteration
- Set

## Project Structure

```text
time-stories-api/
│
├── server.js
├── fetchHtml.js
├── htmlParser.js
├── test.js
├── package.json
├── README.md
└── .gitignore
```

## How It Works

1. The client sends a GET request to `/getTimeStories`.
2. The server fetches the Time.com homepage using Node's `https` module.
3. The HTML is processed using basic string operations (`indexOf`, `substring`, and iteration).
4. The first six unique stories are extracted.
5. The server returns the result as JSON.

## Architecture & Modular Design

The project is organized following the **Separation of Concerns** principle:

- **`server.js`**: Starts the HTTP server, handles API routing, coordinates the request lifecycle, and formats responses (CORS headers, status codes, JSON payload).
- **`fetchHtml.js`**: Fetches the raw HTML content from Time.com using Node's native `https` module, incorporating custom headers (e.g., standard browser `User-Agent`) and connection error/timeout handling.
- **`htmlParser.js`**: Implements a custom **HTML String Parser** using basic string operations (`indexOf`, `substring`, string loops, and `Set`-based deduplication) to parse out the first 6 unique article links and titles. It also decodes standard HTML entities and removes nested tags.
- **`test.js`**: An integration test script that spawns the server, makes HTTP calls, asserts the response schema (structure, length, types), and cleans up after completion.

---

## API Endpoint Contract

### GET `/getTimeStories`

Retrieves the latest 6 unique stories from Time.com.

### Example Request

```http
GET http://localhost:3000/getTimeStories
```

### Sample Response

```json
[
  {
    "title": "Broken Bones, Lawsuits, and NDAs: Inside the Worker Safety Concerns at Stargate",
    "link": "https://time.com/article/2026/06/24/ai-data-center-stargate-abilene-texas-injuries/"
  },
  {
    "title": "Back-to-Back Quakes Rattle Venezuela: What to Know",
    "link": "https://time.com/article/2026/06/25/venezuela-earthquake-doublet-magnitude-casualties-explainer/"
  },
  {
    "title": "How Shepard Fairey Created TIME's 'Our America' Cover",
    "link": "https://time.com/collection/our-america-250/2026/behind-america-250-cover/"
  },
  {
    "title": "Postal Service Plans Not to Deliver Mail Ballots to States Unless They Hand Over Voter Data",
    "link": "https://time.com/article/2026/06/25/postal-service-not-to-deliver-mail-ballots-to-states-unless-they-hand-over-voter-data/"
  },
  {
    "title": "Photos Show the Destruction in Venezuela From Twin Earthquakes",
    "link": "https://time.com/article/2026/06/25/venezuela-earthquake-in-pictures/"
  },
  {
    "title": "Trump Delivers First Verdict on Britain's Likely Next Prime Minister",
    "link": "https://time.com/article/2026/06/25/trump-andy-burnham-uk-prime-minister-lead-reaction-nato-tensions/"
  }
]
```

#### Failure Response
- **HTTP Status Code**: `500 Internal Server Error`
- **Content-Type**: `application/json`
- **Body**:
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
npm start
```
*(or `node server.js`)*

You can specify a custom port as a command-line argument:
```bash
node server.js 8080
```
Or set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

Access the API in your browser or client at:
`http://localhost:<PORT>/getTimeStories` (e.g. `http://localhost:3000/getTimeStories`).

---

## Testing

To run the automated integration tests:
```bash
npm test
```
*(or `node test.js`)*

This will automatically launch the server on port `3001` (to avoid conflicting with a running server), fetch live stories from Time.com, validate the API contract and data integrity, output the results, and shut down the test server.

---

## Notes

This implementation depends on the current HTML structure of the Time.com homepage. If the website changes its layout or markup, the parser may require updates.
