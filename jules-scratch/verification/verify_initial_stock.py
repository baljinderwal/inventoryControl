from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:5173/login", wait_until="load", timeout=60000)
    page.wait_for_selector('button:has-text("Login")')
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password", exact=True).fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Create a new product with initial stock
    page.goto("http://localhost:5173/products")
    page.get_by_role("button", name="Add Product").click()

    product_name = f"Test Shoe {int(time.time())}"
    page.get_by_label("Product Name").fill(product_name)
    page.get_by_label("SKU").fill(f"TS-{int(time.time())}")
    page.get_by_label("Category").fill("Shoes")
    page.get_by_label("Cost Price").fill("50")
    page.get_by_label("Selling Price").fill("100")
    page.get_by_label("Low Stock Threshold").fill("10")

    page.get_by_label("Quantity").nth(0).fill("5") # Size 6
    page.get_by_label("Quantity").nth(1).fill("10") # Size 7
    page.get_by_label("Quantity").nth(2).fill("15") # Size 8
    page.get_by_label("Quantity").nth(3).fill("20") # Size 9

    page.get_by_role("button", name="Add Product").click()
    page.wait_for_timeout(2000) # wait for UI to update

    # Go to stock page
    page.goto("http://localhost:5173/stock")
    expect(page).to_have_url("http://localhost:5173/stock")

    # Verify stock is listed correctly
    expect(page.locator(f"text={product_name}")).to_be_visible()
    expect(page.locator(f"text=50")).to_be_visible() # Total stock

    # Open details modal and verify batch details
    page.locator(f"tr:has-text(\"{product_name}\")").get_by_role("button", name="View Details").click()

    expect(page.locator("text=Size 6: 5, Size 7: 10, Size 8: 15, Size 9: 20")).to_be_visible()

    # Take screenshot
    page.screenshot(path="jules-scratch/verification/initial_stock_details.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
