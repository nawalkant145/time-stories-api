/**
 * Decodes common HTML entities to return plain text.
 * @param {string} str The string to decode.
 * @returns {string} The decoded string.
 */
function decodeHtmlEntities(str) {
    if (!str) return '';
    return str
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&rsquo;/g, '’')
        .replace(/&lsquo;/g, '‘')
        .replace(/&ldquo;/g, '“')
        .replace(/&rdquo;/g, '”');
}

/**
 * Removes any HTML tags from a string using basic string iteration.
 * @param {string} str The HTML string.
 * @returns {string} The string with tags removed.
 */
function stripHtmlTags(str) {
    if (!str) return '';
    let result = '';
    let inTag = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '<') {
            inTag = true;
        } else if (char === '>') {
            inTag = false;
        } else if (!inTag) {
            result += char;
        }
    }
    return result;
}

/**
 * Parses the raw HTML string of Time.com to extract the latest 6 stories.
 * Uses only basic string traversal (indexOf, substring, slice, loop).
 * @param {string} html The raw HTML string.
 * @returns {Array<{title: string, link: string}>} Array of latest 6 stories.
 */
function parseLatestStories(html) {
    const stories = [];
    const seenLinks = new Set();
    const seenTitles = new Set();

    let currentIndex = 0;

    while (stories.length < 6) {
        // Find next anchor start <a
        const aStart = html.indexOf('<a ', currentIndex);
        if (aStart === -1) break;

        // Find the matching close tag >
        const aHeaderEnd = html.indexOf('>', aStart);
        if (aHeaderEnd === -1) {
            currentIndex = aStart + 3;
            continue;
        }

        const aTagContent = html.substring(aStart, aHeaderEnd);

        // Find href="..."
        let hrefStart = aTagContent.indexOf('href="');
        if (hrefStart === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }
        hrefStart += 6; // move past href="
        const hrefEnd = aTagContent.indexOf('"', hrefStart);
        if (hrefEnd === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        const href = aTagContent.substring(hrefStart, hrefEnd);

        // Filter valid article or collection links
        const isArticleLink = href.startsWith('https://time.com/article/') || 
                              href.startsWith('https://time.com/collection/') ||
                              href.startsWith('/article/') ||
                              href.startsWith('/collection/');

        if (!isArticleLink) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        // Find the closing </a>
        const aEnd = html.indexOf('</a>', aHeaderEnd);
        if (aEnd === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        // Extract inner HTML of anchor
        const innerHTML = html.substring(aHeaderEnd + 1, aEnd);

        // Extract title (check for <span>...</span> first, else use text content)
        let titleText = '';
        const spanStart = innerHTML.indexOf('<span>');
        if (spanStart !== -1) {
            const spanEnd = innerHTML.indexOf('</span>', spanStart);
            if (spanEnd !== -1) {
                titleText = innerHTML.substring(spanStart + 6, spanEnd);
            }
        }
        
        if (!titleText) {
            titleText = innerHTML;
        }

        titleText = stripHtmlTags(titleText).trim();
        titleText = decodeHtmlEntities(titleText);
        
        // Clean up whitespace / newlines
        titleText = titleText.replace(/\s+/g, ' ');

        currentIndex = aEnd + 4; // Move past </a>

        // Skip utility or navigation items
        const lowerTitle = titleText.toLowerCase();
        if (!titleText || lowerTitle === 'read more' || lowerTitle === 'subscribe' || lowerTitle === 'sign up') {
            continue;
        }

        const absoluteLink = href.startsWith('/') ? `https://time.com${href}` : href;

        // Ensure uniqueness using a Set
        if (!seenLinks.has(absoluteLink) && !seenTitles.has(lowerTitle)) {
            seenLinks.add(absoluteLink);
            seenTitles.add(lowerTitle);
            stories.push({
                title: titleText,
                link: absoluteLink
            });
        }
    }

    return stories;
}

module.exports = {
    parseLatestStories
};
