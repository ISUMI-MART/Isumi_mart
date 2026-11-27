
import { test, expect } from '@playwright/test';

test('OWN_UI001 - Verify the owner dashboard display', async ({ page }) => {

  // Login as owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_OWNER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_OWNER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify owner dashboard
  await page.waitForURL('**/owner/overview', {
    timeout: 10000,
  });

  await expect(
    page.getByRole('heading', { name: 'Shop overview' })
  ).toBeVisible();

  await expect(page.getByText('Total orders')).toBeVisible();
  await expect(page.getByText('To be processed')).toBeVisible();
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.getByText('Low stock items')).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Recent orders' })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Inventory alerts' })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Quick actions' })
  ).toBeVisible();
});


test('OWN_FN002 - Verify adding a new product', async ({ page }) => {

  // Login as owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_OWNER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_OWNER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview', {
    timeout: 10000,
  });

  // Open Inventory page
  await page.goto('/owner/inventory');

  await expect(
    page.getByRole('heading', { name: 'Inventory' })
  ).toBeVisible();

  // Open Add Product form
  await page.getByRole('button', { name: /add product/i }).click();

  await expect(
    page.getByRole('heading', { name: 'Add New Product' })
  ).toBeVisible();

  // Enter product details
  const productName = `Test Product ${Date.now()}`;

  await page.locator('input[name="name"]').fill(productName);
  await page.locator('input[name="price"]').fill('250');
  await page.locator('input[name="unit"]').fill('pcs');

  // Select an existing category
  const categoryDropdown = page.locator('select[name="categorySlug"]');

  await expect(categoryDropdown.locator('option').nth(1)).toBeAttached({
  timeout: 10000,
});

  const categoryOptions = await categoryDropdown.locator('option').evaluateAll(
    options => options
      .map(option => option.value)
      .filter(value => value !== '')
  );

  expect(categoryOptions.length).toBeGreaterThan(0);

  await categoryDropdown.selectOption(categoryOptions[0]);

  // Submit product
  await page.getByRole('button', { name: 'Add Product', exact: true }).click();

  // Verify product is displayed
  await expect(page.getByRole('heading', { name: 'Add New Product' })).toBeHidden();

  await expect(
    page.getByRole('cell', { name: productName })
  ).toBeVisible({ timeout: 10000 });
});

test('OWN_FN003 - Verify updating product details', async ({ page }) => {

  // Login as owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_OWNER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_OWNER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview', {
    timeout: 10000,
  });

  // Open Inventory page
  await page.goto('/owner/inventory');

  await expect(
    page.getByRole('heading', { name: 'Inventory' })
  ).toBeVisible();

  // Select the first existing product
  const productRow = page.locator('tbody tr').first();

  await expect(productRow).toBeVisible();

  const originalName = await productRow
    .locator('.productcell .strong')
    .innerText();

  const originalPriceText = await productRow.locator('td').nth(2).innerText();
const originalPrice = originalPriceText.replace(/[^\d]/g, '').slice(0, -2);

  // Open Edit Product form
  await productRow.getByRole('button', { name: 'Edit' }).click();

  await expect(
    page.getByRole('heading', { name: 'Edit Product' })
  ).toBeVisible();

  // Update product details
  const updatedName = `Updated Product ${Date.now()}`;

  await page.locator('input[name="name"]').fill(updatedName);
  await page.locator('input[name="price"]').fill('350');

  await page.getByRole('button', {
    name: 'Update Product',
    exact: true,
  }).click();

  // Verify updated product details
  const updatedRow = page.locator('tbody tr').filter({
    hasText: updatedName,
  });

  await expect(updatedRow).toBeVisible({ timeout: 10000 });
  await expect(updatedRow).toContainText('350.00');

  // Restore original product details
  await updatedRow.getByRole('button', { name: 'Edit' }).click();

  await page.locator('input[name="name"]').fill(originalName);
  await page.locator('input[name="price"]').fill(originalPrice);

  await page.getByRole('button', {
    name: 'Update Product',
    exact: true,
  }).click();

  // Verify original name is restored
  await expect(
    page.locator('tbody tr').filter({ hasText: originalName }).first()
  ).toBeVisible({ timeout: 10000 });
});


