from playwright.sync_api import sync_playwright, Page, expect

def verify_size_presets(page: Page):
    """
    This test verifies that the size preset buttons on the Add Product
    form work correctly.
    """
    # 1. Navigate to the app and log in
    page.goto("http://localhost:5173/")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()

    # 2. Navigate to the Products page and open the Add Product form
    page.get_by_role("link", name="Products").click()
    page.get_by_role("button", name="Add Product").click()

    # 3. Test the 'Adult' preset (default) and take a screenshot
    expect(page.get_by_label("Size").first).to_have_value("6")
    page.screenshot(path="jules-scratch/verification/01_adult_preset.png")

    # 4. Test the 'Boy' preset
    page.get_by_role("button", name="Boy").click()
    expect(page.get_by_label("Size").first).to_have_value("4")
    page.screenshot(path="jules-scratch/verification/02_boy_preset.png")

    # 5. Test the 'Toddler' preset
    page.get_by_role("button", name="Toddler").click()
    expect(page.get_by_label("Size").first).to_have_value("8")
    page.screenshot(path="jules-scratch/verification/03_toddler_preset.png")

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_size_presets(page)
        browser.close()

if __name__ == "__main__":
    run_test()
