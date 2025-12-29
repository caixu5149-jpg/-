
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant permissions for camera, though we likely won't see a real camera in headless
        context = browser.new_context(permissions=['camera'])
        page = context.new_page()

        # Navigate to the local server
        page.goto('http://localhost:8080')

        # Wait for canvas to be present (Three.js renderer)
        page.wait_for_selector('canvas')

        # Wait a bit for particles to generate and render
        page.wait_for_timeout(2000)

        # Take a screenshot
        page.screenshot(path='verification/verification.png')

        browser.close()

if __name__ == '__main__':
    verify_app()
