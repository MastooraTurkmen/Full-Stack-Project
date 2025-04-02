const { chromium } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Configure stealth plugin with proper UA override
const stealth = StealthPlugin();
stealth.enabledEvasions.delete('user-agent-override'); // Remove problematic evasion
chromium.use(stealth);

// Configuration
const config = {
    headless: false,
    timeout: 120000, // 2 minutes
    proxy: '', // Add your proxy if needed: 'http://user:pass@host:port'
    userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1'
    ]
};

async function scrapeTikTokSearch(keyword) {
    // Select random user agent
    const userAgent = config.userAgents[Math.floor(Math.random() * config.userAgents.length)];

    // Launch browser with enhanced stealth configuration
    const browser = await chromium.launch({
        headless: config.headless,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            config.proxy ? `--proxy-server=${config.proxy}` : ''
        ].filter(Boolean),
    });

    const context = await browser.newContext({
        userAgent,
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });

    const page = await context.newPage();

    try {
        // Manual webdriver evasion (replaces evaluateOnNewDocument)
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
        });

        // Block unnecessary resources
        await page.route('**/*.{png,jpg,jpeg,webp,gif,svg,mp4,woff2}', route => route.abort());

        const searchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(keyword)}`;
        console.log(`Navigating to: ${searchUrl}`);

        // Human-like delay
        await page.waitForTimeout(2000 + Math.random() * 3000);

        // Navigation with multiple fallbacks
        try {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: config.timeout });
        } catch {
            console.log('First attempt failed, retrying with networkidle');
            await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: config.timeout });
        }

        console.log('Waiting for content...');

        // Modern TikTok selectors (updated 2024)
        const selectors = [
            { name: 'video-card', selector: 'div[data-e2e="search-card"]' },
            { name: 'video-item', selector: 'div[class*="VideoCard"]' },
            { name: 'any-video', selector: 'div[class*="video-container"]' }
        ];

        let contentFound = false;
        for (const { name, selector } of selectors) {
            try {
                await page.waitForSelector(selector, { timeout: 10000 });
                console.log(`Found content using selector: ${name}`);
                contentFound = true;
                break;
            } catch {
                console.log(`Selector ${name} not found, trying next...`);
            }
        }

        if (!contentFound) {
            throw new Error('No video content found on page');
        }

        // Extract video data
        const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div[data-e2e="search-card"], div[class*="VideoCard"]')).map(el => {
                return {
                    title: el.querySelector('[data-e2e*="title"]')?.textContent || el.querySelector('[class*="Title"]')?.textContent || '',
                    author: el.querySelector('[data-e2e*="user"]')?.textContent || el.querySelector('[class*="UserName"]')?.textContent || '',
                    likes: el.querySelector('[data-e2e*="like"]')?.textContent || el.querySelector('[class*="LikeCount"]')?.textContent || '0',
                    url: el.querySelector('a[href*="/video/"]')?.href || ''
                };
            });
        });

        console.log('\n=== Search Results ===');
        console.log(`Found ${results.length} videos for "${keyword}":`);
        results.slice(0, 5).forEach((item, i) => {
            console.log(`\n#${i + 1}: ${item.title}`);
            console.log(`Author: ${item.author}`);
            console.log(`Likes: ${item.likes}`);
            console.log(`URL: ${item.url}`);
        });

        return results;

    } catch (error) {
        console.error('\nScraping failed:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Try running in headless: true mode');
        console.log('2. Use a residential proxy (free ones often get blocked)');
        console.log('3. Check if TikTok shows CAPTCHA when visiting manually');
        console.log('4. Update selectors if TikTok changed their page structure');
        return [];
    } finally {
        await browser.close();
    }
}

// Run the scraper
(async () => {
    const results = await scrapeTikTokSearch('lipstick');

    if (results.length === 0) {
        console.log('\nNo results found. Additional solutions:');
        console.log('- Wait 1 hour and try again (rate limits reset)');
        console.log('- Try a less popular search term');
        console.log('- Check network tab in DevTools for blocked requests');
    }
})();