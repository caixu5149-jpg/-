from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto('http://localhost:8080')
    # Wait for canvas to be present
    page.wait_for_selector('canvas')
    # Wait a bit for particles to generate
    page.wait_for_timeout(2000)
    page.screenshot(path='verification/screenshot.png')

if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_app(page)
            print("Screenshot taken successfully")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
