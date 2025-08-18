from playwright.sync_api import sync_playwright, expect
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Create a fake JWT token
        header = {"alg": "HS256", "typ": "JWT"}
        payload = {"role": "Admin", "name": "Test User", "iat": 1516239022}

        def to_base64_url(data):
            import base64
            return base64.urlsafe_b64encode(json.dumps(data).encode()).rstrip(b'=').decode()

        encoded_header = to_base64_url(header)
        encoded_payload = to_base64_url(payload)
        fake_token = f"{encoded_header}.{encoded_payload}."

        # Create a context and set the local storage
        context = browser.new_context(
            storage_state={
                "origins": [
                    {
                        "origin": "http://localhost:5177",
                        "localStorage": [
                            {"name": "authToken", "value": fake_token}
                        ],
                    }
                ]
            }
        )
        page = context.new_page()

        # Navigate to the product 9 detail page
        page.goto("http://localhost:5177/products/9")

        # Wait for a bit to let the page load
        page.wait_for_timeout(5000)

        # Take a screenshot
        screenshot_path = "jules-scratch/verification/routing_fix.png"
        page.screenshot(path=screenshot_path)

        browser.close()
        print(f"Screenshot saved to {screenshot_path}")

run()
