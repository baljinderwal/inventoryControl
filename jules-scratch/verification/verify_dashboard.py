from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Arrange: Go to the dashboard page.
        page.goto("http://localhost:5173/")

        # 2. Assert: Check for login page and login if necessary
        if "login" in page.url:
            page.get_by_label("Email").fill("admin@example.com")
            page.get_by_label("Password").fill("password")
            page.get_by_role("button", name="Login").click()

        # Wait for navigation to the dashboard after login
        page.wait_for_url("http://localhost:5173/")

        # Wait for the main dashboard heading to be visible
        dashboard_heading = page.get_by_role("heading", name="Dashboard")
        expect(dashboard_heading).to_be_visible()

        # 3. Assert: Wait for the "Revenue" card to be visible and have a value.
        revenue_card = page.locator('.MuiCard-root:has-text("Revenue")')
        revenue_value = revenue_card.locator('[class*="MuiTypography-h5"]')

        # We expect the value to contain a dollar sign.
        expect(revenue_value).to_contain_text('$')

        # 4. Assert: Wait for the sales trend chart to be visible.
        sales_chart = page.locator('div:has(h6:has-text("Sales Trends")) >> .recharts-responsive-container')
        expect(sales_chart).to_be_visible()

        # 5. Screenshot: Capture the final result for visual verification.
        os.makedirs("jules-scratch/verification", exist_ok=True)
        page.screenshot(path="jules-scratch/verification/dashboard_analytics.png")

        browser.close()

if __name__ == "__main__":
    run()
