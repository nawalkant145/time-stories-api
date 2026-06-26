const https = require('https');

/**
 * Fetches the HTML content of Time.com.
 * @returns {Promise<string>} A promise that resolves with the HTML content.
 */
function fetchHtml() {
    return new Promise((resolve, reject) => {
        const url = 'https://time.com';
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000 // 10 seconds timeout
        };

        const req = https.get(url, options, (res) => {
            const statusCode = res.statusCode;

            if (statusCode !== 200) {
                reject(new Error(`Failed to fetch HTML from Time.com. Status Code: ${statusCode}`));
                res.resume(); // Consume response data to free up memory
                return;
            }

            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Network error fetching HTML from Time.com: ${err.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request to Time.com timed out'));
        });
    });
}

module.exports = fetchHtml;
