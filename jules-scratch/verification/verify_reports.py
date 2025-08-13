import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_reports(page: Page):
    """
    This script verifies the new reporting features.
    """
    # 1. Login
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url(re.compile(".*localhost:5173/$"))

    # 2. Navigate to Reports Dashboard
    page.get_by_role("link", name="Reports").click()
    expect(page).to_have_url(re.compile(".*localhost:5173/reports$"))

    # Take a screenshot of the reports dashboard
    page.screenshot(path="jules-scratch/verification/reports_dashboard.png")

    # 3. Verify Low Stock Report
    page.get_by_role("link", name="Low Stock Alerts").click()
    expect(page).to_have_url(re.compile(".*localhost:5173/reports/low-stock$"))
    # Wait for the table to be visible
    expect(page.get_by_role("table")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/low_stock_report.png")

    # 4. Verify Sales History Report
    page.get_by_role("link", name="Reports").click() # Go back to dashboard
    page.get_by_role("link", name="Sales History").click()
    expect(page).to_have_url(re.compile(".*localhost:5173/reports/sales-history$"))
    # Wait for the chart to be visible
    expect(page.locator(".recharts-surface")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/sales_history_report.png")

    # 5. Verify Profitability Report
    page.get_by_role("link", name="Reports").click() # Go back to dashboard
    page.get_by_role("link", name="Profitability Report").click()
    expect(page).to_have_url(re.compile(".*localhost:5173/reports/profitability$"))
    # Wait for the chart to be visible
    expect(page.locator(".recharts-surface")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/profitability_report.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_reports(page)
        browser.close()

if __name__ == "__main__":
    main()
