from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

    try:
        # Go to the site to set the local storage
        page.goto("http://localhost:5173/", timeout=60000)

        # Set a dummy JWT token in local storage to bypass login
        fake_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        page.evaluate(f"localStorage.setItem('authToken', '{fake_jwt}')")

        # Navigate to the dashboard page
        page.goto("http://localhost:5173/dashboard", timeout=60000)

        # Wait for a bit to see if any console errors appear
        page.wait_for_timeout(5000)

        # Now, try to find the widget title again, but with a shorter timeout
        widget_title = page.get_by_role("heading", name="Inventory Breakdown")
        expect(widget_title).to_be_visible(timeout=10000)

        # If the title is visible, the dashboard has loaded.
        # Now, let's test the chart functionality.
        widget = page.locator('.MuiPaper-root', has=widget_title)
        dropdown = widget.get_by_label("Chart Type")
        expect(dropdown).to_be_visible()
        dropdown.click()

        page.get_by_role("option", name="Analysis").click()

        sunburst_chart = widget.locator("canvas")
        expect(sunburst_chart).to_be_visible()

        page.screenshot(path="jules-scratch/verification/sunburst_verification.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
