from playwright.sync_api import sync_playwright, expect
import time

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

    # Create a new product
    page.goto("http://localhost:5173/products")
    page.get_by_role("button", name="Add Product").click()

    product_name = f"Test Product {int(time.time())}"
    page.get_by_label("Product Name").fill(product_name)
    page.get_by_label("SKU").fill(f"TP-{int(time.time())}")
    page.get_by_label("Category").fill("Test Category")
    page.get_by_label("Cost Price").fill("10")
    page.get_by_label("Selling Price").fill("20")
    page.get_by_label("Low Stock Threshold").fill("5")

    page.get_by_role("button", name="Add Product").click()
    page.wait_for_timeout(1000) # wait for UI to update

    # Go to stock page
    page.goto("http://localhost:5173/stock")
    expect(page).to_have_url("http://localhost:5173/stock")

    # Add stock to the new product
    page.get_by_role("button", name="Add Stock").click()
    page.get_by_label("Product").click()
    page.get_by_role("option", name=product_name).click()
    page.get_by_label("Size 6").fill("5")
    page.get_by_label("Size 7").fill("5")
    page.get_by_label("Size 8").fill("5")
    page.get_by_label("Size 9").fill("5")
    page.get_by_role("button", name="Add Stock").click()
    page.wait_for_timeout(1000) # wait for UI to update

    # Verify stock was added
    expect(page.locator(f"text={product_name}")).to_be_visible()

    # Take screenshot
    page.screenshot(path="jules-scratch/verification/new_product_stock.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
