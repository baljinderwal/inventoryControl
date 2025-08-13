from playwright.sync_api import sync_playwright, Page, expect

def verify_features(page: Page):
    """
    This script verifies the new batch tracking features.
    1. Logs in as a manager.
    2. Navigates to the Stock page and verifies the expandable rows.
    3. Navigates to the new Inventory Expiry report and verifies it.
    """
    # 1. Login
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("manager@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

    # 2. Verify Stock Page
    page.get_by_role("link", name="Stock").click()
    expect(page.get_by_role("heading", name="Stock Management")).to_be_visible()

    # Find the first row's expand button and click it
    # We target the first button with the aria-label "expand row"
    expand_button = page.get_by_label("expand row").first
    expect(expand_button).to_be_visible()
    expand_button.click()

    # Wait for the "Batches" heading in the collapsed section to be visible
    expect(page.get_by_role("heading", name="Batches")).to_be_visible()

    # Take a screenshot of the stock page with the expanded row
    page.screenshot(path="jules-scratch/verification/stock_page.png")

    # 3. Verify Expiry Report Page
    page.get_by_role("link", name="Reports").click()

    # Click the tab for the new report
    page.get_by_role("tab", name="Inventory Expiry").click()

    # Wait for the report heading to be visible
    expect(page.get_by_role("heading", name="Inventory Expiry Report")).to_be_visible()

    # Take a screenshot of the report page
    page.screenshot(path="jules-scratch/verification/expiry_report.png")

# --- Boilerplate to run the script ---
def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_features(page)
        browser.close()

if __name__ == "__main__":
    main()
