import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Set a higher timeout for all actions
    page.set_default_timeout(15000) # Increased timeout

    try:
        # 1. Login
        page.goto("http://localhost:5173/login")
        page.get_by_label("Email Address").fill("admin@example.com")
        page.get_by_role("textbox", name="Password").fill("password")
        page.get_by_role("button", name="Sign In").click()
        expect(page).to_have_url("http://localhost:5173/")

        # 2. Navigate to Orders page
        page.get_by_role("link", name="Orders").click()
        expect(page).to_have_url("http://localhost:5173/orders")

        # Wait for network activity to cease before interacting
        page.wait_for_load_state('networkidle')

        expect(page.get_by_role("heading", name="Purchase Orders")).to_be_visible()

        # 3. Open the "New Order" form
        new_order_button = page.get_by_role("button", name="New Order")
        expect(new_order_button).to_be_enabled()
        new_order_button.click()

        # Wait for the dialog container to be visible
        dialog = page.get_by_role("dialog")
        expect(dialog).to_be_visible()

        # Now, look for the title within the dialog
        dialog_title = dialog.get_by_role("heading", name="Create New Purchase Order")
        expect(dialog_title).to_be_visible()

        # 4. Fill out the form
        dialog.get_by_label("Supplier").click()
        page.get_by_role("option", name="ElectroSupply").click()

        dialog.get_by_label("Product").click()
        page.get_by_role("option", name=re.compile("Wireless Mouse")).click()

        dialog.get_by_label("Quantity").fill("10")

        # 5. Submit the form
        dialog.get_by_role("button", name="Create Order").click()

        # 6. Wait for success notification
        expect(page.get_by_text("Order created successfully!")).to_be_visible()

        # 7. Take a screenshot showing the new order in the table
        expect(page.get_by_role("cell", name="ElectroSupply")).to_be_visible()
        expect(page.get_by_role("cell", name="Pending")).to_be_visible()

        page.screenshot(path="jules-scratch/verification/orders_page_with_new_order.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
