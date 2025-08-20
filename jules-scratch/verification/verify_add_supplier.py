import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Login
            await page.goto("http://localhost:5173/login")
            await page.wait_for_load_state()
            await page.screenshot(path="jules-scratch/verification/login_page_before_fill.png")
            await page.get_by_label("Email").fill("admin@example.com")
            await page.get_by_role("textbox", name="Password").fill("password")
            await page.get_by_role("button", name="Sign In", exact=True).click()
            await page.screenshot(path="jules-scratch/verification/after_login_click.png")
            await page.wait_for_url("http://localhost:5173/dashboard", timeout=60000)

            # Go to suppliers page
            await page.goto("http://localhost:5173/suppliers")
            await expect(page.get_by_role("heading", name="Suppliers")).to_be_visible()

            # Click add supplier button
            await page.get_by_role("button", name="Add Supplier").click()
            await expect(page.get_by_role("heading", name="Add Supplier")).to_be_visible()

            # Fill the form
            await page.get_by_label("Supplier Name").fill("Test Supplier")
            await page.get_by_label("Contact Person").fill("Test Contact")
            await page.get_by_label("Email").fill("test@supplier.com")

            # Select products
            await page.get_by_label("Products").click()
            await page.get_by_role("option", name="Wireless Mouse").click()
            # Click somewhere else to close the dropdown
            await page.get_by_role("heading", name="Add Supplier").click()

            # Take a screenshot of the form
            await page.screenshot(path="jules-scratch/verification/add_supplier_form.png")

            # Submit the form
            await page.get_by_role("button", name="Add Supplier").nth(1).click()

            # Wait for the dialog to disappear
            await expect(page.get_by_role("heading", name="Add Supplier")).not_to_be_visible()

            # Take a screenshot of the suppliers page
            await page.screenshot(path="jules-scratch/verification/suppliers_page.png")

            # Verify the new supplier is in the table
            await expect(page.get_by_role("cell", name="Test Supplier")).to_be_visible()
            await expect(page.get_by_role("cell", name="Test Contact")).to_be_visible()
            await expect(page.get_by_role("cell", name="test@supplier.com")).to_be_visible()


        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
