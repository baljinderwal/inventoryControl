from playwright.sync_api import sync_playwright, expect
import base64
import json

def create_fake_jwt(payload):
    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).rstrip(b'=').decode()
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b'=').decode()
    return f"{encoded_header}.{encoded_payload}."

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Create a fake JWT for an admin user
        fake_token = create_fake_jwt({"role": "Admin", "name": "Test User", "email": "test@test.com"})

        # Set auth token and API mode to 'api'
        page.add_init_script(f"""
            localStorage.setItem('authToken', '{fake_token}');
            localStorage.setItem('apiMode', 'api');
        """)

        page.goto("http://localhost:5173/products")

        # Wait for the main heading to be visible, indicating the page is loaded
        expect(page.get_by_role("heading", name="Products")).to_be_visible(timeout=10000)

        # 1. Initial screenshot
        page.screenshot(path="jules-scratch/verification/01_default_view.png")

        # 2. Click the column visibility button
        column_button = page.get_by_test_id("column-visibility-button")
        expect(column_button).to_be_visible()
        column_button.click()

        # 3. Uncheck 'SKU' and 'Category'
        page.get_by_label("SKU").uncheck()
        page.get_by_label("Category").uncheck()

        # Take screenshot with menu open
        page.screenshot(path="jules-scratch/verification/02_menu_open_unchecked.png")

        # Click somewhere else to close the menu
        page.get_by_role("heading", name="Products").click()

        # 4. Screenshot with columns hidden
        page.screenshot(path="jules-scratch/verification/03_columns_hidden.png")

        # 5. Re-open menu and re-check 'SKU'
        column_button.click()
        page.get_by_label("SKU").check()

        # Take screenshot with menu open
        page.screenshot(path="jules-scratch/verification/04_menu_open_rechecked.png")

        # Click somewhere else to close the menu
        page.get_by_role("heading", name="Products").click()

        # 6. Final screenshot with SKU visible again
        page.screenshot(path="jules-scratch/verification/05_sku_re-added.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
