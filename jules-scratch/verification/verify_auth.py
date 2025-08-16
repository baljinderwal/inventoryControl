import time
from playwright.sync_api import sync_playwright, expect

def verify_auth_flow(page):
    # Generate a unique email using the current timestamp
    unique_email = f"testuser_{int(time.time())}@example.com"
    password = "Password123"
    name = "Test User"

    # --- Signup ---
    page.goto("http://localhost:5173/signup")

    # Fill out the signup form
    page.get_by_label("Full Name").fill(name)
    page.get_by_label("Email Address").fill(unique_email)
    page.get_by_label("Password", exact=True).fill(password)
    page.get_by_label("Confirm Password").fill(password)

    # Click the signup button
    page.get_by_role("button", name="Sign Up").click()

    # --- Login ---
    # The page should navigate to /login after signup
    expect(page).to_have_url("http://localhost:5173/login")

    # Wait for the success message to appear
    expect(page.get_by_text("Signup successful! Please log in.")).to_be_visible()

    # Fill out the login form
    page.get_by_label("Email Address").fill(unique_email)
    page.get_by_label("Password", exact=True).fill(password)

    # Click the login button
    page.get_by_role("button", name="Sign In").click()

    # --- Profile Page ---
    # Wait for navigation to the dashboard
    expect(page).to_have_url("http://localhost:5173/dashboard")

    # Navigate to the profile page
    page.goto("http://localhost:5173/profile")

    # Wait for the profile page to load and check for the user's name
    expect(page.get_by_role("heading", name=name)).to_be_visible()
    expect(page.get_by_text(unique_email)).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_auth_flow(page)
        browser.close()

if __name__ == "__main__":
    main()
