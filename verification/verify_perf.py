
from playwright.sync_api import sync_playwright
import time

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--use-gl=egl'])
        page = browser.new_page()

        # Start a local server for the app in background (assume user handles it or we do it)
        # Since I cannot easily start a server and keep it running in background and then run python in same command...
        # I will rely on file:// protocol if possible or start server in background.

        # Let's try file protocol first, but ES modules usually require HTTP.
        # So I will start a python http server in background.

        # Wait for server to start?
        # I will assume the server is started by me in a separate tool call before this.

        page.goto('http://localhost:8000')

        # Wait for canvas to load
        page.wait_for_selector('canvas', timeout=10000)

        # Wait a bit for particles to spawn
        time.sleep(2)

        # Take screenshot
        page.screenshot(path='verification/screenshot.png')
        print('Screenshot taken')
        browser.close()

if __name__ == '__main__':
    verify_app()
