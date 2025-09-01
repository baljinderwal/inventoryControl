from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:5173/login", wait_until="load")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password", exact=True).fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Go to stock page
    page.goto("http://localhost:5173/stock")
    expect(page).to_have_url("http://localhost:5173/stock")

    # Add stock for the first time
    page.get_by_role("button", name="Add Stock").click()
    page.get_by_label("Product").click()
    page.get_by_role("option", name="Wireless Mouse").click()
    page.get_by_label("Size S").fill("1")
    page.get_by_label("Size M").fill("1")
    page.get_by_label("Size L").fill("1")
    page.get_by_role("button", name="Add Stock").click()
    page.wait_for_timeout(1000) # wait for UI to update

    # Add stock for the second time
    page.get_by_role("button", name="Add Stock").click()
    page.get_by_label("Product").click()
    page.get_by_role("option", name="Wireless Mouse").click()
    page.get_by_label("Size S").fill("2")
    page.get_by_label("Size M").fill("2")
    page.get_by_label("Size L").fill("2")
    page.get_by_role("button", name="Add Stock").click()
    page.wait_for_timeout(1000) # wait for UI to update

    # Open details modal
    page.get_by_role("button", name="View Details").first.click()

    # Verify that there are two batches
    expect(page.locator("text=B-2")).to_be_visible()
    expect(page.locator("text=B-3")).to_be_visible()

    # Take screenshot of details modal
    page.screenshot(path="jules-scratch/verification/stock_update_details.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
