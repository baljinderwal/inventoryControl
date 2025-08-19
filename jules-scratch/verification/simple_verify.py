from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_role("textbox", name="Password").fill("password")
    page.wait_for_timeout(1000) # 1 second delay
    print("Clicking login button")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Navigate to Products page
    page.goto("http://localhost:5173/products")
    page.screenshot(path="jules-scratch/verification/products_page.png")

    # Navigate to Stock page
    page.goto("http://localhost:5173/stock")
    page.screenshot(path="jules-scratch/verification/stock_page.png")

    # Navigate to Sales Orders page
    page.goto("http://localhost:5173/sales-orders")
    page.screenshot(path="jules-scratch/verification/sales_orders_page.png")

    # Navigate to Reports page
    page.goto("http://localhost:5173/reports")
    page.screenshot(path="jules-scratch/verification/reports_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
