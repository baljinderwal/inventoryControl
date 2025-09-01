from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password", exact=True).fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Go to stock page
    page.goto("http://localhost:5173/stock")
    expect(page).to_have_url("http://localhost:5173/stock")

    # Open add stock modal
    page.get_by_role("button", name="Add Stock").click()

    # Select product
    page.get_by_label("Product").click()
    page.get_by_role("option", name="Wireless Mouse").click()

    # Take screenshot of size inputs
    page.screenshot(path="jules-scratch/verification/size_inputs.png")

    # Fill form
    page.get_by_label("Size S").fill("10")
    page.get_by_label("Size M").fill("20")
    page.get_by_label("Size L").fill("30")
    page.get_by_label("Batch Number").fill("B-12345")
    page.get_by_label("Expiry Date").fill("2025-12-31")
    page.get_by_role("button", name="Add Stock").click()

    # Open details modal
    page.get_by_role("button", name="View Details").first.click()

    # Take screenshot of details modal
    page.screenshot(path="jules-scratch/verification/stock_details.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
