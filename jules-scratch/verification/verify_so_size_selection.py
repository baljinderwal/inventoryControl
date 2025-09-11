from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/")

        # Click on the "Sales" link in the sidebar
        page.wait_for_selector('a[href="/sales/orders"]', timeout=60000)
        page.locator('a[href="/sales/orders"]').click()

        # Click the "Create New Sales Order" button
        page.wait_for_selector('button:has-text("New Sales Order")', timeout=60000)
        page.locator('button:has-text("New Sales Order")').click()

        # Select a customer
        page.wait_for_selector('label:has-text("Customer") + div', timeout=60000)
        page.locator('label:has-text("Customer") + div').click()
        page.locator('li[data-value="1"]').click()

        # Select a product
        page.locator('label:has-text("Product") + div').first.click()
        page.locator('li[data-value="1"]').click() # Wireless Mouse

        # Select a size
        page.locator('label:has-text("Size") + div').first.click()
        page.locator('li[data-value="M"]').click()

        # Enter quantity
        page.locator('label:has-text("Quantity") + div input').first.fill("2")

        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