test('OWN_FN004 - Verify deleting a product', async ({ page }) => {

  // Login as owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(
    process.env.E2E_OWNER_EMAIL
  );

  await page.locator('input[name="password"]').fill(
    process.env.E2E_OWNER_PASSWORD
  );

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview', {
    timeout: 10000,
  });

  // Open Inventory page
  await page.goto('/owner/inventory');

  await expect(
    page.getByRole('heading', { name: 'Inventory' })
  ).toBeVisible();

  // Select the first product
  const productRow = page.locator('tbody tr').first();

  await expect(productRow).toBeVisible();

  const productName = await productRow
    .locator('.productcell .strong')
    .innerText();

  // Handle browser confirmation dialog
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain(productName);
    await dialog.accept();
  });

  // Delete product
  await productRow.getByRole('button', { name: 'Delete' }).click();

  // Verify product is removed
  await expect(
    page.locator('tbody tr').filter({ hasText: productName })
  ).toHaveCount(0, { timeout: 10000 });
});


test('OWN_FN005 - Verify selecting a product category', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Inventory
  await page.goto('/owner/inventory');

  // Open Add Product form
  await page.getByRole('button', { name: /add product/i }).click();

  // Enter product details
  const productName = `Test Product ${Date.now()}`;

  await page.locator('input[name="name"]').fill(productName);
  await page.locator('input[name="price"]').fill('350');
  await page.locator('input[name="unit"]').fill('pcs');

  // Select an existing category
  const categoryDropdown = page.locator('select[name="categorySlug"]');

  await expect(categoryDropdown.locator('option').nth(1)).toBeAttached();

  const categoryOptions = await categoryDropdown.locator('option').evaluateAll(
    options => options
      .map(option => ({
        value: option.value,
        text: option.textContent.trim()
      }))
      .filter(option => option.value !== '')
  );

  expect(categoryOptions.length).toBeGreaterThan(0);

  const selectedCategory = categoryOptions[0];

  await categoryDropdown.selectOption(selectedCategory.value);

  // Submit the product form
  const productForm = page.locator('form').filter({
    has: categoryDropdown
  });

  await productForm.getByRole('button', {
    name: /add product|save product/i
  }).click();

  // Verify product was added with the selected category
  const productRow = page.locator('tbody tr').filter({
    hasText: productName
  });

  await expect(productRow).toBeVisible({ timeout: 10000 });
  await expect(productRow).toContainText(selectedCategory.text);

});

test('OWN_FN006 - Verify updating product stock', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Inventory
  await page.goto('/owner/inventory');

  // Select the first product
  const firstRow = page.locator('tbody tr').first();

  await expect(firstRow).toBeVisible();

  const productName = await firstRow.locator('.productcell .strong').innerText();

  // Open stock update form
  await firstRow.getByRole('button', { name: /update stock/i }).click();

  // Select Stock In
  await page.locator('select').filter({
    has: page.locator('option[value="IN"]')
  }).selectOption('IN');

  // Enter stock quantity
  await page.locator('input[type="number"]').last().fill('5');

  // Enter note
  await page.locator('textarea').fill('Playwright stock update test');


// Handle success alert
page.once('dialog', async dialog => {
  expect(dialog.message()).toMatch(/stock updated successfully/i);
  await dialog.accept();
});

// Confirm stock update
await page.getByRole('button', {
  name: /confirm stock update/i
}).click();


  // Verify the product still appears in inventory
  await expect(
    page.locator('tbody tr').filter({ hasText: productName })
  ).toBeVisible();

});


test('OWN_FN007 - Verify viewing customer orders', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Orders page
  await page.goto('/owner/orders');

  // Verify Orders page is displayed
  await expect(
    page.getByRole('heading', { name: /orders/i }).first()
  ).toBeVisible();

  // Verify customer orders are displayed
  const orderRows = page.locator('table tbody tr');

  await expect(orderRows.first()).toBeVisible({
    timeout: 10000
  });

  // Verify at least one order is available
  expect(await orderRows.count()).toBeGreaterThan(0);

});

test('OWN_FN008 - Verify updating order status', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Orders page
  await page.goto('/owner/orders');

  // Select the first order
  const firstRow = page.locator('table tbody tr').first();

  await expect(firstRow).toBeVisible({ timeout: 10000 });

const statusDropdown = firstRow.locator('select.status-select');

await expect(statusDropdown).toBeVisible();

  // Update order status to CONFIRMED
  await statusDropdown.selectOption('CONFIRMED');

  // Verify the updated status
  await expect(statusDropdown).toHaveValue('CONFIRMED');

});

