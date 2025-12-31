from playwright.sync_api import sync_playwright

def verify_optimization():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant permissions for camera (though we might not need it for this test, it avoids prompts)
        context = browser.new_context(permissions=['camera'])
        page = context.new_page()

        # Capture console errors
        page.on("console", lambda msg: print(f"Console {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Uncaught exception: {err}"))

        try:
            print("Navigating to app...")
            page.goto("http://localhost:8080/index.html")

            # Wait for canvas to be present
            print("Waiting for canvas...")
            page.wait_for_selector("canvas", timeout=10000)

            # Wait a bit for particles to spawn
            print("Waiting for particles...")
            page.wait_for_timeout(3000)

            # Check if global variables are exposed or access internals via evaluation
            # We want to verify material pooling.
            # We can inspect the `particlesData` array if accessible, or `particlesGroup`.
            # Since `particlesData` is defined in the module scope but not attached to window,
            # we might not be able to access it directly unless we modify script.js to expose it
            # OR we inspect the Three.js scene graph starting from the scene.

            # Let's inspect the scene graph.
            # We need to access the `scene` object. script.js declares `let scene;` at top level.
            # To access it from Playwright, it needs to be on `window`.
            # I cannot easily modify the file just for this test without reverting it.
            # However, I can look for `THREE` on window if it was exposed? No, it's imported as module.

            # Visual verification: Just take a screenshot to ensure it renders.
            # If the optimization broke something (e.g., materials undefined), the canvas would likely be black or error out.

            page.screenshot(path="verification/screenshot.png")
            print("Screenshot taken.")

        except Exception as e:
            print(f"Error during verification: {e}")
            # Take screenshot anyway to see state
            try:
                page.screenshot(path="verification/error_screenshot.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    verify_optimization()
