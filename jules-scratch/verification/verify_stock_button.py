from playwright.sync_api import sync_playwright, Page, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the home page
        page.goto("http://localhost:5173/")

        # Click the login button on the home page
        page.get_by_role("link", name="Login").click()

        # Wait for the login page to load
        expect(page).to_have_url("http://localhost:5173/login")

        # Fill in the login form
        page.get_by_label("Email Address").fill("admin@example.com")
        page.locator('#password').fill("password")

        # Click the Sign In button
        sign_in_button = page.get_by_role("button", name="Sign In", exact=True)
        expect(sign_in_button).to_be_enabled()
        sign_in_button.click()

        # Wait for navigation to the dashboard
        expect(page).to_have_url("http://localhost:5173/dashboard", timeout=30000)

        # Navigate to the products page
        page.goto("http://localhost:5173/products")

        # Wait for the page to be fully loaded
        page.wait_for_load_state('networkidle')

        # Click the "Add Product" button
        add_product_button = page.get_by_role("button", name="Add Product")
        add_product_button.click()

        # Wait for the dialog to appear
        dialog = page.get_by_role("dialog")
        expect(dialog).to_be_visible()

        # Check that the "Add Stock" button is visible
        add_stock_button = dialog.get_by_role("button", name="Add Stock")
        expect(add_stock_button).to_be_visible()

        # Take a screenshot of the initial state
        page.screenshot(path="jules-scratch/verification/01_before_add_stock.png")

        # Click the "Add Stock" button
        add_stock_button.click()

        # Check that the "Stock" accordion is now visible
        stock_accordion_header = dialog.get_by_role("button", name="Stock")
        expect(stock_accordion_header).to_be_visible()

        # Take a screenshot of the state after clicking "Add Stock"
        page.screenshot(path="jules-scratch/verification/02_after_add_stock.png")

    except Exception as e:
        page.screenshot(path="jules-scratch/verification/error.png")
        print(page.content())
        raise e
    finally:
        # Clean up
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
