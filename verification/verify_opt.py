from playwright.sync_api import sync_playwright

def verify_optimization():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto('http://localhost:8080')

        # Wait for canvas to be present (indicating Three.js initialized)
        page.wait_for_selector('canvas')

        # Wait a bit for particles to generate
        page.wait_for_timeout(2000)

        # Take a screenshot to verify it renders
        page.screenshot(path='verification/optimization_check.png')

        # We can also execute JS to verify the materials are pooled, if we expose them
        # Since I didn't expose meshMaterials globally, I can't check directly.
        # But I can check if errors occurred.

        browser.close()

if __name__ == "__main__":
    verify_optimization()
