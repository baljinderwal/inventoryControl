import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:5173/login")
    page.get_by_role("textbox", name="Email").fill("admin@example.com")
    page.get_by_role("textbox", name="Password").fill("password")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page).to_have_url("http://localhost:5173/")

    # Go to stock page
    page.get_by_role("link", name="Stock").click()
    expect(page).to_have_url("http://localhost:5173/stock")

    # Add stock without a supplier
    page.get_by_role("button", name="Add Stock").click()
    page.get_by_label("Product").click()
    page.get_by_role("option", name="Wireless Mouse").click()
    page.get_by_label("Batch Number").fill("B-TEST-123")
    page.get_by_role("button", name="Add Stock").click()

    # Verify stock is added with no supplier
    expect(page.get_by_text("B-TEST-123")).to_be_visible(timeout=10000)
    # The row can be identified by the product name.
    row_locator = page.get_by_role("row", name=re.compile("Wireless Mouse"))
    # The supplier cell should be empty or have 'N/A'
    supplier_cell = row_locator.locator('td').nth(2)
    expect(supplier_cell).to_have_text(re.compile(r"N/A|"))
    page.screenshot(path="jules-scratch/verification/01_stock_added_no_supplier.png")

    # Add a supplier to the new stock
    row_locator.get_by_role("button", name="Adjust Stock").click()
    # The "Adjust Stock" dialog should be visible
    expect(page.get_by_role("heading", name="Adjust Stock for Wireless Mouse")).to_be_visible()
    page.get_by_label("Batch").click()
    page.get_by_role("option", name=re.compile("B-TEST-123")).click()
    page.get_by_label("Supplier").click()
    page.get_by_role("option", name="ElectroSupply").click()
    page.get_by_role("button", name="Update Supplier").click()

    # Verify supplier is updated
    expect(supplier_cell).to_have_text("ElectroSupply")
    page.screenshot(path="jules-scratch/verification/02_supplier_added.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
