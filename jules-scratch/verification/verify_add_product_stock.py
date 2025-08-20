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

    # Read db.json after adding the product
    with open('db.json', 'r') as f:
        db_after = f.read()

    with open('jules-scratch/verification/db_after_add.json', 'w') as f:
        f.write(db_after)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
