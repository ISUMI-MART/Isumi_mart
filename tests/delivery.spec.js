
import { test, expect } from '@playwright/test';

test('DEL_UI001 - Verify the delivery dashboard display', async ({ page }) => {

  // Login as Delivery Agent
  await page.goto('/login');

  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);

  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify navigation to delivery dashboard
  await page.waitForURL('**/delivery');

  // Verify dashboard welcome heading
  await expect(
    page.getByRole('heading', { name: /good day/i })
  ).toBeVisible();

  // Verify delivery agent workspace
  await expect(
    page.getByText('DELIVERY PARTNER WORKSPACE')
  ).toBeVisible();

  // Verify availability status
  await expect(
    page.getByText('Available for deliveries')
  ).toBeVisible();

  // Verify delivery queue
  await expect(
    page.getByRole('heading', { name: 'Delivery queue' })
  ).toBeVisible();

  // Verify delivery checklist
  await expect(
    page.getByRole('heading', { name: 'Delivery checklist' })
  ).toBeVisible();

  // Verify delivery queue panel is displayed
  await expect(
    page.locator('.grid2 .panel').first()
  ).toBeVisible();

});


test('DEL_FN002 - Verify viewing assigned deliveries', async ({ page }) => {
  // Login as Delivery Agent
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/delivery');

  // Verify My Deliveries page
  await expect(page.getByRole('link', { name: /my deliveries/i })).toBeVisible();

  // Verify delivery queue
  await expect(page.getByRole('heading', { name: 'Delivery queue' })).toBeVisible();

  // Verify assigned delivery cards
  const deliveryQueue = page.locator('.panel').filter({
    has: page.getByRole('heading', { name: 'Delivery queue' })
  });

  const deliveryCards = deliveryQueue.locator('button');

  const emptyMessage = deliveryQueue.getByText(
    /no deliveries assigned yet|no deliveries in this list/i
  );

  await expect(deliveryCards.first().or(emptyMessage)).toBeVisible();
});


test('DEL_FN003 - Verify viewing order details', async ({ page }) => {
  // Login as Delivery Agent
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/delivery');

  // Find the delivery queue
  const deliveryQueue = page.locator('.panel').filter({
    has: page.getByRole('heading', { name: 'Delivery queue' })
  });

  // Select the first assigned delivery
  const deliveryCard = deliveryQueue.locator('button').first();
  await expect(deliveryCard).toBeVisible({ timeout: 10000 });

  const orderId = (await deliveryCard.locator('.strong').first().innerText()).trim();
  const customerName = (await deliveryCard.locator('div').nth(1).innerText()).trim();

  await deliveryCard.click();

  // Verify delivery details are displayed
  await expect(page.getByRole('heading', { name: 'Delivery details' })).toBeVisible();
await expect(
  page.locator('.pill.blue').filter({ hasText: orderId })
).toBeVisible();
  await expect(page.getByRole('heading', { name: customerName })).toBeVisible();

  // Verify order information
  await expect(page.getByRole('heading', { name: 'Order items' })).toBeVisible();
  await expect(page.getByText('Total to collect')).toBeVisible();
  await expect(page.getByText('Payment: Cash on Delivery')).toBeVisible();
});


test('DEL_FN004 - Verify marking an order as delivered', async ({ page }) => {
  // Login as Delivery Agent
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/delivery');

  // Find the first assigned delivery
// Find an active delivery
const deliveryQueue = page.locator('.panel').filter({
  has: page.getByRole('heading', { name: 'Delivery queue' })
});

const activeCards = deliveryQueue.locator('button').filter({
  has: page.locator('.pill').filter({
    hasText: /^(Assigned|Picked up|On the way)$/
  })
});

await expect(activeCards.first()).toBeVisible({ timeout: 10000 });

const deliveryCard = activeCards.first();

  const orderId = (await deliveryCard.locator('.strong').first().innerText()).trim();

  // Select the order
  await deliveryCard.click();

  await expect(page.getByRole('heading', { name: 'Delivery details' })).toBeVisible();

  // Get the delivery status dropdown
  const statusDropdown = page.locator('.formgrid select').first();

  // Change status to Picked up
  await statusDropdown.selectOption('PICKED_UP');
  await expect(statusDropdown).toHaveValue('PICKED_UP');

  // Change status to On the way
  await statusDropdown.selectOption('OUT_FOR_DELIVERY');
  await expect(statusDropdown).toHaveValue('OUT_FOR_DELIVERY');

  // Mark the order as delivered
  const deliveredButton = page.getByRole('button', { name: /mark as delivered/i });
  await expect(deliveredButton).toBeVisible();
  await deliveredButton.click();

  // Verify successful status update
  await expect(page.getByText('Order status updated successfully.')).toBeVisible();

  // Verify the final status
  await expect(statusDropdown).toHaveValue('DELIVERED');

  // Verify the selected order is marked as delivered
  await expect(
    page.locator('.pill.blue').filter({ hasText: orderId })
  ).toBeVisible();
});


