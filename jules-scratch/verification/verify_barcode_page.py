import asyncio
from playwright.async_api import async_playwright, expect
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Mock the login API call
        await page.route("https://inventorybackend-loop.onrender.com/auth/login",
            lambda route: route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({"token": "fake_header.eyJyb2xlIjoiQWRtaW4ifQ.fake_signature"})
            )
        )

        try:
            # 1. Login
            await page.goto("http://localhost:5173/login")
            await page.get_by_label("Email Address").fill("admin@example.com")
            await page.locator('input[name="password"]').fill("password")
            await page.get_by_role("button", name="Sign In", exact=True).click()

            await expect(page).to_have_url("http://localhost:5173/dashboard", timeout=10000)

            # 2. Navigate to Barcode Generator page
            await page.get_by_role("link", name="Barcode Generator").click()
            await expect(page).to_have_url("http://localhost:5173/products/barcode-generator")
            await expect(page.get_by_role("heading", name="Barcode Generator")).to_be_visible()

            # 3. Select a product
            await page.get_by_label("Select Product").click()
            await page.get_by_role("option", name="Wireless Mouse").click()

            # 4. Wait for the UI to update and then change number of copies
            # Use a more specific locator for the TextField's input
            copies_input = page.locator('div:has(label:has-text("Number of Copies")) >> input')
            await expect(copies_input).to_be_visible()
            await copies_input.fill("3")

            # 5. Verify on-screen preview is visible
            await expect(page.locator(".no-print .MuiTypography-h6")).to_have_text("Wireless Mouse")
            await expect(page.locator(".no-print svg")).to_be_visible()

            # 6. Take screenshot
            await page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

asyncio.run(main())
