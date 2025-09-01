from playwright.sync_api import sync_playwright, expect
import base64
import json

def create_fake_jwt(payload):
    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).rstrip(b'=').decode()
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b'=').decode()
    return f"{encoded_header}.{encoded_payload}."

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Create a fake JWT for an admin user
        fake_token = create_fake_jwt({"role": "Admin", "name": "Test User", "email": "test@test.com"})

        # Set the token in localStorage before navigating
        page.add_init_script(f"""
            localStorage.setItem('authToken', '{fake_token}');
            localStorage.setItem('apiMode', 'api');
        """)

        page.goto("http://localhost:5173/products", timeout=20000)
        page.wait_for_timeout(10000) # wait for 10 seconds
        page.screenshot(path="jules-scratch/verification/debug_login_api_mode.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
