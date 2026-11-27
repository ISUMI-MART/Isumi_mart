
import { test, expect } from '@playwright/test';

// CUS_UI001 - Verify customer home page display
test('CUS_UI001 - Verify customer home page display', async ({ page }) => {
    await page.goto('/');

    // Verify hero section
    await expect(
        page.getByRole('heading', {
            name: /your neighborhood grocer, at your door/i,
        })
    ).toBeVisible();

    // Verify shop button
    await expect(
        page.getByRole('link', { name: /shop fresh essentials/i })
    ).toBeVisible();

    // Verify categories section
    await expect(
        page.getByRole('heading', { name: /browse our market/i })
    ).toBeVisible();

    // Verify products section
    await expect(
        page.getByRole('heading', { name: /fresh from the shelves/i })
    ).toBeVisible();
});


// CUS_UI002 - Verify product listing page display
test('CUS_FN002 - Verify product listing page display', async ({ page }) => {
    await page.goto('/products');

    // Verify page heading
    await expect(
        page.getByRole('heading', { name: 'Products' })
    ).toBeVisible();

    // Verify search input
    await expect(
        page.getByPlaceholder('Search products...')
    ).toBeVisible();

    // Verify category filter
    await expect(
        page.getByRole('button', { name: 'All', exact: true })
    ).toBeVisible();

    // Wait until products finish loading
    await expect(page.getByText('Loading products...')).not.toBeVisible();

    // Verify product grid or empty message
    const productGrid = page.locator('.product-grid');
    const emptyMessage = page.getByRole('heading', {
        name: 'No products found',
    });

    await expect(productGrid.or(emptyMessage)).toBeVisible();
});



test('CUS_FN003 - Verify product search', async ({ page }) => {
    await page.goto('/products');

    const searchInput = page.getByPlaceholder('Search products...');

    await searchInput.fill('Mango');

    await expect(page).toHaveURL(/search=Mango/);

    await expect(page.getByText('Loading products...')).toBeHidden();

    const productGrid = page.locator('.product-grid');
    const emptyMessage = page.getByRole('heading', {
        name: 'No products found',
    });

    await expect(productGrid.or(emptyMessage)).toBeVisible();

    const productCards = productGrid.locator('.product-card');

    if (await productCards.count() > 0) {
        await expect(productGrid).toContainText(/Mango/i);
    } else {
        await expect(emptyMessage).toBeVisible();
    }
});


test('CUS_FN004 - Verify product details', async ({ page }) => {
    await page.goto('/products');

    // Wait until products are loaded
    await expect(page.getByText('Loading products...')).toBeHidden();

    // Get the first available product name
    const firstProduct = page.locator('.product-name-link').first();

    // Get the product name before clicking
    const productName = await firstProduct.textContent();

    // Click the product name
    await firstProduct.click();

    // Verify navigation to product details page
    await expect(page).toHaveURL(/\/products\/[^/]+$/);

    // Verify selected product name is displayed
    await expect(
        page.getByRole('heading', { name: productName.trim() })
    ).toBeVisible();
});

test('CUS_FN005 - Verify adding a product to the cart', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  await expect(page).toHaveURL(/\/products/);

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Get product name
  const productName = (
    await firstProduct.locator('.product-name-link').textContent()
  ).trim();

  console.log('Selected product:', productName);

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Verify product appears in cart
  await expect(page.locator('body')).toContainText(productName);
});



test('CUS_FN006 - Verify updating product quantity', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Get product name
  const productName = (
    await firstProduct.locator('.product-name-link').textContent()
  ).trim();

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Find the selected product in the cart
  const cartRow = page.locator('.cart-row').filter({
    hasText: productName,
  });

  await expect(cartRow).toBeVisible();

  // Get the quantity controls
  const quantityControl = cartRow.locator('.qty-control');
  const quantity = quantityControl.locator('span');

  // Get the actual initial quantity
  const initialQuantity = Number(await quantity.textContent());

  // Get product unit price
  const priceText = await cartRow.locator('.cart-row-info small').textContent();

  const unitPrice = Number(
    priceText.match(/Rs\.\s*([\d,]+)/)[1].replace(/,/g, '')
  );

  // Increase quantity by 1
  await quantityControl.locator('button').nth(1).click();

  // Verify updated quantity
  const updatedQuantity = initialQuantity + 1;

  await expect(quantity).toHaveText(String(updatedQuantity));

  // Verify updated product total
  const expectedTotal = unitPrice * updatedQuantity;

  await expect(cartRow.locator('.cart-line-total'))
    .toHaveText(`Rs. ${expectedTotal.toLocaleString()}`);

  // Verify cart subtotal
  await expect(page.locator('.cart-summary'))
    .toContainText(`Rs. ${expectedTotal.toLocaleString()}`);

});