test('OWN_FN009 - Verify viewing delivery agents', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Delivery Agents page
  await page.goto('/owner/delivery-agents');

  // Verify page heading
  await expect(
    page.getByRole('heading', { name: /delivery agents/i }).first()
  ).toBeVisible();

  // Verify delivery agents are displayed
  const agentRows = page.locator('table tbody tr');

  await expect(agentRows.first()).toBeVisible({
    timeout: 10000
  });

  // Verify at least one delivery agent exists
  expect(await agentRows.count()).toBeGreaterThan(0);

});

test('OWN_FN010 - Verify recording a walk-in sale', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Walk-in Sales page
  await page.goto('/owner/walk-in-sales');

  // Verify Walk-in Sales page
  await expect(
    page.getByRole('heading', { name: 'Walk-in Sales' })
  ).toBeVisible();

  // Wait for available products
  const products = page.locator('.pos-product');

  await expect(products.first()).toBeVisible({
    timeout: 10000
  });

  // Select the first available product
  const productName = await products.first().locator('b').innerText();

  await products.first().click();

  // Enter customer name
  await page.locator('.pos-label input').first().fill('Playwright Test Customer');

  // Verify product is added to the bill
  await expect(
    page.locator('.cart-item').filter({ hasText: productName })
  ).toBeVisible();

  // Complete the sale
  await page.getByRole('button', {
    name: /complete sale & generate bill/i
  }).click();

  // Verify receipt is generated
  await expect(
    page.getByText('Walk-in Sales Receipt')
  ).toBeVisible({ timeout: 15000 });

  await expect(
    page.getByText('Playwright Test Customer')
  ).toBeVisible();

  await expect(
    page.getByText('Payment recorded')
  ).toBeVisible();

  // Verify bill number
  await expect(page.getByText(/Bill No:/)).toBeVisible();

});

test('OWN_FN011 - Verify sales report display', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Reports page
  await page.goto('/owner/reports');

  // Verify Reports page heading
  await expect(
    page.getByRole('heading', { name: 'Reports' })
  ).toBeVisible({ timeout: 15000 });

  // Verify business statistics
  await expect(page.getByText('Total Sales', { exact: true })).toBeVisible();
  await expect(page.getByText('Total Revenue', { exact: true })).toBeVisible();
  await expect(page.getByText('Online Revenue', { exact: true })).toBeVisible();
  await expect(page.getByText('Walk-in Revenue', { exact: true })).toBeVisible();

  // Verify Sales Summary
  await expect(
    page.getByRole('heading', { name: 'Sales Summary' })
  ).toBeVisible();

  await expect(page.getByText(/Total sales:/)).toBeVisible();
  await expect(page.getByText(/Online revenue:/)).toBeVisible();
  await expect(page.getByText(/Walk-in revenue:/)).toBeVisible();
  await expect(page.getByText(/Total revenue:/)).toBeVisible();

  // Verify Order Summary
  await expect(
    page.getByRole('heading', { name: 'Order Summary' })
  ).toBeVisible();

  await expect(page.getByText(/Total online orders:/)).toBeVisible();
  await expect(page.getByText(/Delivered orders:/)).toBeVisible();
  await expect(page.getByText(/Total walk-in sales:/)).toBeVisible();

  // Verify Inventory Summary
  await expect(
    page.getByRole('heading', { name: 'Inventory Summary' })
  ).toBeVisible();

  await expect(page.getByText(/Total products:/)).toBeVisible();
  await expect(page.getByText(/Low stock products:/)).toBeVisible();
  await expect(page.getByText(/Out of stock products:/)).toBeVisible();

});

test('OWN_FN012 - Verify pagination in management pages', async ({ page }) => {

  // Login as Owner
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_OWNER_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_OWNER_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/owner/overview');

  // Navigate to Inventory page
  await page.goto('/owner/inventory');

  // Wait for products to load
  const productRows = page.locator('tbody tr');

  await expect(productRows.first()).toBeVisible({
    timeout: 10000
  });

  // Check pagination is available
  const nextButton = page.getByRole('button', { name: /next/i });

  await expect(nextButton).toBeVisible();

  // Verify initial page
  await expect(page.getByText('Page 1 of', { exact: false })).toBeVisible();

  // Move to next page
  await nextButton.click();

  // Verify page number changes
  await expect(page.getByText('Page 2 of', { exact: false })).toBeVisible();

  // Verify products are displayed on the second page
  await expect(productRows.first()).toBeVisible();

  // Move back to previous page
  await page.getByRole('button', { name: /previous/i }).click();

  // Verify first page is displayed again
  await expect(page.getByText('Page 1 of', { exact: false })).toBeVisible();

});
