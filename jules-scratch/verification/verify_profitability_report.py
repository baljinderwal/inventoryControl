from playwright.sync_api import sync_playwright, Page, expect

def verify_profitability_report(page: Page):
    """
    This script verifies that the Profitability Report page loads correctly
    after the data structure refactoring.
    """
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:5173/login")

    # 2. Act: Log in as an admin user.
    page.get_by_label("Email").fill("admin@example.com")
    # Use a more specific locator for the password field to avoid ambiguity
    page.get_by_role("textbox", name="Password").fill("password")

    # Corrected the button name from "Login" to "SIGN IN"
    page.get_by_role("button", name="SIGN IN").click()

    # 3. Act: Navigate to the Profitability report.
    # Expect the main page to load, then click the link.
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()
    page.get_by_role("link", name="Profitability").click()

    # 4. Assert: Confirm the report page has loaded.
    # We expect the heading to be visible.
    expect(page.get_by_role("heading", name="Profitability Report")).to_be_visible()

    # Also wait for the chart to appear to ensure data has been processed.
    expect(page.get_by_text("Top 5 Most Profitable Products")).to_be_visible()

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="inventory-frontend/jules-scratch/verification/profitability_report.png", full_page=True)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_profitability_report(page)
        browser.close()

if __name__ == "__main__":
    main()
