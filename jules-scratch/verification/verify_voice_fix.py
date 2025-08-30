from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173/products")
        # Wait for the loading spinner to disappear
        loading_spinner = page.locator('.MuiCircularProgress-root')
        expect(loading_spinner).to_have_count(0, timeout=60000)

        add_product_button = page.get_by_role("button", name="Add Product")
        add_product_button.click()

        # Check SKU field
        sku_mic_button = page.locator('input[name="sku"] + .MuiInputAdornment-root button')
        sku_mic_button.click()
        expect(page.get_by_text("Listening... Speak now.")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/sku_listening.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
