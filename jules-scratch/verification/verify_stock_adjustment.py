from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/stock")

        # Wait for the table to load
        expect(page.locator("text=Stock Management")).to_be_visible(timeout=10000)

        # Find the "Adjust Stock" button for a product that has sizes.
        # Based on the db.json, "Laptop Sleeve" has sizes.
        page.get_by_role("row", name="Laptop Sleeve").get_by_role("button", name="Adjust Stock").click()

        # Wait for the dialog to appear
        expect(page.locator("text=Adjust Stock for Laptop Sleeve")).to_be_visible()

        # Select a batch (assuming the first batch has sizes)
        page.get_by_label("Batch").click()
        page.get_by_role("option", name="Batch: B001").click()

        # Wait for the size inputs to be visible
        expect(page.locator("text=Adjust Quantities by Size")).to_be_visible()

        # Adjust quantities for sizes
        page.get_by_label("13-inch (Current: 10)").fill("2")
        page.get_by_label("15-inch (Current: 15)").fill("3")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/stock_adjustment.png")

        print("Screenshot taken successfully")

    except Exception as e:
        print(f"An error occurred: {e}")
        print(page.content())


    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
