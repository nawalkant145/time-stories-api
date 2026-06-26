const http = require('http');
const fetchHtml = require('./fetchHtml');
const { parseLatestStories } = require('./htmlParser');

const DEFAULT_PORT = 3000;

// Resolve port: command-line argument first, then environment variable, then default
const args = process.argv.slice(2);
const portArg = parseInt(args[0], 10);
const PORT = (!isNaN(portArg) && portArg > 0) ? portArg : (process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT);

const server = http.createServer((req, res) => {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/getTimeStories' && req.method === 'GET') {
        fetchHtml()
            .then((html) => {
                const stories = parseLatestStories(html);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(stories));
            })
            .catch((err) => {
                // Simple error handling for now (refined in next commit)
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
