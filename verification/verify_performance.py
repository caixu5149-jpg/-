from playwright.sync_api import sync_playwright

def verify_pixel_ratio(page):
    page.goto('http://localhost:8080')
    # Wait for canvas
    page.wait_for_selector('canvas')
    # Wait for init
    page.wait_for_timeout(2000)

    # Get DPR
    dpr = page.evaluate("window.devicePixelRatio")
    print(f"Window Device Pixel Ratio: {dpr}")

    # Get canvas dimensions
    width = page.evaluate("document.querySelector('canvas').width")
    client_width = page.evaluate("document.querySelector('canvas').clientWidth")

    if client_width == 0:
        print("Error: client_width is 0")
        return

    ratio = width / client_width
    print(f"Canvas Width: {width}")
    print(f"Client Width: {client_width}")
    print(f"Calculated Backing Ratio: {ratio}")

    # We expect ratio to be min(dpr, 2)
    # Since dpr=3, expected=2
    expected = 2.0

    if abs(ratio - expected) < 0.1:
        print("PASS: Pixel Ratio successfully capped at 2.0")
    else:
        print(f"FAIL: Pixel Ratio is {ratio}, expected {expected}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate high DPI device
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            device_scale_factor=3.0
        )
        page = context.new_page()
        try:
            verify_pixel_ratio(page)
        finally:
            browser.close()
