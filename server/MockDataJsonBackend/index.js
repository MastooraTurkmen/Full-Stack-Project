const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser with a proxy (if available)
    const browser = await puppeteer.launch({
        headless: false, // Set to true to run in the background
    });
    const page = await browser.newPage();

    // Set headers to mimic a real browser
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    // TikTok Creative Center URL
    const url =
        'https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en?period=7&region=FR';
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Page loaded successfully!');

    let allAds = [];

    // Pagination loop – scroll and scrape multiple pages
    for (let i = 0; i < 5; i++) {
        console.log(`Scraping page ${i + 1}...`);

        // Extract ad data
        const adsData = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.inspiration-item')).map((item) => {
                return {
                    title: item.querySelector('.title')?.innerText || 'No title',
                    views: item.querySelector('.count')?.innerText || '0 views',
                    likes: item.querySelector('.likes')?.innerText || '0 likes',
                    link: item.querySelector('a')?.href || 'No link',
                };
            });
        });

        allAds.push(...adsData);

        // Scroll to load more ads
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });

        // Wait for new data to load
        await page.waitForTimeout(3000);
    }

    console.log('Total Ads Scraped:', allAds.length);
    console.log(allAds);

    await browser.close();
})();
