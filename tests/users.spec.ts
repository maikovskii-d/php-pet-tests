import { test, expect } from '@playwright/test';

test('Sign in, admin', async ({ page }) => {
  await page.goto('http://localhost/sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin');
  
  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/');
});

test('Sign in, customer', async ({ page }) => {
  await page.goto('http://localhost/sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('Some_user');
  await page.getByRole('textbox', { name: 'password' }).fill('1234');
  
  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/');
});

test('Sign up and delete', async ({ page }) => {
  // Sign up

  await page.goto('http://localhost/sign_up.php');

  const username = 'new_user';

  await page.getByRole('textbox', { name: 'name' }).fill(username);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('123');
  await page.getByRole('textbox', { name: 'Repeat Password' }).fill('123');

  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/');

  await expect(page.getByText(username)).toBeVisible();

  // Delete

  await page.goto('http://localhost/sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin');

  await page.getByRole('button', { name: 'submit' }).click();

  await page.getByText('Admin Panel').click();
  await page.getByTestId(`delete_user_${username}`).click();
});

test('Sign out', async ({ page }) => {
  await page.goto('http://localhost/sign_in.php');

  await page.getByRole('textbox', { name: 'name' }).fill('Some_user');
  await page.getByRole('textbox', { name: 'password' }).fill('1234');
  
  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/');

  await page.getByText('Sign out').click();

  await expect(page).not.toHaveURL('http://localhost/');
  await expect(page).toHaveURL('http://localhost/sign_in.php');

  await page.goto('http://localhost/');

  await expect(page).not.toHaveURL('http://localhost/');
  await expect(page).toHaveURL('http://localhost/sign_in.php');
});