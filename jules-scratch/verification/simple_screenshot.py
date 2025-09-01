from playwright.sync_api import sync_playwright

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/products", timeout=10000)
        page.wait_for_timeout(5000) # wait for 5 seconds
        page.screenshot(path="jules-scratch/verification/simple_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
