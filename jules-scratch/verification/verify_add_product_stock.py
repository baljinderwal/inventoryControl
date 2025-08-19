from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_role("textbox", name="Password").fill("password")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Navigate to Products page
    page.goto("http://localhost:5173/products")
    page.get_by_role("button", name="Add Product").click()

    # Fill out the form
    product_name = f"Test Product {int(time.time())}"
    page.get_by_label("Product Name").fill(product_name)
    page.get_by_label("SKU").fill("TEST-SKU")
    page.get_by_label("Category").fill("Test Category")
    page.get_by_label("Price").fill("10")
    page.get_by_label("Cost Price").fill("5")
    page.get_by_label("Low Stock Threshold").fill("5")
    page.get_by_label("Initial Stock").fill("100")
    page.get_by_label("Batch Number").fill("B-TEST")
    page.get_by_label("Expiry Date").fill("2025-12-31")

    page.get_by_role("button", name="Add Product").click()

    # Navigate to Stock page and verify
    page.goto("http://localhost:5173/stock")

    # Take a screenshot for visual confirmation
    page.screenshot(path="jules-scratch/verification/stock_page_with_new_product.png")

    # Assert that the new product is in the table with the correct stock
    expect(page.locator(f'tr:has-text("{product_name}") td').nth(2)).to_have_text("100")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
