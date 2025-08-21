import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # 1. Login
            await page.goto("http://localhost:5173/login")
            await page.get_by_label("Email").fill("admin@example.com")
            await page.get_by_label("Password").fill("password")
            await page.get_by_role("button", name="Login").click()

            # Wait for navigation to dashboard after login
            await expect(page).to_have_url("http://localhost:5173/dashboard")

            # 2. Navigate to Barcode Generator page
            await page.get_by_role("link", name="Barcode Generator").click()
            await expect(page).to_have_url("http://localhost:5173/products/barcode-generator")
            await expect(page.get_by_role("heading", name="Barcode Generator")).to_be_visible()

            # 3. Select a product
            await page.get_by_label("Select Product").click()
            # The product name is "Wireless Mouse" from db.json
            await page.get_by_role("option", name="Wireless Mouse").click()

            # 4. Verify barcode is visible
            # The barcode component renders as an <svg> or <img> inside the box
            barcode_container = page.locator(".printable-area")
            await expect(barcode_container.locator("svg, img")).to_be_visible()

            # 5. Take screenshot
            await page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

asyncio.run(main())