test('DEL_FN005 - Verify marking an order as not delivered', async ({ page }) => {
  // Login as Delivery Agent
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/delivery');

  // Find the first assigned delivery

const deliveryQueue = page.locator('.panel').filter({
  has: page.getByRole('heading', { name: 'Delivery queue' })
});

const activeCards = deliveryQueue.locator('button').filter({
  has: page.locator('.pill').filter({
    hasText: /^(Assigned|Picked up|On the way)$/
  })
});

await expect(activeCards.first()).toBeVisible({ timeout: 10000 });

const deliveryCard = activeCards.first();
  const orderId = (await deliveryCard.locator('.strong').first().innerText()).trim();

  // Select the order
  await deliveryCard.click();

  await expect(page.getByRole('heading', { name: 'Delivery details' })).toBeVisible();

  // Open the status dropdown
  const statusDropdown = page.locator('.formgrid select').first();

  // Move order to Picked up if currently Assigned
  if (await statusDropdown.inputValue() === 'ASSIGNED') {
    await statusDropdown.selectOption('PICKED_UP');
  }

  // Move order to On the way if currently Picked up
  if (await statusDropdown.inputValue() === 'PICKED_UP') {
    await statusDropdown.selectOption('OUT_FOR_DELIVERY');
  }

  // Select Not Delivered
  await statusDropdown.selectOption('DELIVERY_FAILED');

  // Verify failure reason form
  await expect(
    page.getByRole('heading', { name: "Why couldn't you deliver this order?" })
  ).toBeVisible();

  // Select failure reason
  await page.locator('.delivery-failure-form select').selectOption('Customer unavailable');

  // Enter additional details
  await page.getByPlaceholder('Enter additional details...').fill(
    'Customer was not available at the delivery address.'
  );

  // Submit failure reason
  await page.getByRole('button', { name: 'Submit reason' }).click();

  // Verify successful update
  await expect(page.getByText('Order status updated successfully.')).toBeVisible();

  // Verify failed delivery status and reason
await expect(
  deliveryQueue.locator('button').filter({ hasText: orderId })
    .locator('.pill.orange')
).toHaveText('Not Delivered');
  await expect(page.getByText('Delivery Unsuccessful')).toBeVisible();
  await expect(page.getByText('Reason: Customer unavailable')).toBeVisible();
  await expect(
    page.getByText('Details: Customer was not available at the delivery address.')
  ).toBeVisible();

  // Verify correct order remains selected
  await expect(
    page.locator('.pill.blue').filter({ hasText: orderId })
  ).toBeVisible();
});

test('DEL_FN006 - Verify viewing completed deliveries', async ({ page }) => {
  // Login as Delivery Agent
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(process.env.E2E_DELIVERY_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.E2E_DELIVERY_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL('**/delivery');

  // Open Completed Deliveries
  await page.getByRole('link', { name: /completed/i }).click();
  await page.waitForURL('**/delivery/completed');

  // Verify completed deliveries page
  await expect(
    page.getByRole('heading', { name: 'Completed deliveries' })
  ).toBeVisible();

  // Find completed delivery records
  const completedPanel = page.locator('.panel').filter({
    has: page.getByRole('heading', { name: 'Completed deliveries' })
  });

  const completedCards = completedPanel.locator('button');
  const emptyMessage = completedPanel.getByText('No completed deliveries yet');

  // Verify completed records or the empty message
  await expect(completedCards.first().or(emptyMessage)).toBeVisible();

  // If completed orders exist, verify their status
  if (await completedCards.count() > 0) {
    await expect(completedCards.first().getByText('Delivered', { exact: true })).toBeVisible();
  }
});
