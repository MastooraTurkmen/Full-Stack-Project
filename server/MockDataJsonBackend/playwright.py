from playwright.sync_api import sync_playwright
pw = sync_playwright().start()
browser = pw.chromium.launch()
page = browser.new_page()
page.goto('https://www.tiktok.com/@mrbeast')

print(page.content())
print(page.title())

page.screenshot(path='screenshot.png')