test('CUS_FN007 - Verify removing a product from the cart', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Get product name
  const productName = (
    await firstProduct.locator('.product-name-link').textContent()
  ).trim();

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Find the selected product in the cart
  const cartRow = page.locator('.cart-row').filter({
    hasText: productName,
  });

  await expect(cartRow).toBeVisible();

  // Remove product from cart
  await cartRow.getByRole('button', {
    name: 'Remove',
  }).click();

  // Verify product is removed
  await expect(cartRow).toHaveCount(0);

  // Verify empty cart message
  await expect(page.locator('body'))
    .toContainText(/your cart is empty|cart is empty/i);

});


test('CUS_FN008 - Verify checkout address submission', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Continue to checkout
  await page.getByRole('link', {
    name: /continue to checkout/i,
  }).click();

  await expect(page).toHaveURL(/\/checkout\/address/);

  // Fill delivery address
  await page.locator('[name="phone"]').fill('0771234567');

  await page.locator('[name="street"]').fill('No. 25, Main Street');

  await page.locator('[name="area"]').fill('Kadawatha');

  await page.locator('[name="city"]').fill('Kadawatha');

  // Submit address
  await page.locator('form button[type="submit"]').click();

  // Verify navigation to checkout summary
  await expect(page).toHaveURL(/\/checkout\/summary/, {
    timeout: 10000,
  });

});

test('CUS_FN009 - Verify placing an order', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Get product name
  const productName = (
    await firstProduct.locator('.product-name-link').textContent()
  ).trim();

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Continue to checkout
  await page.getByRole('link', {
    name: /continue to checkout/i,
  }).click();

  await expect(page).toHaveURL(/\/checkout\/address/);

  // Fill delivery address
  await page.locator('[name="phone"]').fill('0771234567');

  await page.locator('[name="street"]').fill('No. 25, Main Street');

  await page.locator('[name="area"]').fill('Kadawatha');

  await page.locator('[name="city"]').fill('Kadawatha');

  // Submit address
  await page.locator('form button[type="submit"]').click();

  // Verify order summary page
  await expect(page).toHaveURL(/\/checkout\/summary/, {
    timeout: 10000,
  });

  await expect(page.getByRole('heading', {
    name: 'Order Summary',
  })).toBeVisible();

  // Verify selected product
  await expect(page.locator('.summary-table'))
    .toContainText(productName);

  // Verify delivery address
  await expect(page.locator('.summary-right'))
    .toContainText('Kadawatha');

  // Verify payment method
  await expect(page.locator('.summary-right'))
    .toContainText('Cash on Delivery');

  // Place order
  await page.getByRole('button', {
    name: 'Place Order',
  }).click();

  // Verify order confirmation page
  await expect(page).toHaveURL(
    /\/order-confirmation\/[^/]+$/,
    { timeout: 15000 }
  );

});


test('CUS_FN010 - Verify order history and tracking', async ({ page }) => {

  // Login
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_CUSTOMER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_CUSTOMER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(url => url.pathname === '/', {
    timeout: 10000,
  });

  // Open Products page
  await page.getByRole('banner')
    .getByRole('link', { name: 'Products', exact: true })
    .click();

  // Wait for first product
  const firstProduct = page.locator('.product-card').first();

  await expect(firstProduct).toBeVisible({ timeout: 15000 });

  // Get product name
  const productName = (
    await firstProduct.locator('.product-name-link').textContent()
  ).trim();

  // Add product to cart
  await firstProduct.getByRole('button', {
    name: 'Add to Cart',
  }).click();

  // Open Cart
  await page.locator('a.cart-button[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart/);

  // Continue to checkout
  await page.getByRole('link', {
    name: /continue to checkout/i,
  }).click();

  await expect(page).toHaveURL(/\/checkout\/address/);

  // Fill delivery address
  await page.locator('[name="phone"]').fill('0771234567');

  await page.locator('[name="street"]').fill('No. 25, Main Street');

  await page.locator('[name="area"]').fill('Kadawatha');

  await page.locator('[name="city"]').fill('Kadawatha');

  // Submit address
  await page.locator('form button[type="submit"]').click();

  // Verify order summary
  await expect(page).toHaveURL(/\/checkout\/summary/, {
    timeout: 10000,
  });

  // Place order
  await page.getByRole('button', {
    name: 'Place Order',
  }).click();

  // Verify order confirmation
  await expect(page).toHaveURL(
    /\/order-confirmation\/[^/]+$/,
    { timeout: 15000 }
  );

  // Get order ID from confirmation URL
  const confirmationUrl = page.url();
  const orderId = confirmationUrl.split('/').pop();

  // Open order history
  await page.goto('/orders');

  // Verify order history page
  await expect(page.getByRole('heading', {
    name: 'Your orders',
  })).toBeVisible({ timeout: 15000 });

  // Find the newly placed order
  const orderCard = page.locator('.order-card').filter({
    hasText: orderId,
  });

  await expect(orderCard).toBeVisible();

  // Verify order ID
  await expect(orderCard.locator('.order-id'))
    .toHaveText(orderId);

  // Open order details
  await orderCard.getByRole('button', {
    name: /view details/i,
  }).click();

  // Verify order tracking/details page
  await expect(page).toHaveURL(`/orders/${orderId}`);

});
