from playwright.sync_api import Page, expect

def test_add_product_with_color_options(page: Page):
    """
    This test verifies that a user can add a new product with multiple color options
    and that the color options are displayed correctly on the products page.
    """
    # 1. Arrange: Go to the products page.
    page.goto("http://localhost:5173/products")

    # 2. Act: Add a new product with color options.
    # Click the "Add Product" button.
    page.get_by_role("button", name="Add Product").click()

    # Fill in the product details.
    page.get_by_label("Product Name").fill("Test Product with Colors")
    page.get_by_label("SKU").fill("TPC-001")
    page.get_by_label("Category").fill("Test Category")
    page.get_by_label("Price").fill("100")
    page.get_by_label("Cost Price").fill("50")
    page.get_by_label("Low Stock Threshold").fill("10")

    # Add the first color option.
    page.get_by_label("Colors").click()
    page.get_by_role("option", name="Red").click()
    page.get_by_role("option", name="Black").click()
    page.get_by_label("Quantity").nth(0).fill("20")
    page.get_by_label("Ratio").nth(0).fill("1:1")

    # Add a second color option.
    page.get_by_role("button", name="Add Color Option").click()
    page.get_by_label("Colors").nth(1).click()
    page.get_by_role("option", name="Green").click()
    page.get_by_role("option", name="White").click()
    page.get_by_label("Quantity").nth(1).fill("30")
    page.get_by_label("Ratio").nth(1).fill("1:1:1")

    # Click the "Add Product" button to submit the form.
    page.get_by_role("button", name="Add Product").nth(1).click()

    # 3. Assert: Confirm the new product is displayed correctly.
    # Expect the table to contain the new product.
    expect(page.get_by_role("cell", name="Test Product with Colors")).to_be_visible()

    # Expect the table to show the color variations.
    expect(page.get_by_role("cell", name="Red")).to_be_visible()
    expect(page.get_by_role("cell", name="Black")).to_be_visible()
    expect(page.get_by_role("cell", name="Green")).to_be_visible()
    expect(page.get_by_role("cell", name="White")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/color_options.png")
