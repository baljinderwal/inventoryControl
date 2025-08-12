from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the login page
    page.goto("http://localhost:5173/login")

    # Fill in the login form
    page.get_by_label("Email Address").fill("user@example.com")
    page.get_by_role("textbox", name="Password").fill("password")
    page.get_by_role("button", name="Sign In").click()

    # Expect to be redirected to the dashboard
    expect(page).to_have_url("http://localhost:5173/")

    # Click the account icon to open the menu
    page.get_by_label("account of current user").click()

    # Click the logout button
    page.get_by_role("menuitem", name="Logout").click()

    # Expect to be redirected to the login page
    expect(page).to_have_url("http://localhost:5173/login")

    # Take a screenshot of the login page
    page.screenshot(path="jules-scratch/verification/logout_verification.png")

    # Try to go to a protected route
    page.goto("http://localhost:5173/products")

    # Expect to be redirected back to the login page
    expect(page).to_have_url("http://localhost:5173/login")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
