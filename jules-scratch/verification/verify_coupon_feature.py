from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Give the server a long time to start
    time.sleep(30)

    # Navigate to the product detail page
    page.goto("http://localhost:5173/products/1")

    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")

    # Take a screenshot to debug
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    # Click the "Coupons" tab
    page.get_by_role("tab", name="Coupons").click()

    # Click the "Generate Coupon" button
    page.get_by_role("button", name="Generate Coupon").click()

    # Fill out the coupon form
    page.get_by_label("Discount Type").click()
    page.get_by_role("option", name="Percentage (%)").click()
    page.get_by_label("Discount Value").fill("10")

    # Click the "Generate" button
    page.get_by_role("button", name="Generate").click()

    # Go back to the details tab
    page.get_by_role("tab", name="Details").click()

    # Apply the coupon
    coupon_code_element = page.locator('//p[contains(text(), "No coupons generated yet.")]')
    if coupon_code_element.is_visible():
        # Handle case where no coupons are generated
        print("No coupons available to apply.")
    else:
        # Get the first coupon code from the list
        coupon_code = page.locator('//ul/li[1]/div/span[1]').inner_text()
        page.get_by_label("Coupon Code").fill(coupon_code)
        page.get_by_role("button", name="Apply").click()


    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/coupon_feature.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
