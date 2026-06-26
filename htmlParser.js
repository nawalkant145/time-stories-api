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

function parseLatestStories(html) {
    const stories = [];
    const seenLinks = new Set();
    const seenTitles = new Set();

    let currentIndex = 0;

    while (stories.length < 6) {
        const aStart = html.indexOf('<a ', currentIndex);
        if (aStart === -1) break;

        const aHeaderEnd = html.indexOf('>', aStart);
        if (aHeaderEnd === -1) {
            currentIndex = aStart + 3;
            continue;
        }

        const aTagContent = html.substring(aStart, aHeaderEnd);

        let hrefStart = aTagContent.indexOf('href="');
        if (hrefStart === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }
        hrefStart += 6;
        const hrefEnd = aTagContent.indexOf('"', hrefStart);
        if (hrefEnd === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        const href = aTagContent.substring(hrefStart, hrefEnd);

        const isArticleLink = href.startsWith('https://time.com/article/') || 
                              href.startsWith('https://time.com/collection/') ||
                              href.startsWith('/article/') ||
                              href.startsWith('/collection/');

        if (!isArticleLink) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        const aEnd = html.indexOf('</a>', aHeaderEnd);
        if (aEnd === -1) {
            currentIndex = aHeaderEnd + 1;
            continue;
        }

        const innerHTML = html.substring(aHeaderEnd + 1, aEnd);

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
        titleText = titleText.replace(/\s+/g, ' ');

        currentIndex = aEnd + 4;

        const lowerTitle = titleText.toLowerCase();
        if (!titleText || lowerTitle === 'read more' || lowerTitle === 'subscribe' || lowerTitle === 'sign up') {
            continue;
        }

        const absoluteLink = href.startsWith('/') ? `https://time.com${href}` : href;

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
