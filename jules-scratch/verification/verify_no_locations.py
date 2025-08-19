from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:5173/login")
    page.screenshot(path="jules-scratch/verification/login_page.png")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_role("textbox", name="Password").fill("password")
    page.get_by_role("button", name="Sign In", exact=True).click()
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # 1. Verify Product Detail Page
    page.goto("http://localhost:5173/products")
    page.get_by_role("link", name="Wireless Mouse").click()
    expect(page.get_by_text("Stock Level")).to_be_visible()
    expect(page.get_by_text("Total units available")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/product_detail.png")

    # 2. Verify Stock Page
    page.goto("http://localhost:5173/stock")
    expect(page.get_by_role("button", name="Transfer Stock")).not_to_be_visible()
    page.screenshot(path="jules-scratch/verification/stock_page.png")

    # Get initial stock of a product
    initial_stock_text = page.locator('tr:has-text("Wireless Mouse") td').nth(2).inner_text()
    initial_stock = int(initial_stock_text)

    # 3. Verify Sales Order creation and stock deduction
    page.goto("http://localhost:5173/sales-orders")
    page.get_by_role("button", name="Create Sales Order").click()
    page.get_by_label("Customer").click()
    page.get_by_role("option", name="John Smith").click()
    page.get_by_label("Product").click()
    page.get_by_role("option", name="Wireless Mouse").click()
    page.get_by_label("Quantity").fill("5")
    page.get_by_role("button", name="Create SO").click()

    # Mark the order as completed
    page.get_by_role("button", name="Edit").first.click()
    page.get_by_label("Status").click()
    page.get_by_role("option", name="Completed").click()
    page.get_by_role("button", name="Update SO").click()

    # 4. Verify stock deduction
    page.goto("http://localhost:5173/stock")
    page.screenshot(path="jules-scratch/verification/stock_after_sale.png")

    expected_stock = initial_stock - 5

    # Assert that the stock has been updated
    expect(page.locator('tr:has-text("Wireless Mouse") td').nth(2)).to_have_text(str(expected_stock))


    browser.close()

with sync_playwright() as playwright:
    run(playwright)
