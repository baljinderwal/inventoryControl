from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the page with the form
    page.goto("http://localhost:5174/products")

    # It's likely we need to log in first.
    # Fill in the email and password fields
    page.fill('input[name="email"]', 'admin@example.com')
    page.fill('input[name="password"]', 'password')

    # Click the login button and wait for navigation
    page.click('button[type="submit"]')
    try:
        page.wait_for_url("http://localhost:5174/products", timeout=10000)
    except Exception:
        page.screenshot(path="jules-scratch/verification/login_failed.png")
        raise

    # Wait for the "Add Product" button to be visible.
    add_product_button = page.locator("button:has-text('Add Product')")
    expect(add_product_button).to_be_visible()

    # Click the "Add Product" button to open the form
    add_product_button.click()

    # Verify the "Add Stock" button is visible and the stock info is not
    add_stock_button = page.locator("button:has-text('Add Stock')")
    expect(add_stock_button).to_be_visible()

    stock_info_header = page.locator("text=Stock Information")
    expect(stock_info_header).not_to_be_visible()

    page.screenshot(path="jules-scratch/verification/before_click.png")

    # Click the "Add Stock" button
    add_stock_button.click()

    # Verify the "Stock Information" section is now visible
    expect(stock_info_header).to_be_visible()
    page.screenshot(path="jules-scratch/verification/after_click.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
