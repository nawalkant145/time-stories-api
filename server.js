const http = require('http');

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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([])); // Skeleton placeholder
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
