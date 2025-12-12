from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto('http://localhost:8080')
    # Wait for canvas to be present
    page.wait_for_selector('canvas')
    # Wait a bit for initialization
    page.wait_for_timeout(3000)

    # Take screenshot
    page.screenshot(path='verification/app_screenshot.png')

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app(page)
        finally:
            browser.close()
