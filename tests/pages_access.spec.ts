import { test, expect } from '@playwright/test';

test('admin can see all pages', async ({ page }) => {
  await page.goto('http://localhost/page_sign_in.php');

  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Main Page
  await page.getByRole('textbox', { name: 'name' }).fill('admin');
  await page.getByRole('textbox', { name: 'password' }).fill('admin');
  
  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/page_main_page.php');
  
  // test Post Editor
  await page.getByRole('button', { name: 'edit' }).click();

  await expect(page).toHaveURL(/^http:\/\/localhost\/page_post_editor\.php\?id=\d+$/);

  // test Admin Panel
  await page.goto('http://localhost/page_admin_panel.php');

  await expect(page).toHaveURL('http://localhost/page_admin_panel.php');

  // test Sign up
  await page.goto('http://localhost/page_sign_up.php');

  await expect(page).toHaveURL('http://localhost/page_sign_up.php');

  // test Sign in
  await page.goto('http://localhost/page_sign_in.php');

  await expect(page).toHaveURL('http://localhost/page_sign_in.php');
});

test('customer can see only Main Page, Post Editor, Sign in, Sign up', async ({ page }) => {
  await page.goto('http://localhost/page_sign_in.php');

  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Main Page
  await page.getByRole('textbox', { name: 'name' }).fill('Some_user');
  await page.getByRole('textbox', { name: 'password' }).fill('1234');
  
  await page.getByRole('button', { name: 'submit' }).click();

  await expect(page).toHaveURL('http://localhost/page_main_page.php');
  
  // test Post Editor
  await page.getByRole('button', { name: 'edit' }).first().click();

  await expect(page).toHaveURL(/^http:\/\/localhost\/page_post_editor\.php\?id=\d+$/);

  // test Admin Panel
  await page.goto('http://localhost/page_admin_panel.php');

  await expect(page).not.toHaveURL('http://localhost/page_admin_panel.php');
  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Sign up
  await page.goto('http://localhost/page_sign_up.php');

  await expect(page).toHaveURL('http://localhost/page_sign_up.php');

  // test Sign in
  await page.goto('http://localhost/page_sign_in.php');

  await expect(page).toHaveURL('http://localhost/page_sign_in.php');
});

test('Unauthorized user can see only Sign in, Sign up', async ({ page }) => {
  // test Sign in
  await page.goto('http://localhost/page_sign_in.php');

  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Main Page
  await page.goto('http://localhost/page_main_page.php');

  await expect(page).not.toHaveURL('http://localhost/page_main_page.php');
  await expect(page).toHaveURL('http://localhost/page_sign_in.php');
  
  // test Post Editor
  await page.goto('http://localhost/page_post_editor.php');

  await expect(page).not.toHaveURL('http://localhost/page_post_editor.php');
  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  await page.goto('http://localhost/page_post_editor.php?id=1');
  await expect(page).not.toHaveURL('http://localhost/page_post_editor.php');
  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Admin Panel
  await page.goto('http://localhost/page_admin_panel.php');

  await expect(page).not.toHaveURL('http://localhost/page_admin_panel.php');
  await expect(page).toHaveURL('http://localhost/page_sign_in.php');

  // test Sign up
  await page.goto('http://localhost/page_sign_up.php');

  await expect(page).toHaveURL('http://localhost/page_sign_up.php');
});