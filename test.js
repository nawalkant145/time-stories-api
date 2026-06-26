const { spawn } = require('child_process');
const http = require('http');

console.log('Starting integration tests...');

const TEST_PORT = 3001; // use custom port for test to avoid collision

// Spawn server process
const serverProc = spawn('node', ['server.js', TEST_PORT]);

let serverStarted = false;

serverProc.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`[Server]: ${text.trim()}`);
    if (text.includes(`running on port ${TEST_PORT}`)) {
        serverStarted = true;
        runTests();
    }
});

serverProc.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data.toString().trim()}`);
});

function runTests() {
    console.log(`Making request to http://localhost:${TEST_PORT}/getTimeStories ...`);
    
    http.get(`http://localhost:${TEST_PORT}/getTimeStories`, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
        }

        if (error) {
            console.error(error.message);
            cleanup(1);
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                console.log('Received response data:');
                console.log(JSON.stringify(parsedData, null, 2));

                // Assertions
                if (!Array.isArray(parsedData)) {
                    throw new Error('Assertion Failed: Response is not a JSON array.');
                }
                if (parsedData.length !== 6) {
                    throw new Error(`Assertion Failed: Expected exactly 6 stories, got ${parsedData.length}`);
                }

                parsedData.forEach((story, index) => {
                    if (typeof story.title !== 'string' || story.title.trim().length === 0) {
                        throw new Error(`Assertion Failed: Story at index ${index} lacks a valid 'title'`);
                    }
                    if (typeof story.link !== 'string' || !story.link.startsWith('https://time.com/')) {
                        throw new Error(`Assertion Failed: Story at index ${index} lacks a valid absolute Time.com 'link'`);
                    }
                });

                console.log('\n✅ All tests passed successfully!');
                cleanup(0);
            } catch (e) {
                console.error(`Test failed: ${e.message}`);
                cleanup(1);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        cleanup(1);
    });
}

function cleanup(exitCode) {
    console.log('Shutting down test server...');
    serverProc.kill();
    process.exit(exitCode);
}

// Timeout backup
setTimeout(() => {
    if (!serverStarted) {
        console.error('Error: Server failed to start in time.');
        cleanup(1);
    }
}, 8000);
